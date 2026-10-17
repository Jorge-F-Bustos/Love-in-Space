import * as THREE from 'three';

// ==========================================================================
//  MEDIA.JS — SISTEMA COMPARTIDO DE MEDIOS (IMÁGENES Y VÍDEOS)
// --------------------------------------------------------------------------
//  Reúne en un único lugar:
//    • la detección del tipo de medio (imagen o vídeo) a partir de la
//      extensión del archivo o de un campo explícito;
//    • la construcción de texturas de vídeo listas para WebGL;
//    • el cálculo del marco adaptado a la proporción real del contenido;
//    • la limpieza de los recursos asociados.
//
//  Lo usan tanto memoryObjects.js (las memorias) como world.js (la foto
//  central) para no duplicar lógica ni crear un segundo sistema de
//  colocación distinto solo para los vídeos.
// ==========================================================================

// Extensiones que se interpretan como vídeo. Cualquier otra se trata como
// imagen, de modo que todos los formatos que ya funcionaban siguen igual.
const VIDEO_EXTENSIONS = ['mp4', 'webm', 'mov', 'm4v', 'ogv', 'ogg'];

// Ajustes del marco adaptativo. Con una relación 3:2 produce exactamente el
// mismo tamaño que ya usaba el proyecto (marco 3.25 × 2.65 y contenido
// 2.7 × 1.8), así que las memorias existentes no cambian de aspecto.
export const FRAME_CONFIG = {
  area: 4.86,        // área base del contenido (2.7 × 1.8)
  minWidth: 1.05,    // evita marcos diminutos
  minHeight: 0.9,
  maxWidth: 3.7,     // evita que un medio panorámico ocupe demasiado
  maxHeight: 3.0,
  padX: 0.275,       // grosor lateral del marco
  padTop: 0.425,     // grosor superior
  padBottom: 0.425,  // grosor inferior (aloja la leyenda)
  depth: 0.12,       // profundidad de la caja del marco
  mediaZ: 0.08,      // el contenido va por delante de la cara frontal
  captionGap: 0.15,  // separación entre el contenido y la leyenda
  captionHeight: 0.42,
  captionInset: 0.2,
  dotInset: 0.325,
  dotRadius: 0.12
};

// Convierte una ruta en una URL segura sin romper las secuencias ya
// codificadas (`%20`): solo escapa espacios y caracteres no ASCII.
export function encodeMediaPath(src) {
  return String(src)
    .replace(/[^\x20-\x7E]/g, (char) => encodeURIComponent(char))
    .replace(/ /g, '%20');
}

// ¿La ruta termina en una extensión de vídeo conocida?
export function isVideoSource(src) {
  if (typeof src !== 'string') return false;
  const clean = src.split('#')[0].split('?')[0];
  const dot = clean.lastIndexOf('.');
  if (dot === -1) return false;
  return VIDEO_EXTENSIONS.includes(clean.slice(dot + 1).toLowerCase());
}

// Resuelve la ruta y el tipo de un medio. Se admiten las claves que ya usa
// el proyecto (`image`) y las nuevas (`video`, `media`, `mediaType`) sin
// romper ninguna memoria existente.
export function resolveMedia(item = {}) {
  const src = item.media || item.video || item.image || '';
  if (!src) return null;
  const declared = String(item.mediaType || '').toLowerCase();
  let isVideo;
  if (declared === 'video') isVideo = true;
  else if (declared === 'image') isVideo = false;
  else if (item.video) isVideo = true;
  else isVideo = isVideoSource(src);
  return { src, isVideo };
}

// Tamaño del contenido y de su marco a partir de las dimensiones reales del
// medio. Se conserva el aspecto (sin estirones) dentro de un área estable y
// con límites mínimos y máximos para medios muy alargados.
export function computeFrameLayout(width, height, config = FRAME_CONFIG) {
  const safeW = Number.isFinite(width) && width > 0 ? width : 3;
  const safeH = Number.isFinite(height) && height > 0 ? height : 2;
  const aspect = safeW / safeH;
  let contentW = Math.sqrt(config.area * aspect);
  let contentH = Math.sqrt(config.area / aspect);
  // Primero se respetan los mínimos y después los máximos (los máximos
  // prevalecen para que un medio extremo no ocupe demasiado espacio).
  const grow = Math.max(config.minWidth / contentW, config.minHeight / contentH, 1);
  contentW *= grow;
  contentH *= grow;
  const shrink = Math.min(1, config.maxWidth / contentW, config.maxHeight / contentH);
  contentW *= shrink;
  contentH *= shrink;
  return {
    contentW,
    contentH,
    frameW: contentW + config.padX * 2,
    frameH: contentH + config.padTop + config.padBottom,
    captionY: -contentH / 2 - (config.captionGap || 0)
  };
}

// --------------------------------------------------------------------------
//  VÍDEO
// --------------------------------------------------------------------------

