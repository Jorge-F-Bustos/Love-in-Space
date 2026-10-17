import * as THREE from 'three';
import { expandWorldPosition } from './spatial.js';
import { resolveCardStyle } from './cardStyles.js';
import { FRAME_CONFIG, resolveMedia, computeFrameLayout, createVideoMedia, loadImageMedia, disposeObject3D } from './media.js';

const frameColors={polaroid:0xfffaf4,pink:0xff9fc8,cosmic:0x6c55b5,heart:0xff668f};
const memoryGlowColors={polaroid:0xffe4c2,pink:0xff9fc6,cosmic:0xb9a5ff,heart:0xff789e};

// Cachés separadas: la de texto de cartas se limpia al recargar fuentes,
// la de glifos decorativos (corazones) no debe reciclarse jamás.
const textTextureCache=new Map();
const glyphTextureCache=new Map();

// Resolución horizontal del lienzo de cada texto. La altura se calcula a
// partir de la proporción del plano para que el texto jamás se deforme.
const TEXTURE_WIDTH=760;

export function createMemory(data){
  const position=expandWorldPosition(data.position); const group=new THREE.Group(); group.name=data.id; group.position.set(position.x,position.y,position.z); group.rotation.set(data.rotation?.x||0,data.rotation?.y||0,data.rotation?.z||0); group.userData={data,baseY:group.position.y,phase:Math.random()*7};
  const card=data.type==='photo'?makePhoto(data,group):makeNote(data); group.add(card); if(!card.userData.hasOwnOutline) addOutline(group,card); orientMemoryTowardHeart(group,new THREE.Vector3(0,.35,0));
  const glowColor=data.glowColor||memoryGlowColors[data.frame||data.style]||0xffb6d6;
  const halo=new THREE.Mesh(new THREE.SphereGeometry(1.8,12,8),new THREE.MeshBasicMaterial({color:glowColor,transparent:true,opacity:.035,depthWrite:false}));halo.position.z=-.08;group.add(halo);
  if(data.particles) addTinyHearts(group); return group;
}
export function orientMemoryTowardHeart(memoryObject, heartPosition){
  const directionToHeart=heartPosition.clone().sub(memoryObject.position);
  if(directionToHeart.lengthSq()<.0001)return;
  const horizontalLength=Math.hypot(directionToHeart.x,directionToHeart.z);
  const yaw=Math.atan2(directionToHeart.x,directionToHeart.z);
  const maxPitch=THREE.MathUtils.degToRad(18);
  const pitch=THREE.MathUtils.clamp(Math.atan2(directionToHeart.y,horizontalLength),-maxPitch,maxPitch);
  memoryObject.rotation.set(-pitch,yaw,THREE.MathUtils.clamp(memoryObject.userData.data.rotation?.z||0,-.1,.1),'YXZ');
}
// Marco de foto/vídeo. Acepta tanto imágenes como archivos .mp4 mediante el
// mismo sistema: solo cambia la ruta o el tipo en js/memories.js. El marco se
// reajusta a la proporción real del medio en cuanto se conocen sus medidas.
function makePhoto(data,group){
  const frameColor=frameColors[data.frame]||0xfffaf4;
  const outer=new THREE.Mesh(new THREE.BoxGeometry(3.25,2.65,FRAME_CONFIG.depth),new THREE.MeshStandardMaterial({color:frameColor,roughness:.72,emissive:frameColor,emissiveIntensity:.08}));
  // La textura del contenido se asigna justo después: así un marco vacío no
  // crea ningún lienzo de marcador innecesario.
  const media=new THREE.Mesh(new THREE.PlaneGeometry(2.7,1.8),new THREE.MeshBasicMaterial({color:0xffffff}));
  media.position.z=FRAME_CONFIG.mediaZ; media.userData.disposeMap=false; outer.add(media);
  const parts={outer,media,caption:null,dot:null,data};
  // El contorno se crea aquí (en vez de en addOutline) para poder reconstruir
  // sus aristas cada vez que el marco adapta su tamaño.
  parts.outline=new THREE.LineSegments(new THREE.EdgesGeometry(outer.geometry),new THREE.LineBasicMaterial({color:0x180d35,linewidth:2,transparent:true,opacity:.9}));
  parts.outline.position.z=.16; outer.add(parts.outline);
  outer.userData.hasOwnOutline=true;
  // Distribución original 3:2 mientras el medio termina de cargar.
  applyPhotoLayout(parts,3,2);
  const resolved=resolveMedia(data);
  if(!resolved){
    // Marco todavía sin foto ni vídeo: se muestra un marcador suave y
    // compartido. No hay ninguna ruta que falle, así que no aparece ni un
    // icono roto ni un error en consola.
    media.material.map=emptyPhotoTexture();
    media.material.needsUpdate=true;
    media.userData.disposeMap=false; // textura compartida: no se destruye aquí
    return outer;
  }
  // Mientras el medio carga se muestra el corazón suave de siempre (textura
  // propia de esta memoria: se libera al terminar o al destruir la memoria).
  media.material.map=placeholderTexture(); media.material.needsUpdate=true;
  media.userData.disposeMap=true;
  const resize=(width,height)=>{if(width>0&&height>0)applyPhotoLayout(parts,width,height)};
  if(resolved.isVideo){
    // El vídeo se crea pero NO se reproduce aún: se enciende solo cuando el
    // usuario se acerca (ver animateMemories). Así diez vídeos no se
    // decodifican a la vez y la escena entra fluida.
    const videoMedia=createVideoMedia(resolved.src,{
      onReady:(width,height)=>{
        resize(width,height);
        media.material.map=videoMedia.texture; media.material.needsUpdate=true;
        media.userData.disposeMap=false; // la textura la libera videoMedia
        if(group) group.userData.videoTexture=videoMedia.texture;
      },
      onError:()=>console.warn(`No se pudo cargar el vídeo "${resolved.src}"; se mantiene el marcador.`)
    },{autoStart:false});
    if(group){group.userData.videoController=videoMedia;group.userData.videoActive=false;}
    outer.userData.mediaDispose=()=>{if(group){group.userData.videoTexture=null;group.userData.videoController=null;}videoMedia.dispose()};
  }else{
    loadImageMedia(resolved.src,{
      onReady:(texture,width,height)=>{
        resize(width,height);
        media.material.map=texture; media.material.needsUpdate=true;
        media.userData.disposeMap=true; // textura propia de esta memoria
      },
      onError:()=>console.warn(`No se pudo cargar la imagen "${resolved.src}"; se mantiene el marcador.`)
    });
  }
  return outer;
}

