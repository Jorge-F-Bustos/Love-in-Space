# Love in Space — Nuestro pequeño universo

**Love in Space** es un universo 3D navegable ambientado en el espacio, pensado
para dedicar una experiencia personalizada a alguien especial. Reúne fotografías,
vídeos, mensajes románticos, personajes 3D, decoraciones y música de fondo en una
escena que se recorre en primera persona.

El proyecto está hecho con **Three.js** y **módulos JavaScript nativos**, sin
backend y sin proceso de compilación: es un sitio estático que puede publicarse
tal cual en GitHub Pages. Toda la personalización se hace editando unos pocos
archivos de configuración y sustituyendo tus propios archivos de imagen, vídeo,
audio y modelos 3D.

Puedes reutilizar este repositorio para crear **tu propio universo** para otra
persona, otra ocasión o incluso otro proyecto personal: cambia las fotos, los
mensajes, los colores y la música, y tendrás una experiencia totalmente distinta
sobre la misma base.

---

## Índice

- [Qué es Love in Space](#qué-es-love-in-space)
- [Características](#características)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Cómo añadir y cambiar fotografías](#cómo-añadir-y-cambiar-fotografías)
- [Cómo añadir y cambiar vídeos](#cómo-añadir-y-cambiar-vídeos)
- [Cómo cambiar las leyendas (pies de foto)](#cómo-cambiar-las-leyendas-pies-de-foto)
- [Cómo editar las notas románticas y las cartas](#cómo-editar-las-notas-románticas-y-las-cartas)
- [Cómo añadir modelos 3D desde Sketchfab](#cómo-añadir-modelos-3d-desde-sketchfab)
- [Cómo personalizar los colores y el aspecto visual](#cómo-personalizar-los-colores-y-el-aspecto-visual)
- [Cómo usar y personalizar la música (music.mp3)](#cómo-usar-y-personalizar-la-música-musicmp3)
- [Cómo explorar la experiencia en PC y en móvil](#cómo-explorar-la-experiencia-en-pc-y-en-móvil)
- [Cómo ejecutar el proyecto localmente](#cómo-ejecutar-el-proyecto-localmente)
- [Cómo publicar en GitHub Pages](#cómo-publicar-en-github-pages)
- [Solución de problemas y mantenimiento](#solución-de-problemas-y-mantenimiento)
- [Flujo de personalización y contribución](#flujo-de-personalización-y-contribución)

---

## Qué es Love in Space

Al abrir la página verás una pantalla de carga y, después, una portada con el
botón **ENTRAR**. Al pulsarlo comienza la experiencia: apareces flotando en un
pequeño universo donde gira un **corazón central** rodeado de planetas,
estrellas, flores, sobres y personajes. Repartidos por el espacio encontrarás
**marcos con fotos y vídeos**, y **cartas con mensajes** que puedes contemplar de
cerca. De fondo suena una canción que puedes pausar con el botón de música.

Todo el universo está descrito en archivos de configuración legibles, de modo que
no hace falta saber programar en profundidad para cambiar las fotos, los textos o
la música. Este documento explica, paso a paso, qué archivo tocar en cada caso y
qué debes dejar intacto para no romper la escena.

> Nota: las fotos, mensajes y la canción que trae el repositorio son de ejemplo y
> dependen de los archivos que cada persona coloque en las carpetas de recursos.
> La carpeta `assets/` es donde vive todo el contenido personalizable.

---

## Características

Estas son las capacidades confirmadas en el código actual:

- **Entorno 3D interactivo** hecho con Three.js, con cámara en primera persona.
- **Escenario navegable** con movimiento por teclado (PC) o joystick (móvil).
- **Fotografías y vídeos** mostrados dentro de marcos 3D que se adaptan a la
  proporción real de cada archivo.
- **Leyenda individual** (pie de foto) para cada medio, con tipografía propia.
- **Notas, cartas y mensajes románticos** editables, con varias formas y
  tipografías.
- **Modelos 3D decorativos y personajes** cargados desde archivos `.glb`
  (incluidos los personajes de **BT21**), además de letras 3D y adornos.
- **Corazón central** con elementos orbitando y una **memoria especial** que
  flota sobre él.
- **Música de fondo** que empieza al pulsar **ENTRAR**, se repite en bucle y se
  controla con el botón de música existente.
- **Diseño adaptable** a ordenador y a dispositivos móviles (controles táctiles
  automáticos en pantallas táctiles).
- **Publicación como sitio estático** en GitHub Pages, sin servidor propio.

Todo esto funciona sin procesos de compilación: el navegador carga directamente
los módulos JavaScript y los recursos de `assets/`.

---

## Estructura del proyecto

La carpeta del proyecto (`Love-in-Space/`) contiene lo siguiente:

```
Love-in-Space/
├── index.html            Página principal: carga los estilos y js/main.js
├── .nojekyll             Evita que GitHub Pages procese los archivos con Jekyll
├── README.md             Este documento
├── css/
│   ├── style.css         Estilos de la interfaz (portada, HUD, controles táctiles)
│   └── overrides.css     Ajustes del botón de música y los botones verticales
├── js/
│   ├── main.js           Punto de entrada: monta la escena y arranca todo
│   ├── intro.js          Pantalla de carga, portada y botón ENTRAR
│   ├── audio.js          Música de fondo y su botón de pausa
│   ├── scene.js          Escena, cámara, luces, fondo y nebulosas
│   ├── controls.js       Controles en primera persona (WASD, mirar, límites)
│   ├── interactions.js   Clic/tap sobre las memorias y controles táctiles
│   ├── particles.js      Partículas flotantes del ambiente
│   ├── world.js          Corazón central, órbita y memoria especial central
│   ├── decorations.js    Corazones, estrellas, lunas, planetas, flores, sobres...
│   ├── characters.js     Carga y animación de los modelos .glb
│   ├── letters.js        Letras 3D "J" y "V" y sus corazones en órbita
│   ├── modelPositions.js Posición, rotación y escala de cada modelo 3D
│   ├── memories.js       Definición de todas las memorias (fotos, vídeos, notas)
│   ├── memoryObjects.js  Construye marcos, cartas, leyendas y textos
│   ├── media.js          Detecta imagen o vídeo y adapta el marco a su tamaño
│   ├── cardStyles.js     Tipografías y colores del texto de las cartas
│   └── spatial.js        Reparte las posiciones de la escena por el mundo
├── assets/
│   ├── images/           Fotos (.png/.jpg), vídeos (.mp4) y la foto central
│   ├── audio/            La música de fondo (music.mp3)
│   └── models/           Modelos 3D (.glb) usados por la escena
└── _snapshot/            Copias de seguridad antiguas (.bak): no se usan
```

Responsabilidades de los archivos más importantes:

- **Inicialización y portada**: `index.html` carga `js/main.js`. La pantalla de
  carga, la portada y el botón **ENTRAR** están en `index.html` y `js/intro.js`.
- **Escena 3D y render**: `js/scene.js` crea la escena, la cámara y las luces;
  `js/main.js` ejecuta el bucle de animación y el render.
- **Definición de memorias**: `js/memories.js` describe cada foto, vídeo y nota.
- **Generación de marcos y adaptación al tamaño**: `js/memoryObjects.js` crea los
  marcos y las cartas; `js/media.js` calcula el marco según las dimensiones
  reales de la imagen o el vídeo.
- **Leyendas, notas y estilos de texto**: los textos se dibujan en
  `js/memoryObjects.js` y su aspecto (tipografía y color) se define en
  `js/cardStyles.js`.
- **Modelos 3D**: `js/modelPositions.js` guarda la colocación; `js/characters.js`
  los carga y `js/letters.js` construye las letras.
- **Recursos (imágenes, vídeo, audio, modelos)**: carpeta `assets/`.
- **Colores, fuentes, luces y decoraciones**: `js/scene.js`, `js/decorations.js`,
  `js/cardStyles.js`, `js/memoryObjects.js` y las hojas de `css/`.
- **Rutas y compatibilidad con GitHub Pages**: las rutas son **relativas**
  (`assets/...`, `js/...`, `css/...`), de modo que funcionan igual en la raíz del
  dominio o dentro de una subcarpeta de repositorio. El archivo `.nojekyll`
  evita el procesado de Jekyll.
- **Dependencias y herramientas**: Three.js se carga por CDN con un *import map*
  dentro de `index.html` (versión 0.170.0 de `unpkg`), y las tipografías se
  cargan desde Google Fonts. En la raíz del espacio de trabajo hay un
  `package.json` con **Vite** como dependencia de desarrollo (opcional, solo para
  servidor local). El proyecto **no** necesita compilación.

> `_snapshot/` contiene versiones antiguas (`.bak`) que **no se cargan** en la
> aplicación. Puedes ignorarla o eliminarla si quieres, pero no es necesario.

---

## Cómo añadir y cambiar fotografías

Las fotografías se colocan en `assets/images/` y se describen en
`js/memories.js`, dentro del bloque **FOTOS**.

### Paso a paso

1. **Copia tu imagen** a la carpeta `assets/images/`. Se admiten, por ejemplo,
   `.jpg`, `.jpeg`, `.png` y `.webp`. Usa nombres sencillos y sin espacios, por
   ejemplo `mi-foto.jpg`.
2. **Abre** `js/memories.js` y busca la sección `FOTOS`.
3. **Añade una entrada** nueva siguiendo el mismo formato que las demás. Puedes
   copiar una línea existente y cambiar solo lo necesario:

   ```js
   { id:'mi-foto-01', type:'photo', image:'assets/images/mi-foto.jpg', caption:'Nuestro día ♡', position:{x:5,y:2,z:-12}, rotation:{x:0,y:-.2,z:.03}, frame:'polaroid', textStyle:'leyenda-ciruela' },
   ```

4. Ajusta estos campos:
   - **`id`**: un identificador **único** (no repitas ninguno).
   - **`image`**: la ruta del archivo, empezando por `assets/images/`.
   - **`caption`**: la leyenda que quieras (puede quedar vacía con `''`).
   - **`position`** y **`rotation`**: dónde y cómo se coloca el marco.
   - **`frame`**: el estilo del marco (`'pink'`, `'polaroid'`, `'cosmic'` o
     `'heart'`).
   - **`textStyle`**: el estilo de la leyenda (ver
     [Cómo cambiar las leyendas](#cómo-cambiar-las-leyendas-pies-de-foto)).
5. **Guarda** y recarga la página.

Para **cambiar una foto existente**, normalmente basta con sustituir el archivo
de `assets/images/` manteniendo el mismo nombre, o con cambiar la ruta del campo
`image`. No necesitas tocar el sistema de dibujado.

> Cada entrada es independiente: puedes dar a cada foto su propio marco, leyenda,
> posición y estilo. Si una ruta no existe, la aplicación muestra un marcador
> suave y sigue funcionando (verás un aviso en la consola del navegador).

**Qué NO debes cambiar** salvo que quieras recolocar algo: los valores de
`position`, `rotation` y `scale` de las entradas que ya existen. Los números de
`position` son unidades del mundo 3D, no píxeles.

---

## Cómo añadir y cambiar vídeos

Los vídeos funcionan con el **mismo sistema** que las fotos: se colocan en
`assets/images/` y se declaran igual, pero apuntando a un archivo de vídeo. El
marco se adapta solo a su proporción (vertical, horizontal o cuadrada).

### Formatos y comportamiento

- Formatos reconocidos por extensión: `.mp4`, `.webm`, `.mov`, `.m4v`, `.ogv` y
  `.ogg`. El más recomendable para compatibilidad es **`.mp4` (códec H.264)**.
- Los vídeos se reproducen **en bucle**, **sin sonido** y **en línea**
  (`playsinline`), pensados para verse dentro de su marco.
- Para ahorrar recursos, un vídeo **solo se reproduce cuando te acercas** a él y
  se pausa cuando te alejas. (Esto es distinto de la música de fondo, que suena
  de forma continua; ver [la sección de música](#cómo-usar-y-personalizar-la-música-musicmp3).)

### Cómo declararlo en `memories.js`

Puedes usar el campo `image` con la ruta de un `.mp4` (el tipo se detecta por la
extensión) o la clave `video`:

```js
{ id:'mi-video-01', type:'photo', video:'assets/images/mi-clip.mp4', caption:'Nuestro momento ♡', position:{x:-6,y:3,z:-14}, rotation:{x:0,y:.25,z:-.03}, frame:'cosmic', textStyle:'leyenda-crema' },
```

- **Dónde colocar el archivo**: en `assets/images/`.
- **Tipo**: `type:'photo'` (tanto fotos como vídeos usan este tipo).
- **Identificador y leyenda**: con `id` y `caption`, igual que en las fotos.
- **Forzar el tipo** (opcional): añade `mediaType:'video'` o `mediaType:'image'`.

### Adaptación del marco

El marco se reajusta en cuanto el navegador conoce las dimensiones reales del
vídeo (`js/media.js`, función `computeFrameLayout`). No hay que indicar el tamaño
a mano.

### Avisos importantes

- **Respeta las mayúsculas y minúsculas** de los nombres de archivo: en GitHub
  Pages (Linux) `Clip.MP4` y `clip.mp4` son archivos distintos.
- No todos los códecs se reproducen en todos los navegadores o móviles. Si un
  vídeo no se ve, prueba a exportarlo como **H.264 dentro de `.mp4`** o como
  `.webm`.
- Los vídeos pesan mucho: varios archivos grandes a la vez pueden ralentizar la
  experiencia en equipos modestos o móviles.

La **memoria especial que flota sobre el corazón** admite también un vídeo. Su
ruta se define en `js/world.js`, en la constante `CENTRAL_MEDIA_SRC`
(por defecto `assets/images/photo-central.jpg`): si la apuntas a un `.mp4`, se
mostrará un vídeo en su lugar.

---

## Cómo cambiar las leyendas (pies de foto)

La leyenda de cada fotografía o vídeo se define **en la propia entrada de
`js/memories.js`**, con el campo **`caption`**:

```js
{ id:'memory-2', type:'photo', image:'assets/images/photo02.png', caption:'Amo mucho nuestro estilo\nde dibujo ་⁺₊♡', position:{x:-13,y:1,z:-15}, rotation:{x:.12,y:.55,z:-.08}, frame:'heart', textStyle:'leyenda-vino' },
```

- **`caption`** es el texto de la leyenda. Puedes usar `\n` para forzar un salto
  de línea.
- **`textStyle`** indica la tipografía y el color básicos de esa leyenda. Los
  estilos disponibles están en `js/cardStyles.js` dentro de `CARD_STYLES`
  (por ejemplo `leyenda-ciruela`, `leyenda-vino`, `leyenda-crema`,
  `leyenda-rosa`, `leyenda-lila`, `leyenda-champan`).
- Si **no** indicas `textStyle`, la leyenda usa un estilo genérico, y su **color
  se elige automáticamente según el marco** (`CAPTION_INK_BY_FRAME` en
  `js/cardStyles.js`), para que se lea bien sobre cada color de marco.
- También puedes ajustar el color de una leyenda concreta con `textColor`
  (por ejemplo `textColor:'#7a1436'`), el tamaño con `textScale` y la alineación
  con `textAlign` (`'left'`, `'center'` o `'right'`).

Las leyendas de foto son textos cortos y se dibujan **sin adornos** y con
interlineado fino, pensadas para caber sobre el marco. El dibujado se hace en
`js/memoryObjects.js` (función `makeCaption`), que no necesitas modificar.

Para cambiar la leyenda de **una sola** foto, edita únicamente su campo
`caption`. Para cambiar el aspecto de **todas** las leyendas que comparten un
estilo, edita esa entrada en `CARD_STYLES` dentro de `js/cardStyles.js`.

---

## Cómo editar las notas románticas y las cartas

Las notas y cartas son memorias de tipo **`'note'`** y también viven en
`js/memories.js`, en la sección **NOTAS**. Cada nota tiene forma de carta,
título opcional y mensaje.

### Propiedades de una nota

```js
{ id:'memory-57', type:'note', title:'Para ti ♡', text:'Eres mi persona favorita en todo el universo.', position:{x:0,y:5,z:-15}, rotation:{x:0,y:.1,z:-.02}, style:'love-letter', textStyle:'serif-poetica' },
```

- **`id`**: identificador único de la nota. En este proyecto se usa el formato
  secuencial `memory-N` (`memory-1`, `memory-2`, …); para una nota nueva, el
  siguiente número libre sería `memory-57`.
- **`title`**: título de la carta (puede quedar vacío con `''`).
- **`text`**: el mensaje. Puedes usar `\n` para separar párrafos.
- **`style`**: la **forma** de la carta. Valores usados en el proyecto:
  `'love-letter'`, `'cloud-note'`, `'star-note'`, `'envelope'`,
  `'diary-page'`, `'postcard'` y `'heart-card'`.
- **`textStyle`**: la tipografía y el color del texto (nombres de
  `CARD_STYLES` en `js/cardStyles.js`).
- **`position`** y **`rotation`**: dónde se coloca y cómo gira la carta.

Opcionalmente puedes añadir `glow:true` (un brillo suave), `glowColor` (color del
brillo), `textColor`, `textScale` y `textAlign`.

### Cómo cambiar el texto de una nota

Para **editar una sola nota**, cambia únicamente su `title` o su `text` y deja el
resto (posición, rotación, estilo y forma) tal como está. Así no afectas a las
demás notas. Por ejemplo, para cambiar solo el mensaje de `memory-36`:

```js
{ id:'memory-36', type:'note', title:'Para mi amorcito ♡', text:'Aquí va tu nuevo mensaje, más bonito todavía.', position:{x:-5,y:-3,z:-11}, rotation:{x:0,y:.18,z:-.04}, style:'love-letter', glow:true, textStyle:'serif-poetica' },
```

Fíjate en que **solo cambia lo que va entre comillas** (`text`); los números de
`position` y `rotation` y los nombres de `style` y `textStyle` se mantienen.

### Dónde está cada cosa

- Las **formas** de las cartas y sus colores de fondo se definen en
  `js/memoryObjects.js` (mapa `colors` y función `makeCardShape`).
- Las **tipografías y colores de tinta** se definen en `js/cardStyles.js`
  (`CARD_STYLES` y `CARD_INKS`).
- El **reparto del texto** dentro de cada forma se ajusta en
  `js/memoryObjects.js` (función `noteLayout`).

### Cómo añadir una nota nueva

Copia una entrada `type:'note'` existente en la sección NOTAS, dale un **`id`
nuevo**, escribe su `title`/`text`, elige `style` y `textStyle` y colócala con
una `position`/`rotation` que no choque con otras cartas.

> En esta versión **no se ha añadido ninguna nota nueva**: la sección solo se ha
> reordenado y sus `id` se han unificado con el formato `memory-N` (`memory-1`,
> `memory-2`, …). Este apartado explica cómo harías tú para añadir las tuyas.

---

## Cómo añadir modelos 3D desde Sketchfab

Los modelos 3D (personajes y decoraciones) se descargan como archivos `.glb` y se
colocan en `assets/models/`. Su colocación se define en `js/modelPositions.js`.

1. **Busca un modelo** en [Sketchfab](https://sketchfab.com/).
2. **Comprueba la licencia**: confirma que el autor permite la descarga y el uso
   (mira los términos de la licencia del modelo y las condiciones de Sketchfab).
   El permiso y las obligaciones de atribución **varían en cada modelo**.
3. **Descarga el modelo en formato `.glb`** cuando esté disponible.
4. **Copia el archivo** a `assets/models/`, con un nombre sin espacios
   (por ejemplo `mi-modelo.glb`).
5. **Registra una entrada** nueva en `js/modelPositions.js`, dentro del objeto
   `MODEL_POSITIONS`:

   ```js
   miModelo: {
     id: 'mi-modelo',
     file: 'assets/models/mi-modelo.glb',
     group: 'world',
     type: 'floating',
     position: { x: 6, y: 2, z: -12 },
     rotation: { x: 0, y: 30, z: 0 },
     scale: 1,
     float: { amplitude: 0.06, speed: 0.0006, phase: 1.0 }
   },
   ```

6. **Ajusta los campos**:
   - **`file`**: ruta del `.glb` dentro de `assets/models/`.
   - **`group`**: `'heart'` cuelga el modelo del corazón (comparte su vaivén);
     `'world'` lo deja fijo en el mundo.
   - **`type`**: `'floating'` (flota suave), `'sway'` (vaivén + balanceo),
     `'static'` (quieto) o `'existing'` (comportamiento original).
   - **`position`**: coordenadas del mundo (no píxeles).
   - **`rotation`**: orientación base **en grados**.
   - **`scale`**: multiplicador de tamaño (1 = tamaño original del `.glb`).
   - **`orientationFix`**: grados extra de giro para corregir modelos que miran
     al lado contrario (por ejemplo, `orientationFix: 180`).
   - **`float`** / **`sway`**: parámetros de animación.
   - **`color`** (opcional): añade una luz suave del color indicado.

7. **Verifica que el modelo carga**: recarga la página y observa la consola; si
   falta el archivo o falla, verás un error indicando el nombre del `.glb`.

Cada modelo es **independiente**: puedes mover, girar o escalar uno sin afectar a
los demás. Para identificar su entrada, guíate por su **`id`** y por el valor de
**`file`**.

> No todos los modelos son descargables ni todos usan el mismo eje frontal o la
> misma escala. Ajusta `scale`, `rotation.y` y, si hace falta, `orientationFix`
> hasta que quede bien. Recuerda **dar crédito a los autores** cuando la licencia
> lo requiera; en `assets/models/README.md` hay una lista de atribuciones de los
> modelos incluidos.

---

## Cómo personalizar los colores y el aspecto visual

No existe un único archivo de estilo: los ajustes están repartidos según lo que
quieras cambiar. Estos son los lugares que debes inspeccionar:

- **Paleta del universo, fondo, niebla y luces**: `js/scene.js`. Aquí se define el
  color de fondo (`scene.background`), la niebla (`scene.fog`) y las luces
  (hemisférica, ambiental, direccional y puntos de luz).
- **Decoraciones** (corazones, estrellas, lunas, planetas, nubes, flores,
  sobres...): `js/decorations.js`. La paleta está en el objeto `colors` y la lista
  de posiciones en el arreglo `entries`.
- **Colores de los marcos de foto**: `js/memoryObjects.js`, objeto
  `frameColors` (`polaroid`, `pink`, `cosmic`, `heart`).
- **Colores de las cartas/notas**: `js/memoryObjects.js`, objeto `colors`
  (colores de las caras según `style`).
- **Tipografías y tintas del texto**: `js/cardStyles.js` (`CARD_STYLES`,
  `CARD_INKS`, `CAPTION_INK_BY_FRAME`). Las familias tipográficas se cargan desde
  Google Fonts, declaradas en `index.html`.
- **Colores del corazón y sus elementos**: `js/world.js`.
- **Interfaz (portada, HUD, botones, joystick)**: `css/style.css` y
  `css/overrides.css`.
- **Ubicación, orientación y escala de los objetos 3D**: `js/modelPositions.js`
  (modelos y letras) y `js/decorations.js` (decoraciones).

Cambios **seguros para principiantes**: colores de `CARD_INKS`, `frameColors`,
`colors` de decoraciones, el color de fondo y la música o las fotos. Cambios que
conviene hacer **con cuidado**: mover objetos, cambiar escalas o tocar luces,
porque alteran el equilibrio visual de la escena.

---

## Cómo usar y personalizar la música (music.mp3)

La música de fondo está configurada en `js/audio.js` y su archivo debe estar en:

```
assets/audio/music.mp3
```

- La canción **no suena mientras se ve la portada**: solo empieza cuando el
  usuario pulsa el botón **ENTRAR**. Así se respetan las restricciones de
  reproducción automática de los navegadores.
- Se reproduce **en bucle continuo** (`loop = true`) y a un volumen suave pero
  audible (`volume = .22`). **No** está silenciada.
- El **botón de música existente** (en la esquina superior derecha, identificado
  como `#music-toggle`) permite **pausar y reanudar** la canción durante la
  exploración.
- Se gestiona la promesa de `play()` para que un bloqueo del navegador no rompa
  la entrada a la experiencia, y se evita que la canción arranque dos veces.

### Cómo cambiar la canción

Sustituye `assets/audio/music.mp3` por tu propio archivo **con el mismo nombre**
(`music.mp3`), o cambia la ruta en `js/audio.js` si prefieres conservar el
archivo original. Si cambias la ruta, hazlo también de forma relativa
(por ejemplo, `assets/audio/mi-cancion.mp3`).

### Avisos

- Usa música que **te pertenezca** o para la que tengas autorización.
- Las políticas de reproducción automática del navegador pueden afectar al
  audio: si algo no suena, interacciona con la página (por ejemplo, pulsando
  ENTRAR o el botón de música).
- **Rutas y mayúsculas**: confirma que el nombre del archivo coincide
  exactamente, también en GitHub Pages.
- Recuerda **confirmar** el archivo real antes de publicar: en el repositorio, el
  `music.mp3` debe estar añadido y subido para que funcione en la web publicada.

---

## Cómo explorar la experiencia en PC y en móvil

### Ordenador (PC)

- **ENTRAR**: pulsa el botón de la portada para comenzar.
- **Moverte**: teclas **W A S D**.
- **Subir / bajar**: **Espacio** para subir y **Shift** para bajar.
- **Mirar alrededor**: mueve el **ratón**. Haz clic sobre la escena para activar
  el bloqueo del puntero (verás el aviso "Haz clic para mirar alrededor").
- **Contemplar una memoria**: coloca el cursor sobre una foto o carta y haz
  **clic** para acercarte; aparecerá un mensaje con su título o leyenda.
- **Música**: usa el botón de música para pausarla o reanudarla.

### Móvil y pantallas táctiles

Los controles táctiles se muestran automáticamente cuando el dispositivo usa
puntero táctil:

- **Joystick** (abajo a la izquierda): moverte por la escena.
- **Arrastrar** sobre la zona de la derecha: girar la mirada.
- **Botones ↑ / ↓**: subir y bajar.
- **Tocar** una foto o carta: contemplarla y ver su mensaje.
- **Botón de música**: pausar o reanudar la canción.

La velocidad y el rendimiento pueden variar según el dispositivo. El proyecto ya
limita el número de fotogramas por segundo y la resolución en móviles, y solo
reproduce los vídeos cercanos para no sobrecargar el equipo.

---

## Cómo ejecutar el proyecto localmente

El proyecto es un sitio estático con **módulos ES** y un *import map* (Three.js
desde CDN). Por eso conviene servirlo con un **servidor local** en lugar de abrir
el archivo directamente.

### Requisitos

- Un navegador moderno (Chrome, Edge, Firefox o Safari).
- Opcional: **Node.js** (si usas Vite o `serve`) o **Python** (si usas su servidor
  integrado). No hace falta instalar dependencias del proyecto: no hay scripts de
  compilación.

### Opciones para arrancarlo

Desde la carpeta `Love-in-Space/`, cualquiera de estas vale:

```bash
# Opción 1: Vite como servidor de desarrollo
npx vite --host 127.0.0.1

# Opción 2: servidor estático simple con Node
npx serve

# Opción 3: servidor integrado de Python
python -m http.server 8000
```

Después abre en el navegador la URL que indique el servidor. Con Vite suele ser
`http://localhost:5173`; con `serve` y con Python suele ser
`http://localhost:3000` y `http://localhost:8000` respectivamente.

> No uses `npm run ...`: el proyecto **no** define scripts de npm. Vite está
> disponible como dependencia de desarrollo en el `package.json` de la raíz del
> espacio de trabajo, y `npx` lo usa directamente.

### Por qué no basta con abrir `index.html`

Al abrir el archivo con `file://`, el navegador aplica restricciones de seguridad
que impiden cargar módulos ES, el *import map* y varios recursos (imágenes,
vídeos y modelos `.glb`) como si estuvieran en un servidor. Por eso pueden fallar
las texturas, los vídeos, los modelos o el propio arranque. Un servidor local
evita esos problemas.

### Comprobaciones rápidas

- Si **falta una imagen o un vídeo**, revisa la ruta y el nombre exacto del
  archivo en `assets/images/` y en `js/memories.js`.
- Si **un modelo no carga**, revisa `assets/models/` y el `file` de
  `js/modelPositions.js`; la consola indica qué archivo falló.
- Si la **música no suena**, asegúrate de haber pulsado **ENTRAR** y de que
  `assets/audio/music.mp3` existe.

---

## Cómo publicar en GitHub Pages

Love in Space se publica como sitio estático, sin compilación. Pasos:

1. **Crea o usa un repositorio** en GitHub.
2. **Sube todo el proyecto**: la carpeta `Love-in-Space/` con `index.html`, las
   carpetas `css/`, `js/`, `assets/` y el archivo `.nojekyll`. Sube también tus
   fotos, vídeos, la música (`assets/audio/music.mp3`) y los modelos `.glb`.
   Asegúrate de que el `music.mp3` real esté incluido.
3. **Revisa rutas y mayúsculas**: las rutas son relativas, así que deben coincidir
   exactamente con los nombres de los archivos (en Linux, las mayúsculas
   importan).
4. **Configura GitHub Pages**: en el repositorio, entra en **Settings → Pages**,
   elige *Deploy from a branch*, selecciona la rama (por ejemplo `main`) y la
   carpeta raíz (`/`). Si tu `index.html` está en la raíz del repositorio, esta es
   la opción correcta.
5. **Espera** a que GitHub termine el despliegue (verás un aviso con la URL del
   sitio).
6. **Abre la web publicada** y comprueba: el botón **ENTRAR**, la música, las
   fotos, los vídeos, los modelos y la navegación.
7. Cuando hagas cambios, **vuelve a subirlos** al repositorio; GitHub Pages se
   actualizará solo.

### Raíz del dominio frente a subcarpeta del proyecto

- Si publicas un repositorio cuyo sitio queda en
  `https://usuario.github.io/`, el `index.html` está en la raíz del dominio.
- Si publicas un **sitio de proyecto** (por ejemplo
  `https://usuario.github.io/mi-repositorio/`), la web vive en una **subcarpeta**.
  Gracias a que todas las rutas del proyecto son **relativas**, funciona igual en
  ambos casos, siempre que el `index.html` quede en la raíz de la carpeta
  publicada.

> Este repositorio **no** incluye una URL pública ni se declara desplegado: los
> pasos anteriores describen cómo publicar tu propia copia. Ajusta la rama y la
> carpeta según dónde hayas colocado `index.html`.

---

## Solución de problemas y mantenimiento

- **Una foto o un vídeo no aparecen.** Revisa la ruta y el nombre exacto en
  `js/memories.js` y que el archivo exista en `assets/images/`. Verás un aviso en
  la consola del navegador indicando la ruta que falló. Recuerda que las
  mayúsculas cuentan.
- **Un vídeo no se reproduce o no se repite.** Comprueba que el formato sea
  `.mp4` (H.264) o `.webm`. Algunos códecs no funcionan en todos los dispositivos.
  Recuerda que los vídeos se pausan al alejarte; acércate para que se reproduzcan.
- **La música no empieza.** Debe arrancar solo **después** de pulsar **ENTRAR**.
  Comprueba que `assets/audio/music.mp3` existe y que la ruta en `js/audio.js` es
  correcta. Si pausaste con el botón de música, vuelve a pulsarlo.
- **Un modelo `.glb` falta o está mal orientado.** Verifica que el archivo está en
  `assets/models/` y que el `file` de `js/modelPositions.js` coincide. Si mira al
  lado contrario, añade `orientationFix: 180` a su entrada; si es demasiado grande
  o pequeño, ajusta `scale`.
- **Una leyenda o una nota no se leen.** Cambia su `textStyle` por otro de
  `js/cardStyles.js`, o fija un `textColor` con buen contraste. Para las leyendas,
  ten en cuenta el color del marco.
- **Algo funciona en local pero no en GitHub Pages.** Casi siempre es un problema
  de **mayúsculas** o de un archivo **no subido** (por ejemplo, la música). Comprueba
  que `.nojekyll` está incluido y que todas las rutas son relativas.
- **La escena va lenta en un ordenador o móvil.** Reduce el número y la resolución
  de los vídeos, usa menos modelos y baja la calidad de las imágenes. El proyecto
  ya optimiza el render en móviles y solo reproduce los vídeos cercanos.

Evita borrar carpetas o dependencias del proyecto para "arreglar" algo: casi
todos los problemas vienen de rutas, nombres o formatos de archivo.

---

## Flujo de personalización y contribución

Un flujo seguro para dar tu toque personal:

1. **Haz una copia de seguridad** del proyecto o crea un *commit* en Git antes de
   empezar, para poder volver atrás.
2. **Añade o sustituye tus archivos** de imagen, vídeo, audio y modelos en
   `assets/`.
3. **Edita las entradas** correspondientes en `js/memories.js` (fotos, vídeos y
   notas) y, si añades modelos, en `js/modelPositions.js`.
4. **Prueba en local** con un servidor estático y revisa la consola del navegador.
5. **Comprueba en ordenador y en móvil** siempre que puedas.
6. **Publica** los cambios en GitHub (y espera a que Pages se actualice).

### Licencia y atribuciones

Este repositorio **no incluye un archivo de licencia propio**; si vas a
publicarlo, decide tú qué licencia quieres aplicar. Ten en cuenta los recursos de
terceros:

- **Three.js** se redistribuye bajo su propia licencia (MIT).
- Las **tipografías** provienen de Google Fonts y tienen sus licencias
  correspondientes.
- Los **modelos 3D** tienen licencias distintas: consulta la lista de
  atribuciones de `assets/models/README.md` y respeta los créditos que cada autor
  exija.
- Los personajes de marcas o series (por ejemplo, **BT21**) pertenecen a sus
  respectivos propietarios; úsalos solo si tienes derecho a ello.

---

Hecho con cariño para regalar un pequeño universo. Personalízalo, cámbialo y
hazlo tuyo.
