import * as THREE from 'three';

const orbitHeartGeometry = makeHeartGeometry();
const orbitStarGeometry = new THREE.OctahedronGeometry(0.18);
const orbitSparkleGeometry = new THREE.TetrahedronGeometry(0.13);
const orbitHeartMaterial = new THREE.MeshStandardMaterial({ color: 0xff9ec6, emissive: 0x7f234e, emissiveIntensity: 0.18, roughness: 0.7 });
const orbitStarMaterial = new THREE.MeshBasicMaterial({ color: 0xffe5a3 });
const orbitSparkleMaterial = new THREE.MeshBasicMaterial({ color: 0xc9f4ff });

export function createHeartWorld(scene) {
  const root = new THREE.Group();
  root.name = 'floating-heart';
  const heart = makeHeart();
  heart.position.y = 0.35;
  root.add(heart);

  const orbit = new THREE.Group();
  orbit.name = 'heart-orbit';
  const orbitItems = [
    { type: 'heart', radius: 2.3, verticalRadius: 0.75, speed: 0.24, angle: 0.2, offsetY: 0.35, tilt: 0.25 },
    { type: 'heart', radius: 2.8, verticalRadius: 1.05, speed: -0.17, angle: 2.1, offsetY: -0.15, tilt: -0.2 },
    { type: 'heart', radius: 2.5, verticalRadius: 0.6, speed: 0.29, angle: 4.4, offsetY: 0.05, tilt: 0.1 },
    { type: 'star', radius: 3.4, verticalRadius: 1.3, speed: 0.11, angle: 1.3, offsetY: 0.25, tilt: 0.45 },
    { type: 'star', radius: 3.1, verticalRadius: 1.4, speed: -0.14, angle: 3.6, offsetY: -0.3, tilt: -0.35 },
    { type: 'star', radius: 2.1, verticalRadius: 1.6, speed: 0.19, angle: 5.2, offsetY: 0.05, tilt: 0.7 },
    { type: 'sparkle', radius: 1.8, verticalRadius: 0.45, speed: -0.31, angle: 2.9, offsetY: 0.1, tilt: 0 },
    { type: 'sparkle', radius: 3.7, verticalRadius: 0.9, speed: 0.08, angle: 5.9, offsetY: -0.2, tilt: 0 }
  ];
  orbitItems.forEach((settings) => orbit.add(createOrbitObject(settings)));
  orbit.position.y = 0.35;
  root.add(orbit);

  const glow = new THREE.PointLight(0xff87bb, 4, 13, 2);
  glow.position.set(0, 0.5, 0);
  root.add(glow);
  const centralPhoto = createCentralPhoto();
  centralPhoto.position.set(0, 4.15, 0.25);
  root.add(centralPhoto);
  root.userData.orbit = orbit;
  root.userData.photo = centralPhoto;
  scene.add(root);
  return root;
}

function createOrbitObject(settings) {
  const object = settings.type === 'heart'
    ? new THREE.Mesh(orbitHeartGeometry, orbitHeartMaterial)
    : new THREE.Mesh(settings.type === 'sparkle' ? orbitSparkleGeometry : orbitStarGeometry, settings.type === 'sparkle' ? orbitSparkleMaterial : orbitStarMaterial);
  object.scale.setScalar(settings.type === 'heart' ? 0.4 : settings.type === 'sparkle' ? 1.1 : 0.75);
  if (settings.type === 'heart') object.rotation.z = Math.PI;
  const outline = new THREE.LineSegments(new THREE.EdgesGeometry(object.geometry), new THREE.LineBasicMaterial({ color: 0x180d35, transparent: true, opacity: 0.82 }));
  object.add(outline);
  object.userData.orbit = settings;
  return object;
}

function makeHeart() {
  const geometry = makeHeartGeometry();
  const group = new THREE.Group();
  // Correccion local: la punta del corazon queda hacia abajo.
  group.rotation.z = Math.PI;
  const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: 0xff668f, emissive: 0xc92e68, emissiveIntensity: 0.55, roughness: 0.5 }));
  mesh.scale.setScalar(0.9);
  group.add(mesh);
  const outline = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), new THREE.LineBasicMaterial({ color: 0x180d35, transparent: true, opacity: 0.85 }));
  outline.scale.setScalar(0.91);
  outline.position.z = 0.06;
  group.add(outline);
  return group;
}

function makeHeartGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, -0.7);
  shape.bezierCurveTo(-1.3, -1.5, -2.1, 0.1, 0, 1.3);
  shape.bezierCurveTo(2.1, 0.1, 1.3, -1.5, 0, -0.7);
  return new THREE.ExtrudeGeometry(shape, { depth: 0.45, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.05 });
}

function createCentralPhoto() {
  const group = new THREE.Group();
  group.name = 'special-memory-above-heart';
  const frame = new THREE.Mesh(new THREE.BoxGeometry(3.7, 2.85, 0.18), new THREE.MeshStandardMaterial({ color: 0xffafcf, roughness: 0.75 }));
  group.add(frame);
  const outline = new THREE.LineSegments(new THREE.EdgesGeometry(frame.geometry), new THREE.LineBasicMaterial({ color: 0x180d35, linewidth: 2 }));
  outline.scale.setScalar(1.02);
  group.add(outline);
  const photo = new THREE.Mesh(new THREE.PlaneGeometry(3.25, 2.3), new THREE.MeshBasicMaterial({ map: makePhotoPlaceholder(), color: 0xffffff }));
  photo.position.z = 0.13;
  group.add(photo);
  const loader = new THREE.TextureLoader();
  loader.load('assets/images/photo-central.jpg', (texture) => { texture.colorSpace = THREE.SRGBColorSpace; photo.material.map = texture; photo.material.needsUpdate = true; });
  const decoration = new THREE.Mesh(new THREE.OctahedronGeometry(0.16), new THREE.MeshBasicMaterial({ color: 0xffe49c }));
  decoration.position.set(-1.7, 1.35, 0.2);
  group.add(decoration);
  const heart = new THREE.Mesh(orbitHeartGeometry, orbitHeartMaterial);
  heart.scale.setScalar(0.18);
  heart.rotation.z = Math.PI;
  heart.position.set(1.7, 1.35, 0.2);
  group.add(heart);
  const photoLight = new THREE.PointLight(0xffb5d4, 2.4, 7, 2);
  photoLight.position.set(0, 0, 1);
  group.add(photoLight);
  const halo = new THREE.Mesh(new THREE.SphereGeometry(2.5, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffb8d9, transparent: true, opacity: .025, depthWrite: false }));
  halo.position.z = -.15;
  group.add(halo);
  return group;
}

function makePhotoPlaceholder() {
  const canvas = document.createElement('canvas');
  canvas.width = 650; canvas.height = 460;
  const context = canvas.getContext('2d');
  context.fillStyle = '#ffe7f0'; context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#4b2d75'; context.textAlign = 'center'; context.font = '600 30px DM Sans, sans-serif';
  context.fillText('Nuestra memoria especial ♡', canvas.width / 2, canvas.height / 2);
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; return texture;
}

export function animateHeart(root, time) {
  const heart = root.children[0];
  const pulse = 1 + Math.sin(time * 0.002) * 0.045;
  heart.scale.setScalar(pulse);
  root.position.y = Math.sin(time * 0.0007) * 0.16;
  const orbit = root.userData.orbit;
  orbit.children.forEach((object, index) => {
    const settings = object.userData.orbit;
    const angle = settings.angle + time * 0.001 * settings.speed;
    object.position.set(Math.cos(angle) * settings.radius, settings.offsetY + Math.sin(angle * 1.3) * settings.verticalRadius, Math.sin(angle) * settings.radius);
    if (settings.type === 'heart') {
      // El grupo orbita; el modelo conserva su orientacion vertical.
      object.rotation.set(0, 0, Math.PI);
    } else {
      object.rotation.x = settings.tilt;
      object.rotation.y = -angle * 0.12;
    }
    object.position.y += Math.sin(time * 0.001 + index) * 0.025;
  });
  const photo = root.userData.photo;
  photo.position.y = 4.15 + Math.sin(time * 0.0009) * 0.12;
  photo.rotation.y = Math.sin(time * 0.00045) * 0.035;
}
