import * as THREE from 'three';
import { expandWorldPosition } from './spatial.js';

const colors = { pink: 0xff9ec6, lavender: 0xbda8ff, yellow: 0xffe59b, cyan: 0x94e5ee, white: 0xfff5fb };
const heartGeometry = makeHeartGeometry();
const heartMaterial = new THREE.MeshStandardMaterial({ color: colors.pink, roughness: 0.7 });
const starGeometry = new THREE.OctahedronGeometry(0.32);
const starMaterial = new THREE.MeshBasicMaterial({ color: colors.yellow });
const planetGeometry = new THREE.SphereGeometry(1, 16, 12);

export function createDecorations(scene) {
  const group = new THREE.Group();
  group.name = 'handcrafted-decorations';
  const entries = [
    ['heart', 5.5, 4.5, -13, 0.65, colors.pink], ['star', -7, -4, -8, 0.9, colors.yellow],
    ['moon', 14, 5, -18, 1, colors.lavender], ['cloud', -12, 8, -22, 0.85, colors.white],
    ['heart', 17, -5, -25, 0.55, colors.lavender], ['star', -19, 4, -29, 1.4, colors.cyan],
    ['flower', 5, -7, -18, 0.75, colors.pink], ['envelope', -15, -7, -20, 0.7, colors.white],
    ['heart', 20, 10, -34, 0.75, colors.pink], ['star', -24, -10, -40, 1.2, colors.yellow],
    ['planet', -20, 10, -37, 2.1, colors.lavender], ['planet-ring', 24, -9, -47, 2.7, colors.pink],
    ['planet', 30, 5, -62, 3.7, colors.cyan], ['moon', -28, 1, -27, 1.1, colors.yellow],
    ['moon', 12, -11, -36, 0.7, colors.white], ['constellation', 9, 12, -38, 1, colors.pink],
    ['cloud', -15, 6, 15, 1.05, colors.white], ['heart', 8, 3, 16, 0.7, colors.pink],
    ['star', -3, -7, 18, 1.15, colors.yellow], ['moon', 14, 8, 22, 1.25, colors.lavender],
    ['flower', -13, -6, 23, 0.85, colors.pink], ['envelope', 7, -4, 24, 0.8, colors.white],
    ['planet-ring', -20, 8, 27, 2.4, colors.cyan], ['planet', 19, -7, 30, 3.2, colors.lavender],
    ['constellation', -2, 11, 32, 1.35, colors.cyan], ['star', 12, 10, 33, 1.5, colors.yellow],
    ['moon', -16, -10, 34, 1.5, colors.yellow], ['heart', 23, 4, 36, .85, colors.pink],
    ['planet-ring', -25, 3, -12, 1.65, colors.lavender], ['moon', -28, 9, -2, .9, colors.yellow],
    ['constellation', -24, -1, -20, 1.1, colors.pink], ['flower', -23, -9, -10, .8, colors.pink],
    ['planet', 25, 2, -12, 1.8, colors.cyan], ['moon', 28, 10, -4, .85, colors.white],
    ['constellation', 24, -2, -22, 1.2, colors.cyan], ['heart', 27, -9, -17, .65, colors.pink],
    ['star', -5, 5, -20, .9, colors.yellow], ['moon', 7, 9, -17, .75, colors.lavender],
    ['planet', 19, 10, -2, 1.35, colors.pink], ['constellation', 16, -1, 12, 1.1, colors.yellow],
    ['star', -19, 10, 8, 1.15, colors.cyan], ['planet-ring', -18, -9, 3, 1.5, colors.lavender],
    ['moon', -8, -10, 10, .82, colors.white], ['flower', 10, -10, 15, .72, colors.pink]
  ];
  entries.forEach(([type, x, y, z, scale, color], index) => {
    const object = createObject(type, color);
    const position = expandWorldPosition({ x, y, z });
    object.position.set(position.x, position.y, position.z);
    object.scale.setScalar(scale);
    object.rotation.set(index * 0.14, index * 0.21, index * 0.09);
    object.userData.float = { phase: index * 1.7, speed: 0.0005 + (index % 3) * 0.00012, baseY: position.y };
    group.add(object);
  });
  scene.add(group);
  return group;
}

