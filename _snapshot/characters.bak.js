import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { expandWorldPosition } from './spatial.js';

// Every entry below creates exactly one visible model instance.
const featuredSpecs = [
  { id: 'usagi', file: 'assets/models/Usagi.glb', modelId: 'edeb7465e9894aa7b0d205216ffde45d', targetSize: null, color: 0xc9b6ff, position: { x: -3.5, y: 2.65, z: .25 }, phase: 0, floatAmplitude: .1, floatSpeed: .0007 },
  { id: 'momonga', file: 'assets/models/momonga.glb', modelId: 'bc4963046e874b8da0dc3bfa6ec68105', targetSize: 1.75, color: 0xffc3de, position: { x: 3.25, y: 3.25, z: .25 }, phase: Math.PI, floatAmplitude: .1, floatSpeed: .00065 }
];

const placedSpecs = [
  ['mob-egg-head-01', 'mob_egg_head.glb', 'c6bef34cbdf740f0aa8515dbaa310c80', -10, 1, -13, .9, 0xff9fc6],
  ['mob-egg-head-02', 'mob_egg_head.glb', 'c6bef34cbdf740f0aa8515dbaa310c80', 11, -4, 12, .88, 0xb9a7ff],
  ['mob-egg-head-03', 'mob_egg_head.glb', 'c6bef34cbdf740f0aa8515dbaa310c80', 12, 10, 15, .92, 0x8de4ee],
  ['chiikawa', 'chiikawa.glb', 'e0ededadc41149dbbc80774d021a50e7', -15, 5, 13, .95, 0xffd3e5],
  ['black-cat', 'black_cat.glb', '98da5c4c2fff4c05898ba82c244b9eec', 16, 4, -8, .75, 0x9c7dff],
  ['stylized-ghost-01', 'stylized_ghost.glb', '12b711d0fa034c689c8751bce6266df4', -14, -3, 9, .82, 0xb8a8ff],
  ['stylized-ghost-02', 'stylized_ghost.glb', '12b711d0fa034c689c8751bce6266df4', 15, 8, 12, .78, 0xffa9d0],
  ['pumpkin-01', 'halloween_pumpkin_low_poly.glb', '8259b8b0fbfa45f69dcfdb8a0d14e568', -13, -6, -8, .62, 0xff9d63],
  ['pumpkin-02', 'halloween_pumpkin_low_poly.glb', '8259b8b0fbfa45f69dcfdb8a0d14e568', 13, -5, 10, .56, 0xffbd6a],
  ['pumpkin-03', 'halloween_pumpkin_low_poly.glb', '8259b8b0fbfa45f69dcfdb8a0d14e568', -10, 8, 10, .6, 0xc084ff],
  ['ribbon-01', 'ribbon_2.glb', 'de2d0e3416224e5e807bc794eb7d0d49', -9, 4, 9, .7, 0xff9fc9],
  ['ribbon-02', 'ribbon_2.glb', 'de2d0e3416224e5e807bc794eb7d0d49', 9, 3, 10, .64, 0xb69aff],
  ['ribbon-03', 'ribbon_2.glb', 'de2d0e3416224e5e807bc794eb7d0d49', -13, 7, 12, .76, 0x94e7ee],
  ['ribbon-04', 'ribbon_2.glb', 'de2d0e3416224e5e807bc794eb7d0d49', 13, -7, 12, .7, 0xff7d9e],
  ['ribbon-05', 'ribbon_2.glb', 'de2d0e3416224e5e807bc794eb7d0d49', 2, 11, 14, .62, 0xffffff],
  ['spooky-cat-01', 'cute_spooky_cat.glb', '563ee36ca4904008a55ff4deb4f48209', -13, -8, 5, .74, 0xc29dff],
  ['spooky-cat-02', 'cute_spooky_cat.glb', '563ee36ca4904008a55ff4deb4f48209', 14, 2, 11, .74, 0xffa9cf],
  ['cute-cat-assignment', 'cute_cat_assignment.glb', 'efe9f196e1d74c5c923b50182b5fd8d0', -8, -6, 12, .76, 0xffb7d6],
  ['cute-cat-model', 'cute_cat_model.glb', '62b9adea5c7b4e31bb016a902b07fe5c', -5.8, -6, 12, .76, 0xffdca8]
].map(([id, file, modelId, x, y, z, targetSize, color], index) => ({ id, file: `assets/models/${file}`, modelId, targetSize, color, position: expandWorldPosition({ x, y, z }), phase: index * .73 }));

