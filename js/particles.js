import * as THREE from 'three';
export function createParticles(scene){
  const group=new THREE.Group(); group.name='drifting-particles';
  const palette=[0xffbadb,0xc6b5ff,0x8ee5ed,0xffe3a1,0xffffff];
  palette.forEach((color,index)=>{
    const count=90, p=new Float32Array(count*3);
    for(let i=0;i<count;i++){p[i*3]=(Math.random()-.5)*45;p[i*3+1]=(Math.random()-.5)*30;p[i*3+2]=-Math.random()*42-2}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));
    const points=new THREE.Points(g,new THREE.PointsMaterial({color,size:.07+index*.018,transparent:true,opacity:.45,blending:THREE.AdditiveBlending}));points.userData.speed=(index+1)*.00025;group.add(points);
  }); scene.add(group); return group;
}
export function animateParticles(group,time){group.children.forEach((p,i)=>{p.rotation.y=time*p.userData.speed;p.position.y=Math.sin(time*.0003+i)*.25})}