// Redistribuye marco, contenido, leyenda y adorno según las dimensiones
// reales del medio (imagen o vídeo). Se llama solo al conocer el tamaño, no
// en cada fotograma.
function applyPhotoLayout(parts,width,height){
  const layout=computeFrameLayout(width,height);
  parts.outer.geometry.dispose();
  parts.outer.geometry=new THREE.BoxGeometry(layout.frameW,layout.frameH,FRAME_CONFIG.depth);
  parts.media.geometry.dispose();
  parts.media.geometry=new THREE.PlaneGeometry(layout.contentW,layout.contentH);
  parts.outline.geometry.dispose();
  parts.outline.geometry=new THREE.EdgesGeometry(parts.outer.geometry);
  if(parts.data.caption){
    if(parts.caption){parts.outer.remove(parts.caption);disposeObject3D(parts.caption)}
    parts.caption=makeCaption(parts.data,layout.frameW,layout.captionY);
    parts.outer.add(parts.caption);
  }
  if(!parts.dot){
    parts.dot=new THREE.Mesh(new THREE.SphereGeometry(FRAME_CONFIG.dotRadius,10,8),new THREE.MeshBasicMaterial({color:0xff6d9e}));
    parts.outer.add(parts.dot);
  }
  parts.dot.position.set(layout.frameW/2-FRAME_CONFIG.dotInset,layout.captionY,.09);
  parts.layout=layout;
}

// Leyenda superpuesta al marco. El ancho se adapta al del marco para no
// desbordarse en medios muy verticales.
function makeCaption(data,frameW,captionY){
  const style=resolveCardStyle(data,'caption');
  const planeW=Math.max(.9,frameW-FRAME_CONFIG.captionInset*2);
  const label=makeTextPlane(data.caption,style,{planeW,planeH:FRAME_CONFIG.captionHeight,baseSizeRatio:.42,padXRatio:.05,padYRatio:.1,ornament:false});
  label.position.set(0,captionY,.09);
  return label;
}