const gltfCache = new Map();
const loader = new GLTFLoader();
const traderSpec = { id: 'trader', source: 'assets/models/trader.usdz', runtime: 'assets/models/trader.glb', position: { x: 0, y: 0, z: 0 }, phase: 2.4, floatAmplitude: .06, floatSpeed: .00055 };
const bunnySpec = { id: 'bunny2', source: 'assets/models/bunny2.glb', runtime: 'assets/models/bunny2.glb', position: { x: 0, y: 0, z: 0 }, phase: 4.1, floatAmplitude: .05, floatSpeed: .0005 };
const minecraftSpec = { id: 'minecraft', source: 'assets/models/minecraft.glb', runtime: 'assets/models/minecraft.glb', position: { x: 0, y: 0, z: 0 }, phase: 3.1, floatAmplitude: .06, floatSpeed: .00055 };

export function createCharacters(heartWorld, camera) {
  const system = new THREE.Group();
  system.name = 'character-system';
  system.userData.externalCharacters = [];
  system.userData.heartWorld = heartWorld;
  const specialPhoto = heartWorld.userData.photo;
  let momongaHolder = null;

  featuredSpecs.forEach((spec) => {
    if (spec.id === 'usagi' && !specialPhoto) {
      console.error('No se encontro la fotografia especial para colocar Usagi.glb.');
      return;
    }
    const parent = spec.id === 'usagi' ? specialPhoto.parent.parent : system;
    const holder = addCharacter(parent, spec, false, spec.id === 'usagi' ? specialPhoto : null);
    if (spec.id === 'usagi') system.userData.externalCharacters.push(holder);
    if (spec.id === 'momonga') momongaHolder = holder;
  });
  placedSpecs.forEach((spec) => addCharacter(system, spec, false));
  system.userData.traderHolder = addTrader(heartWorld, system);
  system.userData.externalCharacters.push(system.userData.traderHolder);
  system.userData.momongaHolder = momongaHolder;
  system.userData.externalCharacters.push(addBunny(heartWorld.parent, camera, system));
  system.userData.externalCharacters.push(addMinecraft(heartWorld, system));
  return system;
}

function addTrader(heartWorld, system) {
  const holder = new THREE.Group();
  holder.name = traderSpec.id;
  holder.userData = { spec: traderSpec, loaded: false, model: null };
  heartWorld.parent.add(holder);
  loadTemplate({ file: traderSpec.runtime }).then((model) => {
    normalizeModel(model, null);
    holder.add(model);
    holder.userData.model = model;
    holder.userData.loaded = true;
    positionBelowHeart(holder, model, heartWorld);
    system.userData.pendingTraderSize = { holder, model };
  }).catch((error) => console.error(`No se pudo cargar ${traderSpec.source} (runtime ${traderSpec.runtime}).`, error));
  return holder;
}

function positionBelowHeart(holder, model, heartWorld) {
  heartWorld.updateMatrixWorld(true);
  holder.parent.updateMatrixWorld(true);
  holder.updateMatrixWorld(true);
  model.updateMatrixWorld(true);

  const heartBounds = new THREE.Box3().setFromObject(heartWorld.children[0]);
  const heartCenter = heartBounds.getCenter(new THREE.Vector3());
  const traderBounds = new THREE.Box3().setFromObject(model);
  const traderSize = traderBounds.getSize(new THREE.Vector3());
  const traderCenter = traderBounds.getCenter(new THREE.Vector3());
  const desiredWorld = new THREE.Vector3(
    heartCenter.x,
    heartBounds.min.y - .5 - traderSize.y * .5,
    heartCenter.z
  );
  const holderWorld = holder.getWorldPosition(new THREE.Vector3()).add(desiredWorld.sub(traderCenter));
  holder.position.copy(holder.parent.worldToLocal(holderWorld));
  holder.userData.basePosition = holder.position.clone();
  traderSpec.position = { x: holder.position.x, y: holder.position.y, z: holder.position.z };
}

function addMinecraft(heartWorld, system) {
  const holder = new THREE.Group();
  holder.name = minecraftSpec.id;
  holder.userData = { spec: minecraftSpec, loaded: false, model: null };
  heartWorld.parent.add(holder);
  loadTemplate({ file: minecraftSpec.runtime }).then((model) => {
    normalizeModel(model, null);
    holder.add(model);
    holder.userData.model = model;
    holder.userData.loaded = true;
    system.userData.pendingMinecraftSize = { holder, model };
  }).catch((error) => console.error(`No se pudo cargar ${minecraftSpec.source} (runtime ${minecraftSpec.runtime}).`, error));
  return holder;
}

