import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { clone as cloneSkinned } from 'three/addons/utils/SkeletonUtils.js';
import { MODEL_POSITIONS } from './modelPositions.js';

// Parámetros fijos del balanceo de los modelos con type 'sway'
// (vaivén vertical + giro lateral). Las posiciones vienen de modelPositions.js.
const SWAY_BOB = { speed: 0.00065, amplitude: 0.14 };
const SWAY_TURN = { speed: 0.00035, amplitude: 0.08 };

const gltfCache = new Map();
const loader = new GLTFLoader();

// ── Compatibilidad con materiales antiguos ────────────────────────────────
// Algunos .glb (p. ej. roblox-bacon-boy) declaran la extensión
// KHR_materials_pbrSpecularGlossiness. El GLTFLoader moderno ya no la
// soporta: al no entenderla, descartaba la textura de color y el modelo se
// veía gris/blanco. Este plugin mínimo la traduce a un MeshStandardMaterial
// tomando `diffuseTexture` como mapa de color (map).
class GLTFMaterialsPbrSpecularGlossiness {
  constructor(parser) {
    this.parser = parser;
    this.name = 'KHR_materials_pbrSpecularGlossiness';
  }
  getMaterialType(materialIndex) {
    const materialDef = this.parser.json.materials[materialIndex];
    return materialDef.extensions && materialDef.extensions[this.name] ? THREE.MeshStandardMaterial : null;
  }
  extendMaterialParams(materialIndex, materialParams) {
    const parser = this.parser;
    const materialDef = parser.json.materials[materialIndex];
    if (!materialDef.extensions || !materialDef.extensions[this.name]) return Promise.resolve();
    const ext = materialDef.extensions[this.name];
    const pending = [];
    materialParams.color = new THREE.Color(1, 1, 1);
    materialParams.opacity = 1;
    materialParams.metalness = 0;
    materialParams.roughness = 1 - (ext.glossinessFactor !== undefined ? ext.glossinessFactor : 1);
    const diffuse = ext.diffuseFactor || [1, 1, 1, 1];
    materialParams.color.setRGB(diffuse[0], diffuse[1], diffuse[2], THREE.LinearSRGBColorSpace);
    materialParams.opacity = diffuse[3];
    if (ext.diffuseTexture !== undefined) {
      pending.push(parser.assignTexture(materialParams, 'map', ext.diffuseTexture, THREE.SRGBColorSpace));
    }
    return Promise.all(pending);
  }
}
loader.register((parser) => new GLTFMaterialsPbrSpecularGlossiness(parser));

export function createCharacters(heartWorld, camera) {
  const system = new THREE.Group();
  system.name = 'character-system';
  system.userData.externalCharacters = [];
  system.userData.heartWorld = heartWorld;

  // Padres posibles: 'heart' cuelga del corazón (hereda su vaivén);
  // 'world' queda fijo en la escena. La cámara ya no se usa para colocar
  // nada: todas las posiciones salen de modelPositions.js.
  const parents = { heart: system, world: heartWorld.parent };

  Object.values(MODEL_POSITIONS).forEach((cfg) => {
    // Las entradas sin `file` (p. ej. las letras 3D) no son modelos .glb y
    // las construye js/letters.js; aquí se ignoran.
    if (!cfg.file) return;
    const holder = createHolder(parents[cfg.group] || system, cfg, heartWorld);
    if (cfg.group === 'world') system.userData.externalCharacters.push(holder);
    if (cfg.id === 'momonga') system.userData.momongaHolder = holder;
    if (cfg.id === 'trader') system.userData.traderHolder = holder;
  });

  // Lista única con TODOS los holders. Se calcula una sola vez (ya no cambia)
  // para no crear un array nuevo en cada fotograma al animar.
  system.userData.allHolders = [...system.children, ...system.userData.externalCharacters];

  return system;
}