// Espacios de texto por forma de carta. Evita que el título o el cuerpo se
// salgan de cada silueta (corazón, nube, estrella, sobre, etc.).
function noteLayout(style){
  switch(style){
    case 'heart-card': return { titleW:1.5,titleH:.5,titleY:.34, bodyW:1.8,bodyH:1.15,bodyY:-.55, seal:false };
    case 'cloud-note': return { titleW:2.35,titleH:.44,titleY:.74, bodyW:2.4,bodyH:1.0,bodyY:-.2, seal:{x:0,y:-1.0} };
    case 'star-note': return { titleW:2.2,titleH:.46,titleY:1.02, bodyW:2.35,bodyH:1.1,bodyY:-.1, seal:{x:0,y:-1.3} };
    case 'envelope': return { titleW:2.6,titleH:.44,titleY:.72, bodyW:2.7,bodyH:.96,bodyY:-.18, seal:{x:1.35,y:-.82} };
    case 'diary-page': return { titleW:2.7,titleH:.46,titleY:1.16, bodyW:2.55,bodyH:1.42,bodyY:-.22, seal:{x:0,y:-1.35} };
    default: return { titleW:2.7,titleH:.46,titleY:1.14, bodyW:2.55,bodyH:1.42,bodyY:-.22, seal:{x:0,y:-1.35} };
  }
}

function makeNote(data){
  const colors={'love-letter':0xfff3e7,'cloud-note':0xdcd7ff,'star-note':0x9a7de0,postcard:0xffb4c9,'diary-page':0xffead1,'envelope':0xffc1d4,'heart-card':0xff9fbe};
  const shape=makeCardShape(data.style);
  const geometry=new THREE.ExtrudeGeometry(shape,{depth:.12,bevelEnabled:true,bevelSize:.035,bevelThickness:.025});
  // La cara frontal de la carta ya no queda en z=0: el borde (bevel) llega
  // a ~.145. Antes los textos vivían en z=.08, es decir DENTRO del sólido,
  // por eso no se veían. Los colocamos por delante de la cara frontal.
  geometry.computeBoundingBox();
  const frontZ=geometry.boundingBox.max.z+.025;
  const card=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({color:colors[data.style]||0xfff5ed,roughness:.72,emissive:colors[data.style]||0xfff5ed,emissiveIntensity:.1}));
  const layout=noteLayout(data.style);
  if(data.title){
    const style=resolveCardStyle(data,'title');
    const title=makeTextPlane(data.title,style,{planeW:layout.titleW,planeH:layout.titleH,baseSizeRatio:.4,ornament:false});
    title.position.set(0,layout.titleY,frontZ);card.add(title);
  }
  if(data.text){
    const style=resolveCardStyle(data,'body');
    const body=makeTextPlane(data.text,style,{planeW:layout.bodyW,planeH:layout.bodyH,baseSizeRatio:.135});
    body.position.set(0,layout.bodyY,frontZ);card.add(body);
  }
  if(layout.seal){
    const seal=new THREE.Mesh(new THREE.CircleGeometry(.15,18),new THREE.MeshBasicMaterial({color:0xff779e}));
    seal.position.set(layout.seal.x,layout.seal.y,frontZ);card.add(seal);
  }
  addCardDetails(card,data.style,frontZ);return card;
}
function makeCardShape(style){const shape=new THREE.Shape();if(style==='star-note'){for(let i=0;i<10;i++){const angle=-Math.PI/2+i*Math.PI/5,r=i%2?1.7:2.25;const x=Math.cos(angle)*r,y=Math.sin(angle)*r;i?shape.lineTo(x,y):shape.moveTo(x,y)}shape.closePath();return shape}if(style==='cloud-note'){shape.moveTo(-1.7,-.7);shape.bezierCurveTo(-2.1,-.1,-1.6,.55,-.9,.55);shape.bezierCurveTo(-.7,1.3,.2,1.35,.55,.7);shape.bezierCurveTo(1.2,1.1,2,.55,1.7,-.15);shape.bezierCurveTo(2,-.8,1.1,-1.1,.55,-.75);shape.bezierCurveTo(-.1,-1.25,-.9,-1.1,-1.1,-.72);shape.closePath();return shape}if(style==='heart-card'){shape.moveTo(0,-1.55);shape.bezierCurveTo(-1.8,-2.5,-2.5,-.25,0,1.65);shape.bezierCurveTo(2.5,-.25,1.8,-2.5,0,-1.55);shape.closePath();return shape}if(style==='envelope'){shape.moveTo(-1.75,-1.15);shape.lineTo(1.75,-1.15);shape.lineTo(1.75,1.15);shape.lineTo(-1.75,1.15);shape.closePath();return shape}if(style==='diary-page'){shape.moveTo(-1.6,-1.8);for(let i=0;i<5;i++){shape.lineTo(-1.6+i*.8,-1.8+(i%2?.08:0));}shape.lineTo(1.6,1.8);for(let i=4;i>=0;i--){shape.lineTo(-1.6+i*.8,1.8-(i%2?.08:0));}shape.closePath();return shape}shape.moveTo(-1.6,-1.8);shape.lineTo(1.6,-1.8);shape.lineTo(1.6,1.8);shape.lineTo(-1.6,1.8);shape.closePath();return shape}
function addOutline(group,card){const edges=new THREE.LineSegments(new THREE.EdgesGeometry(card.geometry),new THREE.LineBasicMaterial({color:0x180d35,linewidth:2,transparent:true,opacity:.9}));edges.position.z=.16;group.add(edges)}
// Los rombos de esquina solo se dibujan en siluetas donde encajan; la nube
// y el corazón son huecos en sus bordes y los adornos quedarían flotando.
function addCardDetails(card,style,frontZ){if(style==='cloud-note'||style==='heart-card')return;const color=style==='cloud-note'?0xc8b9ff:0xff8caf;for(let i=0;i<4;i++){const dot=new THREE.Mesh(new THREE.OctahedronGeometry(.08),new THREE.MeshBasicMaterial({color}));dot.position.set(i%2?1.35:-1.35,i<2?1.45:-1.45,frontZ);card.add(dot)}}

