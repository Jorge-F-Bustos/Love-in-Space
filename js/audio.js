// ---------------------------------------------------------------------------
//  AUDIO.JS — MÚSICA DE FONDO DEL UNIVERSO
// ---------------------------------------------------------------------------
//  La canción (assets/audio/music.mp3) no suena durante la pantalla inicial:
//  se carga en silencio y solo arranca al pulsar «ENTRAR», respetando así las
//  restricciones de reproducción automática de los navegadores. El botón
//  existente (#music-toggle) la pausa y la reanuda durante la exploración, y la
//  pista se repite en bucle sin fin mientras la reproducción esté activa.
export function setupAudio(){
  const audio=new Audio('assets/audio/music.mp3');
  audio.loop=true;    // bucle continuo: la música nunca se corta al llegar al final
  audio.volume=.22;   // volumen suave, pero siempre audible (no se silencia)
  const button=document.querySelector('#music-toggle');
  // El botón refleja SIEMPRE el estado real del elemento de audio (audio.paused),
  // no una variable aparte que pudiera desincronizarse.
  const updateButton=()=>{button.innerHTML=audio.paused?'🔇 <span>Música inactiva</span>':'♫ <span>Música activa</span>'};
  // Reanuda la reproducción gestionando con cuidado la promesa de play(): si el
  // navegador la bloquea, el botón se resincroniza sin romper la escena.
  const resume=()=>{audio.play().catch(()=>{}).then(updateButton)};
  // El estado del botón se mantiene sincronizado con los eventos del propio audio.
  audio.addEventListener('play',updateButton);
  audio.addEventListener('pause',updateButton);
  // Cada pulsación alterna entre pausa y reanudación, sin crear oyentes ni
  // instancias de audio duplicadas.
  button.addEventListener('click',()=>{audio.paused?resume():audio.pause()});
  updateButton();
  let started=false;  // evita que la canción arranque más de una vez
  return{
    // Se llama una única vez, al pulsar «ENTRAR».
    start(){if(started)return;started=true;resume()}
  };
}