function createHolder(parent, cfg, heartWorld) {
  const type = resolveType(cfg);
  // `orientationFix` (grados) se suma al giro base: sirve para corregir
  // .glb exportados mirando al lado contrario (p. ej. roblox-bacon-girl)
  // sin tocar su posición ni su escala.
  const baseRotation = {
    x: THREE.MathUtils.degToRad(cfg.rotation?.x || 0),
    y: THREE.MathUtils.degToRad((cfg.rotation?.y || 0) + (cfg.orientationFix || 0)),
    z: THREE.MathUtils.degToRad(cfg.rotation?.z || 0)
  };
  const holder = new THREE.Group();
  holder.name = cfg.id;
  holder.userData = { cfg, type, loaded: false, model: null, baseRotation };
  parent.add(holder);
  applyModelPosition(holder, cfg, parent, heartWorld);

  // Una luz suave solo aparece si el modelo define `color`.
  if (cfg.color !== undefined && cfg.color !== null) {
    holder.add(new THREE.PointLight(cfg.color, 1.1, 5, 2));
  }

  loadTemplate(cfg).then((template) => {
    // cloneSkinned rebinds el esqueleto dentro de la copia (imprescindible
    // para modelos animados por huesos, como bunny2 o minecraft). Para los
    // modelos sin huesos equivale a un clone normal.
    const model = cloneSkinned(template);
    prepareModel(model, cfg, baseRotation);
    holder.userData.model = model;
    holder.userData.loaded = true;
    holder.add(model);
  }).catch((error) => console.error(`No se pudo cargar ${cfg.file}.`, error));

  return holder;
}

function resolveType(cfg) {
  if (cfg.type === 'existing') return cfg.float ? 'floating' : 'sway';
  if (cfg.type === 'floating' && !cfg.float) return 'static';
  return cfg.type || (cfg.float ? 'floating' : 'sway');
}

// Traduce la posición en coordenadas de MUNDO (como se escribe en
// modelPositions.js) a la posición local del padre del modelo.
function applyModelPosition(holder, cfg, parent, heartWorld) {
  const heartBob = heartWorld.position.y;
  heartWorld.position.y = 0; // el corazón reposa en y=0 al cargar
  heartWorld.updateMatrixWorld(true);
  parent.updateMatrixWorld(true);
  const worldTarget = new THREE.Vector3(cfg.position.x, cfg.position.y, cfg.position.z);
  holder.position.copy(parent.worldToLocal(worldTarget));
  holder.userData.basePosition = holder.position.clone();
  heartWorld.position.y = heartBob;
  heartWorld.updateMatrixWorld(true);
}

// Centra el modelo en X/Z y apoya su base (pies) en el origen del holder,
// con la escala final definida en la configuración. La medida se toma tras
// aplicar la escala para que la geometría resultante sea idéntica a la
// anterior (los modelos con huesos ya traen su esqueleto dentro de la copia).
function prepareModel(model, cfg, baseRotation) {
  model.rotation.set(0, 0, 0);
  model.scale.setScalar(cfg.scale);
  model.position.set(0, 0, 0);
  model.updateMatrixWorld(true);

  const bounds = new THREE.Box3().setFromObject(model);
  const center = bounds.getCenter(new THREE.Vector3());
  model.position.set(-center.x, -bounds.min.y, -center.z);

  // La rotación base (en radianes) se aplica después de centrar, de modo
  // que el modelo gira alrededor de sus pies.
  model.rotation.set(baseRotation.x, baseRotation.y, baseRotation.z);
  model.updateMatrixWorld(true);
  model.visible = true;
  model.traverse((child) => {
    if (!child.isMesh) return;
    child.visible = true;
    child.castShadow = false;
    child.receiveShadow = false;
    if (child.material) {
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      child.material = materials.map((material) => {
        const clone = material.clone();
        clone.needsUpdate = true;
        clone.roughness = Math.max(clone.roughness ?? .6, .55);
        return clone;
      });
      if (child.material.length === 1) child.material = child.material[0];
    }
  });
}

function loadTemplate(cfg) {
  if (!gltfCache.has(cfg.file)) {
    gltfCache.set(cfg.file, new Promise((resolve, reject) => loader.load(cfg.file, (gltf) => resolve(gltf.scene), undefined, reject)));
  }
  return gltfCache.get(cfg.file);
}

export function animateCharacters(system, time) {
  (system.userData.allHolders || system.children).forEach((holder) => {
    const { cfg, type, basePosition, baseRotation, model } = holder.userData;
    if (!cfg || !basePosition) return;
    if (type === 'floating') {
      const float = cfg.float;
      if (!float) return;
      holder.position.set(
        basePosition.x,
        basePosition.y + Math.sin(time * float.speed + float.phase) * float.amplitude,
        basePosition.z
      );
    } else if (type === 'sway') {
      const phase = cfg.sway?.phase || 0;
      holder.position.set(
        basePosition.x,
        basePosition.y + Math.sin(time * SWAY_BOB.speed + phase) * SWAY_BOB.amplitude,
        basePosition.z
      );
      if (model) {
        model.rotation.set(
          baseRotation.x,
          baseRotation.y + Math.sin(time * SWAY_TURN.speed + phase) * SWAY_TURN.amplitude,
          baseRotation.z
        );
      }
    }
    // type 'static' no hace nada: el modelo queda exactamente en su posición.
  });
}
