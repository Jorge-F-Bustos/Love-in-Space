# Love in Space — Nuestro pequeño universo

**Love in Space** es un universo 3D navegable ambientado en el espacio, pensado
para dedicárselo a alguien especial. Reúne fotografías, vídeos, mensajes
románticos, personajes 3D y música de fondo en una escena que se recorre en
primera persona.

Está hecho con **Three.js** y **módulos JavaScript nativos**, sin backend ni
proceso de compilación: es un sitio estático que puede publicarse tal cual en
GitHub Pages. Toda la personalización se hace editando unos pocos archivos y
sustituyendo tus propias fotos, vídeos, música y modelos `.glb`.

---

## Índice

- [Sobre el proyecto](#sobre-el-proyecto)
- [Características](#características)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Cómo personalizarlo](#cómo-personalizarlo)
- [Cómo usar la experiencia](#cómo-usar-la-experiencia)
- [Requisitos y ejecución local](#requisitos-y-ejecución-local)
- [Recursos de terceros](#recursos-de-terceros)

---

## Sobre el proyecto

Al abrir la página aparece una pantalla de carga y después una portada con el
botón **ENTRAR**. Al pulsarlo comienzas flotando en un pequeño universo: un
**corazón central** rodeado de planetas, estrellas, flores y personajes.
Repartidos por el espacio hay **marcos con fotos y vídeos** y **cartas con
mensajes** que puedes contemplar de cerca, mientras suena una canción que puedes
pausar cuando quieras.

Puedes reutilizar este repositorio para crear **tu propio universo**: cambia las
fotos, los textos, los colores y la música, y tendrás una experiencia distinta
sobre la misma base.

---

## Características

- **Entorno 3D interactivo** con cámara en primera persona (Three.js).
- **Escenario navegable**: teclado y ratón en PC, joystick y toque en móvil.
- **Fotografías y vídeos** en marcos 3D que se adaptan a la proporción real de
  cada archivo.
- **Leyenda individual** por medio, con su propia tipografía y color.
- **Notas y cartas románticas** editables, con varias formas y estilos.
- **Modelos 3D `.glb`** (incluidos los personajes **BT21**), letras y
  decoraciones.
- **Corazón central** con elementos orbitando y una **memoria especial** que
  flota sobre él.
- **Música de fondo**: empieza al pulsar **ENTRAR**, se repite en bucle y se
  pausa o reanuda con el botón de música.
- **Diseño adaptable** a ordenador y a dispositivos móviles.

---

## Estructura del proyecto

```
Love-in-Space/
├── index.html            Página principal: carga los estilos y js/main.js
├── .nojekyll             Evita que GitHub Pages procese los archivos con Jekyll
├── css/
│   ├── style.css         Estilos de la interfaz (portada, HUD, controles táctiles)
│   └── overrides.css     Ajustes del botón de música y los botones verticales
├── js/
│   ├── main.js           Punto de entrada: monta la escena y arranca todo
│   ├── memories.js       Definición de todas las memorias (fotos, vídeos, notas)
│   ├── cardStyles.js     Tipografías y colores del texto de las cartas
│   ├── modelPositions.js Posición, rotación y escala de cada modelo 3D
│   ├── memoryObjects.js  Construye marcos, cartas, leyendas y textos
│   ├── media.js          Detecta imagen o vídeo y adapta el marco a su tamaño
│   ├── characters.js     Carga y anima los modelos .glb
│   ├── letters.js        Letras 3D y sus corazones en órbita
│   ├── world.js          Corazón central, órbita y memoria especial central
│   ├── decorations.js    Corazones, estrellas, lunas, flores, sobres...
│   ├── scene.js          Escena, cámara, luces, fondo y nebulosas
│   ├── controls.js       Controles en primera persona (WASD, mirar, límites)
│   ├── interactions.js   Clic/toque sobre las memorias y controles táctiles
│   ├── audio.js          Música de fondo y su botón de pausa
│   ├── intro.js          Pantalla de carga, portada y botón ENTRAR
│   ├── particles.js      Partículas flotantes del ambiente
│   └── spatial.js        Reparte las posiciones de la escena por el mundo
├── assets/
│   ├── images/           Fotos (.png/.jpg), vídeos (.mp4) y la foto central
│   ├── audio/            La música de fondo (music.mp3)
│   └── models/           Modelos 3D (.glb) usados por la escena
└── _snapshot/            Copias antiguas (.bak): no se usan
```

Los archivos que tocarás casi siempre son **`js/memories.js`** (fotos, vídeos y
notas), **`js/cardStyles.js`** (tipografías y colores del texto),
**`js/modelPositions.js`** (colocación de modelos), **`js/world.js`** (foto
central) y la carpeta **`assets/`** (tus recursos).

> Las rutas son **relativas** (`assets/...`, `js/...`, `css/...`), así que
> funcionan igual en la raíz del dominio o dentro de una subcarpeta de GitHub
> Pages.

---

## Cómo personalizarlo

### Fotos y vídeos

Se guardan en `assets/images/` y se describen en `js/memories.js`, en la sección
**FOTOS**. Cada entrada es una memoria y se ve así:

```js
{ id:'memory-1', type:'photo', image:'assets/images/photo01.png', caption:'Nuestro día ♡', position:{x:-8,y:5,z:-7}, rotation:{x:.08,y:.25,z:-.05}, frame:'polaroid', textStyle:'leyenda-ciruela' },
```

- **`id`**: identificador **único** (no repitas ninguno).
- **`image`** o **`video`**: ruta del archivo empezando por `assets/images/`.
  El tipo de vídeo (`mp4`, `webm`, `mov`, `m4v`, `ogv`, `ogg`) se detecta por la
  extensión; puedes forzarlo con `mediaType:'video'` o `mediaType:'image'`.
- **`position`** y **`rotation`**: dónde se coloca el marco (unidades del mundo
  3D, no píxeles).
- **`frame`**: estilo del marco (`'polaroid'`, `'pink'`, `'cosmic'` o
  `'heart'`).

Los vídeos se reproducen **en bucle, sin sonido** y solo mientras te acercas a
ellos. Para **cambiar una foto**, sustituye el archivo manteniendo el mismo
nombre o edita su ruta en `image`.

### Leyendas (pies de foto)

La leyenda se define con el campo **`caption`** dentro de la propia entrada de
`js/memories.js` (usa `\n` para saltos de línea). Su aspecto se controla así:

- **`textStyle`**: tipografía y color base. Los estilos están en
  `js/cardStyles.js`, en `CARD_STYLES` (por ejemplo `leyenda-ciruela`,
  `leyenda-vino`, `leyenda-crema`, `leyenda-rosa`, `leyenda-lila`,
  `leyenda-champan`). Si no indicas ninguno, el color se elige según el marco.
- **`textColor`**, **`textScale`** y **`textAlign`**: color, tamaño y alineación
  de una leyenda concreta.

### Notas y cartas románticas

Son memorias de tipo **`'note'`** y viven en `js/memories.js`, en la sección
**NOTAS**:

```js
{ id:'memory-36', type:'note', title:'Para mi amorcito ♡', text:'Eres mi persona favorita en todo el universo.', position:{x:-5,y:-3,z:-11}, rotation:{x:0,y:.18,z:-.04}, style:'love-letter', glow:true, textStyle:'serif-poetica' },
```

- **`title`** y **`text`**: título (opcional) y mensaje de la carta.
- **`style`**: forma de la carta (`'love-letter'`, `'cloud-note'`,
  `'star-note'`, `'envelope'`, `'diary-page'`, `'postcard'` o `'heart-card'`).
- **`textStyle`**: tipografía y color (nombres de `CARD_STYLES`).
- Opcionales: `glow`, `glowColor`, `textColor`, `textScale`, `textAlign`.

Para cambiar solo un mensaje, edita `title` o `text` y deja el resto igual.

### Modelos 3D (.glb)

Descarga los modelos desde [Sketchfab](https://sketchfab.com/) en formato `.glb`
(comprobando su licencia), colócalos en `assets/models/` y regístralos en
`js/modelPositions.js`, dentro del objeto `MODEL_POSITIONS`:

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

- **`group`**: `'heart'` cuelga el modelo del corazón (comparte su vaivén);
  `'world'` lo deja fijo en el mundo.
- **`type`**: `'floating'`, `'sway'`, `'static'` o `'existing'`.
- **`position`** y **`rotation`** (en **grados**) y **`scale`** (multiplicador
  del tamaño original del `.glb`). Usa `orientationFix: 180` si un modelo mira
  al lado contrario.
- **`color`** (opcional): añade una luz suave del color indicado.

### Colores y aspecto visual

No hay un único archivo de estilo; según lo que quieras cambiar:

- **Fondo, niebla y luces**: `js/scene.js`.
- **Decoraciones** (corazones, estrellas, flores, sobres...): `js/decorations.js`.
- **Colores de marcos**: `js/memoryObjects.js`, objeto `frameColors`.
- **Color del corazón y sus elementos**: `js/world.js`.
- **Tipografías y tintas del texto**: `js/cardStyles.js` (`CARD_STYLES`,
  `CARD_INKS`, `CAPTION_INK_BY_FRAME`).
- **Interfaz (portada, HUD, botón de música, joystick)**: `css/style.css` y
  `css/overrides.css`.

La **memoria especial que flota sobre el corazón** se cambia en `js/world.js`,
en la constante `CENTRAL_MEDIA_SRC` (por defecto
`assets/images/photo-central.jpg`); también admite un `.mp4`.

### Música (music.mp3)

La música de fondo se controla desde `js/audio.js` y el archivo debe estar en
`assets/audio/music.mp3`.

- Solo empieza cuando pulsas **ENTRAR** (respeta las restricciones de
  reproducción automática del navegador).
- Se reproduce **en bucle continuo** a un volumen suave.
- El **botón de música** (arriba a la derecha, `#music-toggle`) la pausa y la
  reanuda durante la exploración.

Para cambiar la canción, sustituye `assets/audio/music.mp3` por tu archivo con
el **mismo nombre** (o cambia la ruta en `js/audio.js`, siempre relativa). Usa
música que te pertenezca o para la que tengas autorización.

---

## Cómo usar la experiencia

### Ordenador

- **ENTRAR**: pulsa el botón de la portada para empezar.
- **Moverte**: teclas **W A S D**.
- **Subir / bajar**: **Espacio** para subir y **Shift** para bajar.
- **Mirar alrededor**: mueve el **ratón**; haz clic en la escena para activar el
  bloqueo del puntero (verás el aviso "Haz clic para mirar alrededor").
- **Contemplar una memoria**: coloca el cursor sobre una foto o carta y haz
  **clic**; aparecerá un mensaje con su título o leyenda.
- **Música**: usa el botón de música para pausarla o reanudarla.

### Móvil y pantallas táctiles

Los controles táctiles aparecen automáticamente en dispositivos táctiles:

- **Joystick** (abajo a la izquierda): moverte por la escena.
- **Arrastrar** sobre la zona de la derecha: girar la mirada.
- **Botones ↑ / ↓** (a la derecha): subir y bajar.
- **Tocar** una foto o carta: contemplarla y ver su mensaje.
- **Botón de música** (arriba a la derecha): pausar o reanudar la canción.

---

## Requisitos y ejecución local

Solo necesitas un **navegador moderno** (Chrome, Edge, Firefox o Safari). El
proyecto **no** tiene proceso de compilación ni dependencias que instalar.

Como usa **módulos ES** y un *import map* (Three.js desde CDN), conviene
servirlo con un **servidor local** en lugar de abrir `index.html` directamente.
Desde la carpeta `Love-in-Space/`, cualquiera de estas opciones vale:

```bash
# Opción 1: Vite como servidor de desarrollo (definido como dependencia de desarrollo)
npx vite --host 127.0.0.1

# Opción 2: servidor estático simple con Node
npx serve

# Opción 3: servidor integrado de Python
python -m http.server 8000
```

Abre después la URL que indique el servidor (con Vite suele ser
`http://localhost:5173`; con `serve` y Python, `http://localhost:3000` y
`http://localhost:8000`). Abrir el archivo con `file://` no funciona bien porque
el navegador bloquea los módulos y algunos recursos; un servidor local evita
esos problemas.

---

## Recursos de terceros

Algunos recursos son de terceros y conservan sus propias licencias:

- **Three.js** (MIT) se carga por CDN mediante el *import map* de `index.html`.
- Las **tipografías** provienen de Google Fonts.
- Los **modelos 3D** tienen licencias distintas: consulta las atribuciones en
  `assets/models/README.md` y respeta los créditos de cada autor.
- Los personajes de marcas o series (por ejemplo **BT21**) pertenecen a sus
  propietarios; úsalos solo si tienes derecho a ello.

---

Hecho con cariño para regalar un pequeño universo. Personalízalo y hazlo tuyo.
