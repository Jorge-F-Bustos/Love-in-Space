import * as THREE from 'three';
import { expandWorldPosition } from './spatial.js';

export function createScene(container) {
  const isMobile = matchMedia('(pointer: coarse)').matches;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x09051f);
  scene.fog = new THREE.FogExp2(0x10072f, 0.006);
  const camera = new THREE.PerspectiveCamera(66, innerWidth / innerHeight, .08, 260);
  camera.position.set(0, 1, 9);
  const renderer = new THREE.WebGLRenderer({ antialias:!isMobile, powerPreference:'high-performance' });
  renderer.pixelRatioCap = isMobile ? 1.25 : 1.5;
  renderer.setPixelRatio(Math.min(devicePixelRatio, renderer.pixelRatioCap));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);
  scene.add(new THREE.HemisphereLight(0xcfcaff, 0x241052, 1.55));
  scene.add(new THREE.AmbientLight(0x7e6bb8, 0.3));
  const fillLight = new THREE.DirectionalLight(0x9bcaff, 0.7);
  fillLight.position.set(-8, 12, 10); scene.add(fillLight);
  const heartLight = new THREE.PointLight(0xff8fc3, 11, 28, 2);
  heartLight.position.set(0, 0, 0); scene.add(heartLight);
  const blueLight = new THREE.PointLight(0x6d8dff, 3.2, 34); blueLight.position.set(-13,5,-12); scene.add(blueLight);
  addNebula(scene);
  addStars(scene);
  addConstellation(scene, -18, 11, -35, 0xffb5d7);
  addConstellation(scene, 19, 7, -42, 0x9ad6ff);
  addDistantPlanets(scene);
  return { scene, camera, renderer };
}

function addNebula(scene) {
  // Las capas transparentes sugieren nubes sin materiales pesados.
  const colors = [0x6d3a9e,0x382b9b,0xb6478d];
  colors.forEach((color,i)=>{
    const cloud = new THREE.Mesh(new THREE.SphereGeometry(18 + i*5, 24, 16), new THREE.MeshBasicMaterial({color,transparent:true,opacity:.035,side:THREE.BackSide,depthWrite:false}));
    cloud.position.set((i-1)*18, i*5-10, -45-i*18); cloud.scale.set(1.7,.7,.5); scene.add(cloud);
  });
}
function addStars(scene) {
  const count=720, pos=new Float32Array(count*3), sizes=new Float32Array(count);
  for(let i=0;i<count;i++){ pos[i*3]=(Math.random()-.5)*120; pos[i*3+1]=(Math.random()-.5)*80; pos[i*3+2]=(Math.random()-.5)*150; sizes[i]=Math.random()*2.8+1; }
  const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.BufferAttribute(pos,3)); geo.setAttribute('size',new THREE.BufferAttribute(sizes,1));
  scene.add(new THREE.Points(geo,new THREE.PointsMaterial({color:0xf9efff,size:.13,transparent:true,opacity:.8,sizeAttenuation:true}))).name='star-field';
}
function addConstellation(scene,x,y,z,color){
  const origin=expandWorldPosition({x,y,z});
  const pts=[new THREE.Vector3(origin.x,origin.y,origin.z),new THREE.Vector3(origin.x+2*1.08,origin.y+1*1.08,origin.z),new THREE.Vector3(origin.x+4*1.08,origin.y-.5*1.08,origin.z),new THREE.Vector3(origin.x+5*1.08,origin.y+2*1.08,origin.z)];
  const geo=new THREE.BufferGeometry().setFromPoints(pts); const line=new THREE.Line(geo,new THREE.LineBasicMaterial({color,transparent:true,opacity:.35})); scene.add(line);
  pts.forEach(p=>{const star=new THREE.Mesh(new THREE.SphereGeometry(.1,8,8),new THREE.MeshBasicMaterial({color}));star.position.copy(p);scene.add(star)});
}
function addDistantPlanets(scene){
  [[-25,-8,-42,3,0x5946b9],[25,13,-55,5,0x392c82],[18,-12,-29,1.7,0xff8ebd]].forEach(([x,y,z,r,c])=>{
    const position=expandWorldPosition({x,y,z});
    const p=new THREE.Mesh(new THREE.SphereGeometry(r,20,14),new THREE.MeshStandardMaterial({color:c,roughness:1})); p.position.set(position.x,position.y,position.z); scene.add(p);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(r*1.3,r*.035,8,48),new THREE.MeshBasicMaterial({color:0xffbddc,transparent:true,opacity:.4}));ring.rotation.x=1;ring.position.copy(p.position);scene.add(ring);
  });
}
