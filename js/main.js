import * as THREE from 'three';
import { createScene } from './scene.js';
import { createParticles, animateParticles } from './particles.js';
import { FirstPersonControls } from './controls.js';
import { memories } from './memories.js';
import { createMemory, animateMemories, refreshMemoryTextures, loadCardFonts, disposeMemory } from './memoryObjects.js';
import { createHeartWorld, animateHeart } from './world.js';
import { setupIntro } from './intro.js';
import { setupAudio } from './audio.js';
import { setupInteractions, setupTouch } from './interactions.js';
import { createDecorations, animateDecorations } from './decorations.js';
import { createCharacters, animateCharacters } from './characters.js';
import { createLetters, animateLetters } from './letters.js';

const {scene,camera,renderer}=createScene(document.querySelector('#scene-container'));
const particles=createParticles(scene), heartWorld=createHeartWorld(scene), decorations=createDecorations(scene), characters=createCharacters(heartWorld,camera), letters=createLetters(scene), memoryGroup=new THREE.Group();heartWorld.add(characters);scene.add(memoryGroup);
memories.forEach(data=>memoryGroup.add(createMemory(data)));
// Cuando las fuentes personalizadas estén listas, se redibujan los textos
// de las cartas para que usen su tipografía real (con respaldo mientras tanto).
loadCardFonts().then(()=>refreshMemoryTextures(memoryGroup)).catch(()=>{});
const controls=new FirstPersonControls(camera,renderer.domElement);
const audio=setupAudio(); const interactions=setupInteractions(camera,controls,memoryGroup);
const isMobile=matchMedia('(pointer: coarse)').matches;
if(isMobile){document.querySelector('#mobile-controls').classList.remove('is-hidden');setupTouch(controls);controls.isTouch=true}
if(isMobile){document.querySelector('#hint').innerHTML='<strong>Explora libremente</strong><span>Usa el joystick para moverte y desliza para mirar</span>'}
setupIntro(()=>{controls.enabled=true;audio.start();renderer.domElement.focus();controls.lookHelp?.classList.remove('is-hidden');const hint=document.querySelector('#hint');hint.classList.remove('is-hidden');setTimeout(()=>hint.classList.add('is-hidden'),7000)});
let last=performance.now();
function animate(now){const dt=Math.min(40,now-last);last=now;controls.update(dt);interactions.update();animateParticles(particles,now);animateHeart(heartWorld,now);animateCharacters(characters,now);animateLetters(letters,now);animateDecorations(decorations,now);animateMemories(memoryGroup,now,camera.position,interactions.focus);renderer.render(scene,camera);requestAnimationFrame(animate)}
requestAnimationFrame(animate);
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,renderer.pixelRatioCap))});
// Al cerrar la pestaña se detienen los vídeos y se liberan sus recursos
// (se respeta la caché de ida y vuelta del navegador).
addEventListener('pagehide',()=>{memoryGroup.children.forEach(disposeMemory)});

// Una estrella fugaz ocasional hace que el cielo parezca vivo.
setInterval(()=>{if(!controls.enabled)return;const trail=new THREE.Mesh(new THREE.CylinderGeometry(.018,.018,3.2,6),new THREE.MeshBasicMaterial({color:0xffd6e6,transparent:true,opacity:.8}));trail.position.set((Math.random()-.5)*35,10+Math.random()*15,-36);trail.rotation.z=-.8;scene.add(trail);const start=performance.now();function fly(t){const p=Math.min((t-start)/750,1);trail.position.x+=.025;trail.position.y-=.018;trail.material.opacity=.8*(1-p);if(p<1)requestAnimationFrame(fly);else{scene.remove(trail);trail.geometry.dispose();trail.material.dispose()}}requestAnimationFrame(fly)},18000);