// Corazones diminutos que revolotean delante de ciertas cartas.
function addTinyHearts(group){for(let i=0;i<4;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glyphTexture('♡','#ff9ec6',128),color:0xff9ec6,transparent:true}));s.scale.set(.35,.35,.35);s.position.set((Math.random()-.5)*2,Math.random()*2-1,.3);s.userData={orbit:i,baseY:s.position.y};group.add(s)}}

// --------------------------------------------------------------------------
//  Motor de textos: dibuja el mensaje sobre un lienzo, lo ajusta a la carta
//  (reduciendo el tamaño si hace falta) y lo devuelve como textura.
// --------------------------------------------------------------------------
function fontString(style,size){return `${style.italic?'italic ':''}${style.weight??500} ${size}px ${style.font}`}
function applyLetterSpacing(ctx,px){
  if('letterSpacing' in ctx){try{ctx.letterSpacing=(px?`${px}px`: '0px')}catch(e){/* sin soporte: se ignora */}}
}
function widthOfLongestLine(ctx,lines){let m=0;lines.forEach(l=>{const w=ctx.measureText(l).width;if(w>m)m=w});return m}
function wrapParagraphs(ctx,paragraphs,maxW){
  const lines=[];
  paragraphs.forEach(para=>{
    if(!para){lines.push('');return}
    const words=para.split(/\s+/);let line='';
    words.forEach(word=>{
      let candidate=line?`${line} ${word}`:word;
      if(ctx.measureText(candidate).width>maxW && line){lines.push(line);line=word}
      else line=candidate;
      // Palabra más larga que el ancho disponible: se parte por caracteres.
      while(line && ctx.measureText(line).width>maxW && line.length>1){
        let cut=line.length;
        while(cut>1 && ctx.measureText(line.slice(0,cut)).width>maxW)cut--;
        lines.push(line.slice(0,cut));line=line.slice(cut);
      }
    });
    lines.push(line);
  });
  return lines;
}
function drawOrnament(ctx,kind,x,y,size,style){
  ctx.save();ctx.fillStyle=style.ink||'#5c2a63';ctx.strokeStyle=style.ink||'#5c2a63';ctx.globalAlpha=.8;
  ctx.textAlign='center';ctx.textBaseline='middle';
  if(kind==='line'){
    const half=size*1.5;ctx.lineWidth=Math.max(1,size*.045);
    ctx.beginPath();ctx.moveTo(x-half,y);ctx.lineTo(x+half,y);ctx.stroke();
    ctx.beginPath();ctx.arc(x,y,size*.12,0,Math.PI*2);ctx.fill();
  }else if(kind==='dots'){
    const gap=size*.7;for(let k=-1;k<=1;k+=1){ctx.beginPath();ctx.arc(x+k*gap,y,size*.11,0,Math.PI*2);ctx.fill()}
  }else if(kind==='hearts'){
    const s=Math.max(9,size*.66);ctx.font=`${s}px "DM Sans", Arial, sans-serif`;ctx.fillText('♡  ♡  ♡',x,y);
  }else if(kind==='flourish'){
    const s=Math.max(9,size*.8);ctx.font=`${style.weight??500} ${s}px ${style.font}`;ctx.fillText('✦',x,y);
  }
  ctx.restore();
}