function createObject(type, color) {
  let mesh;
  if (type === 'heart') { mesh = new THREE.Mesh(heartGeometry, heartMaterial.clone()); mesh.rotation.z = Math.PI; }
  if (type === 'star') mesh = new THREE.Mesh(starGeometry, starMaterial.clone());
  if (type === 'moon') mesh = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.2, 10, 24, Math.PI * 1.55), new THREE.MeshStandardMaterial({ color, roughness: 0.8 }));
  if (type === 'planet' || type === 'planet-ring') mesh = makePlanet(color, type === 'planet-ring');
  if (type === 'constellation') mesh = makeConstellation(color);
  if (type === 'cloud') {
    mesh = new THREE.Group();
    [-0.55, 0, 0.55].forEach((x, index) => { const puff = new THREE.Mesh(new THREE.SphereGeometry(index === 1 ? 0.55 : 0.4, 12, 10), new THREE.MeshStandardMaterial({ color, roughness: 1 })); puff.position.x = x; mesh.add(puff); addOutline(puff); });
  }
  if (type === 'flower') mesh = makeFlower(color);
  if (type === 'envelope') mesh = makeEnvelope(color);
  addOutline(mesh);
  return mesh;
}

function addOutline(object) { if (!object.geometry) return; object.add(new THREE.LineSegments(new THREE.EdgesGeometry(object.geometry), new THREE.LineBasicMaterial({ color: 0x180d35, transparent: true, opacity: 0.7 }))); }
function makePlanet(color, ringed) { const group = new THREE.Group(); const sphere = new THREE.Mesh(planetGeometry, new THREE.MeshStandardMaterial({ color, roughness: .78, emissive: color, emissiveIntensity: .06 })); group.add(sphere); addOutline(sphere); if (ringed) { const ring = new THREE.Mesh(new THREE.TorusGeometry(1.45, .08, 8, 32), new THREE.MeshBasicMaterial({ color: colors.yellow, transparent: true, opacity: .75 })); ring.rotation.x = 1.05; group.add(ring); } const spot = new THREE.Mesh(new THREE.SphereGeometry(.18, 8, 6), new THREE.MeshBasicMaterial({ color: colors.white, transparent: true, opacity: .35 })); spot.position.set(.5, .45, .82); group.add(spot); return group; }
function makeConstellation(color) { const group = new THREE.Group(); const points = [[0,0,0],[.8,.35,.1],[1.55,0,0],[1.2,-.7,.15],[.4,-.8,0]]; const vectors = points.map(([x,y,z]) => new THREE.Vector3(x,y,z)); const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([...vectors, vectors[0]]), new THREE.LineBasicMaterial({ color, transparent: true, opacity: .5 })); group.add(line); vectors.forEach(([x,y,z]) => { const star = new THREE.Mesh(starGeometry, new THREE.MeshBasicMaterial({ color })); star.scale.setScalar(.35); star.position.set(x,y,z); group.add(star); }); return group; }
function makeHeartGeometry() { const shape = new THREE.Shape(); shape.moveTo(0, -0.7); shape.bezierCurveTo(-1.3, -1.5, -2.1, 0.1, 0, 1.3); shape.bezierCurveTo(2.1, 0.1, 1.3, -1.5, 0, -0.7); return new THREE.ExtrudeGeometry(shape, { depth: 0.25, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.03 }); }
function makeFlower(color) { const group = new THREE.Group(); for (let i = 0; i < 5; i++) { const petal = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), new THREE.MeshBasicMaterial({ color })); const angle = i / 5 * Math.PI * 2; petal.position.set(Math.cos(angle) * 0.2, Math.sin(angle) * 0.2, 0); group.add(petal); } group.add(new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 8), new THREE.MeshBasicMaterial({ color: colors.yellow }))); return group; }
function makeEnvelope(color) { const shape = new THREE.Shape(); shape.moveTo(-0.75, -0.5); shape.lineTo(0.75, -0.5); shape.lineTo(0.75, 0.5); shape.lineTo(-0.75, 0.5); shape.closePath(); const mesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.12, bevelEnabled: true, bevelSize: 0.03 }), new THREE.MeshStandardMaterial({ color, roughness: 0.8 })); return mesh; }

export function animateDecorations(group, time) {
  group.children.forEach((object) => {
    const float = object.userData.float;
    object.position.y = float.baseY + Math.sin(time * float.speed + float.phase) * 0.18;
    object.rotation.y += 0.00025;
  });
}