function positionMinecraftBelowHeart(holder, model, heartWorld) {
  heartWorld.updateMatrixWorld(true);
  holder.parent.updateMatrixWorld(true);
  holder.updateMatrixWorld(true);
  model.updateMatrixWorld(true);

  const heartBounds = new THREE.Box3().setFromObject(heartWorld.children[0]);
  const heartCenter = heartBounds.getCenter(new THREE.Vector3());
  const minecraftBounds = new THREE.Box3().setFromObject(model);
  const minecraftSize = minecraftBounds.getSize(new THREE.Vector3());
  const minecraftCenter = minecraftBounds.getCenter(new THREE.Vector3());
  const gap = 1.0;
  const desiredWorld = new THREE.Vector3(
    heartCenter.x,
    heartBounds.min.y - gap - minecraftSize.y * .5,
    heartCenter.z
  );
  const holderWorld = holder.getWorldPosition(new THREE.Vector3()).add(desiredWorld.sub(minecraftCenter));
  holder.position.copy(holder.parent.worldToLocal(holderWorld));
  holder.userData.basePosition = holder.position.clone();
  minecraftSpec.position = { x: holder.position.x, y: holder.position.y, z: holder.position.z };
}

function addBunny(scene, camera, system) {
  const holder = new THREE.Group();
  holder.name = bunnySpec.id;
  holder.userData = { spec: bunnySpec, loaded: false, model: null };
  scene.add(holder);
  loadTemplate({ file: bunnySpec.runtime }).then((model) => {
    normalizeModel(model, null);
    holder.add(model);
    holder.userData.model = model;
    holder.userData.loaded = true;
    positionBunnyFromStartingView(holder, camera);
    system.userData.pendingBunnySize = { holder, model };
  }).catch((error) => console.error(`No se pudo cargar ${bunnySpec.source} (runtime ${bunnySpec.runtime}).`, error));
  return holder;
}

function positionBunnyFromStartingView(holder, camera) {
  camera.updateMatrixWorld(true);
  holder.parent.updateMatrixWorld(true);
  holder.updateMatrixWorld(true);

  const forward = camera.getWorldDirection(new THREE.Vector3()).normalize();
  const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.getWorldQuaternion(new THREE.Quaternion())).normalize();
  const model = holder.userData.model;
  model.updateMatrixWorld(true);
  const modelBounds = new THREE.Box3().setFromObject(model);
  const desiredWorld = camera.position.clone()
    .add(forward.multiplyScalar(14))
    .add(right.multiplyScalar(6));
  desiredWorld.y = camera.position.y - .5;
  const modelCenter = modelBounds.getCenter(new THREE.Vector3());
  const holderWorld = holder.getWorldPosition(new THREE.Vector3()).add(desiredWorld.sub(modelCenter));
  holder.position.copy(holder.parent.worldToLocal(holderWorld));
  holder.userData.basePosition = holder.position.clone();
  bunnySpec.position = { x: holder.position.x, y: holder.position.y, z: holder.position.z };
}

function addCharacter(parent, spec, isOrbital, photoReference = null) {
  const holder = new THREE.Group();
  holder.name = `${spec.id}${isOrbital ? '-orbit' : ''}`;
  holder.userData = { spec, isOrbital, loaded: false, model: null };
  if (!isOrbital) holder.position.set(spec.position.x, spec.position.y, spec.position.z);
  if (isOrbital || spec.floatAmplitude !== undefined) {
    holder.add(new THREE.PointLight(spec.color, 1.1, 5, 2));
  }
  parent.add(holder);

  loadTemplate(spec).then((template) => {
    const model = template.clone(true);
    normalizeModel(model, spec.targetSize, spec.id === 'usagi');
    holder.userData.model = model;
    holder.userData.loaded = true;
    holder.add(model);
    if (photoReference) positionBesidePhoto(holder, model, photoReference, spec);
  }).catch(() => console.info(`Modelo ${spec.id} pendiente: ${spec.file}`));
  return holder;
}