// Dibuja el texto centrado dentro del lienzo (w×h), exprimiendo el tamaño de
// la fuente hasta que todo el bloque quepa. Nunca se sale del lienzo.
function drawFittedText(ctx,text,w,h,style,opts){
  const padX=opts.padX!=null?opts.padX:w*.07;
  const padY=opts.padY!=null?opts.padY:h*.14;
  const maxW=Math.max(8,w-padX*2);
  const maxH=Math.max(8,h-padY*2);
  const align=style.align||'center';
  const paragraphs=String(text==null?'':text).split('\n');
  const decoration=(style.decoration&&style.decoration!=='none')?style.decoration:null;
  const reserveOrnament=(decoration&&opts.ornament!==false)?1:0;
  const baseSize=(opts.baseSize!=null?opts.baseSize:Math.min(h*.42,w*.09))*(style.sizeScale||1);
  let size=Math.max(9,baseSize);
  let lines=[];let lh=size*(style.lineHeight||1.4);
  for(;size>=9;size-=1){
    ctx.font=fontString(style,size);
    applyLetterSpacing(ctx,style.letterSpacing);
    lines=wrapParagraphs(ctx,paragraphs,maxW);
    lh=size*(style.lineHeight||1.4);
    const blockH=lines.length*lh;
    const ornamentH=reserveOrnament?size*1.3:0;
    if(widthOfLongestLine(ctx,lines)<=maxW+.5 && blockH+ornamentH<=maxH)break;
  }
  ctx.font=fontString(style,size);
  applyLetterSpacing(ctx,style.letterSpacing);
  ctx.fillStyle=style.ink||'#5c2a63';
  ctx.textBaseline='middle';
  ctx.textAlign=align;
  const blockH=lines.length*lh;
  const ornamentH=reserveOrnament?size*1.3:0;
  const top=(h-(blockH+ornamentH))/2;
  const x=align==='left'?padX:align==='right'?w-padX:w/2;
  lines.forEach((line,i)=>{if(line)ctx.fillText(line,x,top+lh*(i+.5))});
  if(reserveOrnament)drawOrnament(ctx,decoration,x,top+blockH+size*.7,size,style);
}

function styleKey(style){
  return [style.font,style.weight,style.italic,style.sizeScale,style.lineHeight,style.align,style.letterSpacing,style.ink,style.decoration].join('|');
}

// Dibuja y devuelve una textura sin caché (marcadores y glifos).
function makeCanvasTexture(text,style,w,h,opts){
  const canvas=document.createElement('canvas');
  canvas.width=Math.max(1,Math.round(w));
  canvas.height=Math.max(1,Math.round(h));
  const ctx=canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawFittedText(ctx,text,canvas.width,canvas.height,style,opts||{});
  const texture=new THREE.CanvasTexture(canvas);
  texture.colorSpace=THREE.SRGBColorSpace;
  texture.anisotropy=8;
  texture.needsUpdate=true;
  return texture;
}

// Textura de texto con caché por (texto + estilo + medidas).
function textTexture(text,style,w,h,opts){
  const key=`${text}|${w}|${h}|${styleKey(style)}|<${JSON.stringify({baseSize:opts?.baseSize,padX:opts?.padX,padY:opts?.padY,ornament:opts?.ornament})}>`;
  if(textTextureCache.has(key))return textTextureCache.get(key);
  const texture=makeCanvasTexture(text,style,w,h,opts);
  textTextureCache.set(key,texture);
  return texture;
}