// Crea un <video> invisible con la configuración necesaria para que funcione
// como textura en WebGL y pueda autoreproducirse en escritorio y móvil.
function createVideoElement(src) {
  const video = document.createElement('video');
  video.src = encodeMediaPath(src);
  video.loop = true;
  video.muted = true;
  video.defaultMuted = true;
  video.autoplay = true;
  video.playsInline = true;
  video.preload = 'metadata'; // basta para conocer las dimensiones
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');
  video.setAttribute('aria-hidden', 'true');
  // Fuera de la vista, sin controles ni interferencia con la interfaz.
  video.style.cssText = 'position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0;pointer-events:none;';
  return video;
}

// Lanza la reproducción gestionando con seguridad la promesa de play().
export function startVideoPlayback(video) {
  const attempt = video.play();
  if (attempt && typeof attempt.catch === 'function') {
    attempt.catch(() => {
      // El navegador bloqueó el autoplay: se reintenta con el primer gesto.
      const resume = () => { video.play().catch(() => {}); };
      window.addEventListener('pointerdown', resume, { once: true, passive: true });
      window.addEventListener('keydown', resume, { once: true });
    });
  }
}

// Crea un medio de vídeo (elemento + textura). Devuelve también su función
// de limpieza para poder destruirlo cuando la memoria desaparezca.
//
// `options.autoStart` (por defecto true) indica si el vídeo debe empezar a
// reproducirse solo. Con `autoStart:false` el elemento se crea con los
// metadatos (para conocer sus dimensiones y ajustar el marco) pero NO se
// reproduce ni se descarga entero hasta llamar a `start()`. Así se pueden
// tener muchos vídeos listos sin que todos decodifiquen a la vez.
export function createVideoMedia(src, handlers = {}, options = {}) {
  const autoStart = options.autoStart !== false;
  const video = createVideoElement(src);
  video.autoplay = autoStart;
  const texture = new THREE.VideoTexture(video);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = false; // los vídeos no tienen POT garantizado
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  let disposed = false;

  const onLoaded = () => {
    if (disposed) return;
    if (handlers.onReady) handlers.onReady(video.videoWidth, video.videoHeight);
  };
  const onError = () => {
    if (disposed) return;
    if (handlers.onError) handlers.onError();
  };
  const onEnded = () => {
    // Red de seguridad: aunque loop=true, se reinicia si algún navegador
    // lanza `ended` de todos modos.
    if (disposed) return;
    video.play().catch(() => {});
  };

  video.addEventListener('loadedmetadata', onLoaded);
  video.addEventListener('error', onError);
  video.addEventListener('ended', onEnded);

  // Se añade al documento para maximizar la compatibilidad del autoplay.
  document.body.appendChild(video);
  if (autoStart) startVideoPlayback(video);
  // Si ya estaba listo (caché), se avisa en el siguiente turno para que el
  // consumidor reciba antes la referencia a este objeto.
  if (video.readyState >= 1) queueMicrotask(onLoaded);

  return {
    video,
    texture,
    // Enciende la reproducción (se usa al acercarse a un vídeo diferido).
    start() { if (!disposed) startVideoPlayback(video); },
    // Pausa la reproducción sin destruir nada (se usa al alejarse).
    pause() { if (disposed) return; try { video.pause(); } catch (error) { /* sin acción */ } },
    dispose() {
      if (disposed) return;
      disposed = true;
      video.removeEventListener('loadedmetadata', onLoaded);
      video.removeEventListener('error', onError);
      video.removeEventListener('ended', onEnded);
      try { video.pause(); } catch (error) { /* sin acción */ }
      video.removeAttribute('src');
      try { video.load(); } catch (error) { /* sin acción */ }
      if (video.parentNode) video.parentNode.removeChild(video);
      texture.dispose();
    }
  };
}

// --------------------------------------------------------------------------
//  IMAGEN
// --------------------------------------------------------------------------

// Carga una imagen y avisa con la textura y sus dimensiones reales.
export function loadImageMedia(src, handlers = {}) {
  const loader = new THREE.TextureLoader();
  loader.load(
    encodeMediaPath(src),
    (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      const image = texture.image || {};
      const width = image.naturalWidth || image.width || 3;
      const height = image.naturalHeight || image.height || 2;
      if (handlers.onReady) handlers.onReady(texture, width, height);
    },
    undefined,
    () => { if (handlers.onError) handlers.onError(); }
  );
}

// --------------------------------------------------------------------------
//  LIMPIEZA
// --------------------------------------------------------------------------

// Libera geometrías, materiales y medios de vídeo de un objeto y sus hijos.
// No destruye las texturas de texto (lienzo) ni los glifos compartidos, que
// viven en cachés reutilizables.
export function disposeObject3D(object) {
  if (!object) return;
  object.traverse((child) => {
    if (child.userData && typeof child.userData.mediaDispose === 'function') {
      child.userData.mediaDispose();
      child.userData.mediaDispose = null;
    }
    if (child.geometry) child.geometry.dispose();
    const materials = child.material
      ? (Array.isArray(child.material) ? child.material : [child.material])
      : [];
    materials.forEach((material) => {
      if (!material) return;
      // Solo se destruyen las texturas propias del medio (marcadas con
      // `disposeMap`); las de texto/glifos se comparten y se conservan.
      if (child.userData && child.userData.disposeMap && material.map) {
        material.map.dispose();
      }
      material.dispose();
    });
  });
}
