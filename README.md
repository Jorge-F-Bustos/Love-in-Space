# Love in Space

Una experiencia 3D romantica hecha con Three.js y modulos JavaScript nativos. No necesita backend ni proceso de build para publicarse en GitHub Pages.

## Personalizar memorias

1. Coloca tus imagenes en `assets/images/`.
2. Abre `js/memories.js` y cambia los objetos de la lista.
3. Usa rutas relativas y formatos `.jpg`, `.jpeg`, `.png` o `.webp`.
4. Opcionalmente coloca `music.mp3` en `assets/audio/`.

Si una imagen no existe, el universo muestra una tarjeta de memoria vacia y continua funcionando.

## Usar videos (MP4)

En cualquier memoria de tipo `photo` puedes usar un video en lugar de una imagen:

- Escribe la ruta del archivo en `image` (por ejemplo `assets/images/clip.mp4`);
  el tipo se detecta por la extension.
- O usa la clave `video`: `{ type:'photo', video:'assets/images/clip.mp4', ... }`.
- Si necesitas forzarlo, anade `mediaType: 'video'` (o `'image'`).

Los videos se reproducen automaticamente, en bucle y sin sonido, y el marco se
adapta a su proporcion real (vertical, horizontal o cuadrada). Los formatos
recomendados son `.mp4` y `.webm`. Las imagenes siguen funcionando igual que antes.

La memoria especial que flota sobre el corazon (`assets/images/photo-central.jpg`)
tambien admite un video: basta con reemplazar ese archivo por un `.mp4` y
actualizar su ruta en `js/world.js` (`CENTRAL_MEDIA_SRC`).

## Ejecutar localmente

Desde la carpeta del proyecto puedes usar cualquier servidor estatico, por ejemplo:

```bash
npx vite --host 127.0.0.1
```

Tambien puede desplegarse directamente como una carpeta estatica. La dependencia Three.js se carga desde un import map CDN.

## Controles

- Escritorio: `WASD` para desplazarse, `Space` y `Shift` para subir y bajar, mouse para mirar.
- Movil: joystick izquierdo para desplazarse, arrastre para mirar y botones verticales.
- Click o tap en una memoria para contemplarla y ver su mensaje.