function glyphTexture(glyph,color,size){
  const key=`${glyph}|${color}|${size}`;
  if(glyphTextureCache.has(key))return glyphTextureCache.get(key);
  const canvas=document.createElement('canvas');
  canvas.width=size;canvas.height=size;
  const ctx=canvas.getContext('2d');
  ctx.clearRect(0,0,size,size);
  ctx.fillStyle=color;
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.font=`${Math.round(size*.8)}px "Quicksand", "Trebuchet MS", Arial, sans-serif`;
  ctx.fillText(glyph,size/2,size/2+Math.round(size*.06));
  const texture=new THREE.CanvasTexture(canvas);
  texture.colorSpace=THREE.SRGBColorSpace;
  glyphTextureCache.set(key,texture);
  return texture;
}

// Marcador mientras una foto no termina de cargar (un corazón suave único,
// sin repetir ningún mensaje entre cartas).
function placeholderTexture(){
  const style={font:'"Cormorant Garamond", "Times New Roman", serif',weight:600,italic:false,sizeScale:1,lineHeight:1,align:'center',letterSpacing:0,ink:'#ff9ec6',decoration:null};
  return makeCanvasTexture('♡',style,760,600,{baseSize:320,padX:60,padY:60,ornament:false});
}

// Marcador para un marco NUEVO que todavía no tiene foto ni vídeo asignado:
// un borde punteado muy suave y un corazoncito tenue. Es UNA sola textura
// compartida por todos los marcos vacíos (así no se crean 16 lienzos iguales),
// discreta y coherente con el resto del universo.
let emptySlotTexture=null;
function emptyPhotoTexture(){
  if(emptySlotTexture)return emptySlotTexture;
  const w=760,h=600;
  const canvas=document.createElement('canvas');
  canvas.width=w;canvas.height=h;
  const ctx=canvas.getContext('2d');
  ctx.clearRect(0,0,w,h);
  // Borde punteado redondeado, en rosa suave con transparencia.
  ctx.save();
  ctx.strokeStyle='rgba(255,158,198,0.5)';
  ctx.lineWidth=4;
  ctx.setLineDash([16,13]);
  const m=34,r=30;
  ctx.beginPath();
  ctx.moveTo(m+r,m);
  ctx.arcTo(w-m,m,w-m,h-m,r);
  ctx.arcTo(w-m,h-m,m,h-m,r);
  ctx.arcTo(m,h-m,m,m,r);
  ctx.arcTo(m,m,w-m,m,r);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
  // Corazón tenue en el centro.
  ctx.fillStyle='rgba(255,158,198,0.72)';
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.font='150px "Cormorant Garamond", "Times New Roman", serif';
  ctx.fillText('♡',w/2,h/2+6);
  const texture=new THREE.CanvasTexture(canvas);
  texture.colorSpace=THREE.SRGBColorSpace;
  emptySlotTexture=texture;
  return texture;
}

// Crea un panel de texto y lo registra para poder redibujarlo cuando las
// fuentes terminen de cargar.
function makeTextPlane(text,style,options){
  const geometry=new THREE.PlaneGeometry(options.planeW,options.planeH);
  // depthWrite:false evita que la lámina transparente tape lo que hay detrás.
  const material=new THREE.MeshBasicMaterial({transparent:true,depthWrite:false});
  const mesh=new THREE.Mesh(geometry,material);
  const canvasH=Math.max(64,Math.round(TEXTURE_WIDTH*(options.planeH/options.planeW)));
  mesh.userData.cardText={
    text,style,
    canvasW:TEXTURE_WIDTH,canvasH,
    opts:{
      baseSize:canvasH*(options.baseSizeRatio||.135),
      padX:TEXTURE_WIDTH*(options.padXRatio!=null?options.padXRatio:.06),
      padY:canvasH*(options.padYRatio!=null?options.padYRatio:.12),
      ornament:options.ornament
    }
  };
  applyTextTexture(mesh);
  return mesh;
}

function applyTextTexture(mesh){
  const info=mesh.userData.cardText;
  if(!info)return;
  mesh.material.map=textTexture(info.text,info.style,info.canvasW,info.canvasH,info.opts);
  mesh.material.color.set(0xffffff);
  mesh.material.needsUpdate=true;
}