function positionBesidePhoto(holder, model, photo, spec) {
  photo.updateWorldMatrix(true, true);
  holder.parent.updateMatrixWorld(true);
  holder.updateMatrixWorld(true);
  model.updateMatrixWorld(true);

  const photoWorldPosition = photo.getWorldPosition(new THREE.Vector3());
  const photoBounds = new THREE.Box3().setFromObject(photo);
  const modelBounds = new THREE.Box3().setFromObject(model);
  const modelSize = modelBounds.getSize(new THREE.Vector3());
  const modelCenter = modelBounds.getCenter(new THREE.Vector3());
  const desiredWorld = new THREE.Vector3(
    photoBounds.min.x - modelSize.x * .5 - .35,
    photoWorldPosition.y,
    photoWorldPosition.z
  );
  const correction = desiredWorld.sub(modelCenter);
  const holderWorld = holder.getWorldPosition(new THREE.Vector3()).add(correction);
  holder.position.copy(holder.parent.worldToLocal(holderWorld));
  holder.userData.basePosition = holder.position.clone();
  spec.position = { x: holder.position.x, y: holder.position.y, z: holder.position.z };
}

function loadTemplate(spec) {
  if (!gltfCache.has(spec.file)) {
    gltfCache.set(spec.file, new Promise((resolve, reject) => loader.load(spec.file, (gltf) => resolve(gltf.scene), undefined, reject)));
  }
  return gltfCache.get(spec.file);
}

function normalizeModel(model, targetSize, refreshNestedTransforms = false) {
  model.rotation.set(0, 0, 0);
  model.updateMatrixWorld(true);
  const sourceBounds = new THREE.Box3().setFromObject(model);
  const sourceSize = sourceBounds.getSize(new THREE.Vector3());
  const maxSize = Math.max(sourceSize.x, sourceSize.y, sourceSize.z, .001);
  if (targetSize !== null) model.scale.setScalar(targetSize / maxSize);
  if (refreshNestedTransforms) model.updateMatrixWorld(true);

  const bounds = new THREE.Box3().setFromObject(model);
  const center = bounds.getCenter(new THREE.Vector3());
  model.position.x -= center.x;
  model.position.z -= center.z;
  model.position.y -= bounds.min.y;
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

export function animateCharacters(system, time) {
  const pendingTraderSize = system.userData.pendingTraderSize;
  const momongaModel = system.userData.momongaHolder?.userData.model;
  if (pendingTraderSize && momongaModel) {
    matchModelHeight(pendingTraderSize.model, momongaModel);
    delete system.userData.pendingTraderSize;
  }
  const pendingBunnySize = system.userData.pendingBunnySize;
  if (pendingBunnySize && momongaModel) {
    matchModelHeight(pendingBunnySize.model, momongaModel);
    delete system.userData.pendingBunnySize;
  }
  const pendingMinecraftSize = system.userData.pendingMinecraftSize;
  if (pendingMinecraftSize && momongaModel) {
    matchModelHeight(pendingMinecraftSize.model, momongaModel);
    positionMinecraftBelowHeart(pendingMinecraftSize.holder, pendingMinecraftSize.model, system.userData.heartWorld);
    delete system.userData.pendingMinecraftSize;
  }
  [...system.children, ...system.userData.externalCharacters].forEach((holder) => {
    const { spec, loaded, model } = holder.userData;
    if (spec.floatAmplitude !== undefined) {
      const basePosition = holder.userData.basePosition;
      if (basePosition) {
        holder.position.set(basePosition.x, basePosition.y + Math.sin(time * spec.floatSpeed + spec.phase) * spec.floatAmplitude, basePosition.z);
      } else {
        holder.position.y = spec.position.y + Math.sin(time * spec.floatSpeed + spec.phase) * spec.floatAmplitude;
      }
      if (loaded) model.rotation.set(0, 0, 0);
    } else {
      holder.position.y = spec.position.y + Math.sin(time * .00065 + spec.phase) * .14;
      if (loaded) model.rotation.y = spec.faceCenter ? Math.atan2(-holder.position.x, -holder.position.z) : Math.sin(time * .00035 + spec.phase) * .08;
    }
  });
}

function matchModelHeight(model, momonga) {
  model.updateMatrixWorld(true);
  momonga.updateMatrixWorld(true);
  const modelBounds = new THREE.Box3().setFromObject(model);
  const momongaBounds = new THREE.Box3().setFromObject(momonga);
  const modelHeight = modelBounds.getSize(new THREE.Vector3()).y;
  const momongaHeight = momongaBounds.getSize(new THREE.Vector3()).y;
  if (modelHeight > .001 && momongaHeight > .001) model.scale.multiplyScalar(momongaHeight / modelHeight);
  model.updateMatrixWorld(true);
}
