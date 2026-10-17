import * as THREE from 'three';
import { MODEL_POSITIONS } from './modelPositions.js';

// ==========================================================================
//  LETRAS.JS — LETRAS 3D «J» Y «V» + CORAZONES ORBITANDO
// --------------------------------------------------------------------------
//  Lee del MISMO archivo de configuración (modelPositions.js) las entradas
//  marcadas con `primitive: 'letter'`. No cargan ningún .glb: la geometría
//  de cada letra se genera a mano (extrusión de una silueta), igual que los
//  corazones decorativos del mundo, y alrededor de cada letra giran unos
//  corazones 3D pequeños definidos en `orbitHearts`.
//
//  Para mover/girar/escalar una letra NO se toca este archivo: se editan
//  `position`, `rotation`, `scale` o `orbitHearts` en modelPositions.js.
// ==========================================================================

const letterConfigs = Object.values(MODEL_POSITIONS).filter((cfg) => cfg.primitive === 'letter');

// Geometría del corazón (la misma silueta que usan las decoraciones del
// mundo). Se crea UNA sola vez y se comparte entre todos los corazones.
const heartGeometry = makeHeartGeometry();

export function createLetters(scene) {
  const group = new THREE.Group();
  group.name = 'letter-decoration';
  letterConfigs.forEach((cfg) => group.add(createLetterHolder(cfg)));
  scene.add(group);
  return group;
}

function createLetterHolder(cfg) {
  const holder = new THREE.Group();
  holder.name = cfg.id;
  holder.position.set(cfg.position.x, cfg.position.y, cfg.position.z);
  holder.rotation.set(
    THREE.MathUtils.degToRad(cfg.rotation?.x || 0),
    THREE.MathUtils.degToRad((cfg.rotation?.y || 0) + (cfg.orientationFix || 0)),
    THREE.MathUtils.degToRad(cfg.rotation?.z || 0)
  );

  const model = buildLetterModel(cfg.glyph, cfg.color);
  model.scale.setScalar(cfg.scale ?? 1);
  holder.add(model);

  // Altura real de la letra ya escalada (para centrar la órbita de corazones).
  const size = new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3());

  const hearts = [];
  const orbit = cfg.orbitHearts;
  if (orbit && orbit.count) {
    const color = orbit.color || cfg.color || 0xff9ec6;
    for (let i = 0; i < orbit.count; i += 1) {
      const mesh = new THREE.Mesh(heartGeometry, new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.3,
        roughness: 0.6,
        side: THREE.DoubleSide
      }));
      mesh.scale.setScalar(orbit.size ?? 0.1);
      mesh.rotation.z = Math.PI;
      mesh.add(new THREE.LineSegments(
        new THREE.EdgesGeometry(heartGeometry, 30),
        new THREE.LineBasicMaterial({ color: 0x180d35, transparent: true, opacity: 0.75 })
      ));
      holder.add(mesh);
      hearts.push({ mesh, baseAngle: (i / orbit.count) * Math.PI * 2 });
    }
  }

  holder.userData = {
    cfg,
    model,
    hearts,
    centerY: size.y * 0.5,
    baseY: cfg.position.y
  };
  return holder;
}

// Construye la letra como geometría extruida, con base en y=0 y centrada en
// X/Z (mismo criterio que los modelos .glb que centra characters.js).
function buildLetterModel(glyph, color) {
  const geometry = new THREE.ExtrudeGeometry(makeLetterShape(glyph), {
    depth: 0.28,
    bevelEnabled: true,
    bevelSize: 0.05,
    bevelThickness: 0.04,
    bevelSegments: 2
  });
  geometry.computeBoundingBox();
  const box = geometry.boundingBox;
  geometry.translate(
    -(box.min.x + box.max.x) / 2,
    -box.min.y,
    -(box.min.z + box.max.z) / 2
  );

  const group = new THREE.Group();
  const accent = color ?? 0xff9ec6;
  const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
    color: accent,
    emissive: accent,
    emissiveIntensity: 0.32,
    roughness: 0.55,
    side: THREE.DoubleSide
  }));
  group.add(mesh);
  group.add(new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry, 30),
    new THREE.LineBasicMaterial({ color: 0x180d35, transparent: true, opacity: 0.85 })
  ));
  return group;
}

// Silueta de la letra en un cuadrado de ~1 unidad de alto (base en y=0).
function makeLetterShape(glyph) {
  const shape = new THREE.Shape();
  if (glyph === 'V') {
    shape.moveTo(-0.40, 1.00);
    shape.lineTo(-0.16, 1.00);
    shape.lineTo( 0.00, 0.34);
    shape.lineTo( 0.16, 1.00);
    shape.lineTo( 0.40, 1.00);
    shape.lineTo( 0.00, 0.00);
    shape.closePath();
  } else {
    // «J»: asta a la derecha que baja y engancha hacia la izquierda.
    shape.moveTo( 0.06, 1.00);
    shape.lineTo( 0.30, 1.00);
    shape.lineTo( 0.30, 0.24);
    shape.bezierCurveTo( 0.30, -0.10,  0.06, -0.16, -0.10, -0.16);
    shape.bezierCurveTo(-0.34, -0.16, -0.42,  0.02, -0.42,  0.22);
    shape.lineTo(-0.18, 0.22);
    shape.bezierCurveTo(-0.18,  0.10, -0.14,  0.04, -0.02,  0.04);
    shape.bezierCurveTo( 0.06,  0.04,  0.06,  0.10,  0.06,  0.24);
    shape.closePath();
  }
  return shape;
}

function makeHeartGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, -0.7);
  shape.bezierCurveTo(-1.3, -1.5, -2.1, 0.1, 0, 1.3);
  shape.bezierCurveTo(2.1, 0.1, 1.3, -1.5, 0, -0.7);
  return new THREE.ExtrudeGeometry(shape, { depth: 0.3, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.04 });
}

export function animateLetters(group, time) {
  group.children.forEach((holder) => {
    const { cfg, hearts, centerY, baseY } = holder.userData;
    if (!cfg) return;

    // Flotación vertical suave (igual que el resto de personajes).
    const float = cfg.float;
    if (float) {
      holder.position.y = baseY + Math.sin(time * float.speed + float.phase) * float.amplitude;
    }

    const orbit = cfg.orbitHearts;
    if (!orbit) return;
    const speed = orbit.speed ?? 0.5;
    hearts.forEach((heart) => {
      const angle = heart.baseAngle + time * 0.001 * speed;
      heart.mesh.position.set(
        Math.cos(angle) * orbit.radius,
        centerY + Math.sin(angle * 1.3) * orbit.verticalRadius,
        Math.sin(angle) * orbit.radius
      );
      // El corazón se mantiene vertical mientras orbita.
      heart.mesh.rotation.set(0, 0, Math.PI);
    });
  });
}