// Redibuja todos los textos de las cartas (se llama cuando las fuentes
// personalizadas ya están listas). Recicla las texturas viejas.
export function refreshMemoryTextures(group){
  textTextureCache.forEach(texture=>texture.dispose());
  textTextureCache.clear();
  if(group)group.traverse(obj=>{if(obj.userData&&obj.userData.cardText)applyTextTexture(obj)});
}

// Carga explícita (y con respaldo) de las familias usadas en los lienzos,
// para que `measureText` y el dibujo usen la tipografía real.
const FONT_SPECIMENS=[
  '400 40px "DM Sans"','500 40px "DM Sans"','700 40px "DM Sans"',
  '500 40px "Playfair Display"','600 40px "Playfair Display"','700 40px "Playfair Display"','italic 500 40px "Playfair Display"','italic 600 40px "Playfair Display"',
  '400 40px "Cormorant Garamond"','500 40px "Cormorant Garamond"','600 40px "Cormorant Garamond"','italic 400 40px "Cormorant Garamond"','italic 500 40px "Cormorant Garamond"',
  '400 40px "Quicksand"','500 40px "Quicksand"','600 40px "Quicksand"','700 40px "Quicksand"',
  '400 40px "Caveat"','500 40px "Caveat"','600 40px "Caveat"','700 40px "Caveat"',
  '500 40px "Dancing Script"','600 40px "Dancing Script"','700 40px "Dancing Script"',
  '400 40px "Parisienne"'
];
export async function loadCardFonts(){
  if(!document.fonts||!document.fonts.load)return;
  await Promise.all(FONT_SPECIMENS.map(spec=>document.fonts.load(spec).catch(()=>null)));
}

// Distancias (unidades del mundo) para encender/apagar cada vídeo según lo
// cerca que esté el jugador. Entre las dos hay histéresis para que no se
// encienda y apague sin parar. Ajusta estos dos números si lo necesitas.
const VIDEO_ACTIVATE_DISTANCE=22; // dentro de este radio el vídeo se reproduce
const VIDEO_SLEEP_DISTANCE=30;    // más lejos que esto, el vídeo se pausa
const VIDEO_ACTIVATE_SQ=VIDEO_ACTIVATE_DISTANCE*VIDEO_ACTIVATE_DISTANCE;
const VIDEO_SLEEP_SQ=VIDEO_SLEEP_DISTANCE*VIDEO_SLEEP_DISTANCE;

export function animateMemories(group,time,player,focus){
  group.children.forEach(memory=>{
    const d=memory.userData;
    memory.position.y=d.baseY+Math.sin(time*.001+d.phase)*.18;
    const dx=memory.position.x-player.x,dy=memory.position.y-player.y,dz=memory.position.z-player.z;
    const distSq=dx*dx+dy*dy+dz*dz;
    const target=distSq<25?1.08:1;
    memory.scale.x+=(target-memory.scale.x)*.08;memory.scale.y=memory.scale.x;memory.scale.z=memory.scale.x;
    // Vídeo cercano = se reproduce y refresca su textura (sin recrear
    // geometría). Vídeo lejano = se pausa y deja de refrescarse, de modo que
    // los diez vídeos no cuestan GPU ni CPU a la vez.
    const media=d.videoController;
    if(media){
      if(distSq<=VIDEO_ACTIVATE_SQ){if(!d.videoActive){media.start();d.videoActive=true;}}
      else if(distSq>=VIDEO_SLEEP_SQ){if(d.videoActive){media.pause();d.videoActive=false;}}
      if(d.videoActive&&d.videoTexture)d.videoTexture.needsUpdate=true;
    }
    if(d.data.particles)memory.children.forEach((child,i)=>{if(child.isSprite){child.position.y=child.userData.baseY+Math.sin(time*.002+i)*.001}})
  });
  if(focus){focus.scale.x+=(1.14-focus.scale.x)*.1;focus.scale.y=focus.scale.x;focus.scale.z=focus.scale.x}
}

// Libera todos los recursos de una memoria (geometrías, materiales, vídeo).
// Se usa cuando una memoria se destruye o se reemplaza.
export function disposeMemory(group){
  if(group&&group.userData){group.userData.videoTexture=null;group.userData.videoController=null;}
  disposeObject3D(group);
}