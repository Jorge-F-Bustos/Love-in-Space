/**
 * ==========================================================================
 *  MODELPOSITIONS.JS — POSICIONES MANUALES DE LOS MODELOS 3D
 *  (FUENTE ÚNICA DE VERDAD: posición, rotación y escala)
 * ==========================================================================
 *
 *  Este archivo es el ÚNICO lugar donde se define la colocación de cada
 *  modelo del escenario. Si quieres mover un modelo:
 *
 *      1. Edita su `position`, `rotation` o `scale` aquí abajo.
 *      2. Guarda y recarga la página (F5). ¡Listo! Solo ese modelo cambia.
 *
 *  Cada entrada corresponde a UNA y solo una instancia en pantalla.
 *
 *  ─── COORDENADAS DEL MUNDO (no son píxeles de pantalla) ────────────────
 *  Los valores son unidades del mundo 3D: iguales en PC y en móvil y en
 *  cualquier tamaño de ventana, así que la escena nunca se "desacomoda".
 *  Significado de cada eje:
 *
 *      X → horizontal:  NEGATIVO = izquierda · POSITIVO = derecha
 *      Y → vertical:    NEGATIVO = abajo    · POSITIVO = arriba
 *      Z → profundidad: NEGATIVO = se aleja de la cámara
 *                       POSITIVO = se acerca a la cámara
 *
 *  `position` es el punto de APOYO del modelo en reposo: el centro de sus
 *  "pies" (centro inferior de su caja). Subes Y = el modelo sube; cambias
 *  X = se corre a un lado; cambias Z = se aleja o se acerca.
 *
 *  ─── CAMPOS DE CADA MODELO ─────────────────────────────────────────────
 *  • file  : archivo .glb dentro de assets/models/.
 *  • group : 'heart' = cuelga del corazón y comparte su vaivén (sube y
 *            baja con él). 'world' = queda fijo en el mundo y solo hace
 *            su propia animación.
 *  • type  : cómo se anima el modelo:
 *              'floating' — flotación vertical suave (sube y baja).
 *              'sway'     — vaivén vertical + balanceo de giro lateral.
 *              'static'   — completamente quieto, sin animación.
 *              'existing' — respeta el comportamiento original que ya
 *                           tenía este modelo (flotación si tiene
 *                           parámetros `float`; si no, sway).
 *  • rotation : orientación BASE en GRADOS (no radianes), aplicada una
 *            sola vez alrededor de los pies del modelo:
 *              x = inclinación al frente / atrás
 *              y = giro hacia la izquierda / derecha
 *              z = inclinación lateral (volteo)
 *  • scale : multiplicador final de tamaño. Es una ESCALA BASE, no un
 *            tamaño absoluto: cada .glb trae su propio tamaño original y
 *            este número lo multiplica.
 *
 *  ─── CÓMO AJUSTAR EL TAMAÑO (`scale`) ───────────────────────────────────
 *  • scale = 1  → el modelo mantiene su tamaño original del .glb.
 *  • scale > 1  → MÁS GRANDE (ej.: 2 = el doble de grande).
 *  • scale < 1  → MÁS PEQUEÑO (ej.: 0.5 = a la mitad).
 *
 *  Regla práctica: si un modelo queda gigante, bájale el número (0.5, 0.25,
 *  ...); si queda diminuto súbelo (2, 5, ...). Los modelos de la escena no
 *  tienen el mismo tamaño nativo, por eso cada uno lleva SU propio scale.
 *  En cada entrada de abajo hay un comentario en español que indica a qué
 *  altura del mundo equivale su scale actual, para que sepas qué esperar.
 *
 *  La referencia es Momonga, que mide ~1.75 unidades del mundo con scale
 *  0.494118 en su posición actual. Un personaje "normal" mide entre 1.2 y
 *  2.0; una decoración pequeña (pizza, takis) entre 0.5 y 1.1.
 *
 *  ─── CAMPOS DE CADA MODELO ─────────────────────────────────────────────
 *  • float  : solo para type 'floating':
 *              amplitude = qué tan alto/bajo llega a flotar
 *              speed     = qué tan rápido (mayor = más rápido)
 *              phase     = desde qué instante inicia (para desfasar modelos)
 *            Puedes cambiar `position` aunque el modelo siga flotando: la
 *            flotación se suma sobre la posición que escribas aquí.
 *  • sway   : solo para type 'sway':
 *              phase = instante del vaivén (evita que todos se muevan al
 *              mismo tiempo; los valores actuales están desfasados a .73).
 *  • color  : (opcional) luz suave de color que emite el modelo. Borra la
 *            línea si no quieres luz.
 *
 *  IMPORTANTE: no renombres ni borres las claves de cada modelo; solo
 *  cambia los números que necesites. La disposición inicial de este archivo
 *  reproduce exactamente la escena actual.
 */

export const MODEL_POSITIONS = {
  // ── PERSONAJES PRINCIPALES ─────────────────────────────────────────────
  momonga: {
    id: 'momonga',
    file: 'assets/models/momonga.glb',
    group: 'heart',
    type: 'floating',
    color: 0xffc3de,
    position: { x: 2.2, y: 3.25, z: 0.25 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 0.494118,
    float: { amplitude: 0.1, speed: 0.00065, phase: Math.PI }
  },
  usagi: {
    id: 'usagi',
    file: 'assets/models/Usagi.glb',
    group: 'world',
    type: 'floating',
    color: 0xc9b6ff,
    position: { x: -2.2, y: 3.25, z: 0.25 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 1,
    float: { amplitude: 0.1, speed: 0.0007, phase: 0 }
  },

  // ── HUEVITOS DE MOB (3 instancias del mismo .glb) ─────────────────────
  mobEggHead1: {
    id: 'mob-egg-head-01',
    file: 'assets/models/mob_egg_head.glb',
    group: 'heart',
    type: 'sway',
    position: { x: -11.4, y: 1.14, z: -14.82 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 0.378006,
    sway: { phase: 0 }
  },
  mobEggHead2: {
    id: 'mob-egg-head-02',
    file: 'assets/models/mob_egg_head.glb',
    group: 'heart',
    type: 'sway',
    position: { x: 12.54, y: -4.56, z: 13.68 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 0.369606,
    sway: { phase: 0.73 }
  },
  mobEggHead3: {
    id: 'mob-egg-head-03',
    file: 'assets/models/mob_egg_head.glb',
    group: 'heart',
    type: 'sway',
    position: { x: 12.96, y: 10.8, z: 16.2 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 0.386406,
    sway: { phase: 1.46 }
  },

  // ── MASCOTAS Y DECORACIONES ────────────────────────────────────────────
  chiikawa: {
    id: 'chiikawa',
    file: 'assets/models/chiikawa.glb',
    group: 'heart',
    type: 'sway',
    position: { x: -16.2, y: 5.4, z: 14.04 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 0.031696,
    sway: { phase: 2.19 }
  },
  blackCat: {
    id: 'black-cat',
    file: 'assets/models/black_cat.glb',
    group: 'heart',
    type: 'sway',
    position: { x: 18.24, y: 4.56, z: -9.12 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 11.674479,
    sway: { phase: 2.92 }
  },

  // ── FANTASMAS (2 instancias del mismo .glb) ───────────────────────────
  ghost1: {
    id: 'stylized-ghost-01',
    file: 'assets/models/stylized_ghost.glb',
    group: 'heart',
    type: 'sway',
    position: { x: -15.96, y: -3.42, z: 10.26 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 0.250745,
    sway: { phase: 3.65 }
  },
  ghost2: {
    id: 'stylized-ghost-02',
    file: 'assets/models/stylized_ghost.glb',
    group: 'heart',
    type: 'sway',
    position: { x: 16.2, y: 8.64, z: 12.96 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 0.238514,
    sway: { phase: 4.38 }
  },

  // ── CALABAZAS (3 instancias del mismo .glb) ───────────────────────────
  pumpkin1: {
    id: 'pumpkin-01',
    file: 'assets/models/halloween_pumpkin_low_poly.glb',
    group: 'heart',
    type: 'sway',
    position: { x: -14.82, y: -6.84, z: -9.12 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 0.31,
    sway: { phase: 5.11 }
  },
  pumpkin2: {
    id: 'pumpkin-02',
    file: 'assets/models/halloween_pumpkin_low_poly.glb',
    group: 'heart',
    type: 'sway',
    position: { x: 14.82, y: -5.7, z: 11.4 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 0.28,
    sway: { phase: 5.84 }
  },
  pumpkin3: {
    id: 'pumpkin-03',
    file: 'assets/models/halloween_pumpkin_low_poly.glb',
    group: 'heart',
    type: 'sway',
    position: { x: -11.4, y: 9.12, z: 11.4 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 0.3,
    sway: { phase: 6.57 }
  },

  // ── LAZOS (5 instancias del mismo .glb) ───────────────────────────────
  ribbon1: {
    id: 'ribbon-01',
    file: 'assets/models/ribbon_2.glb',
    group: 'heart',
    type: 'sway',
    position: { x: -10.26, y: 4.56, z: 10.26 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 0.164448,
    sway: { phase: 7.3 }
  },
  ribbon2: {
    id: 'ribbon-02',
    file: 'assets/models/ribbon_2.glb',
    group: 'heart',
    type: 'sway',
    position: { x: 10.26, y: 3.42, z: 11.4 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 0.150353,
    sway: { phase: 8.03 }
  },
  ribbon3: {
    id: 'ribbon-03',
    file: 'assets/models/ribbon_2.glb',
    group: 'heart',
    type: 'sway',
    position: { x: -14.82, y: 7.98, z: 13.68 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 0.178544,
    sway: { phase: 8.76 }
  },
  ribbon4: {
    id: 'ribbon-04',
    file: 'assets/models/ribbon_2.glb',
    group: 'heart',
    type: 'sway',
    position: { x: 14.82, y: -7.98, z: 13.68 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 0.164448,
    sway: { phase: 9.49 }
  },
  ribbon5: {
    id: 'ribbon-05',
    file: 'assets/models/ribbon_2.glb',
    group: 'heart',
    type: 'sway',
    position: { x: 2.28, y: 12.54, z: 15.96 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 0.145654,
    sway: { phase: 10.22 }
  },

  // ── GATITOS SPOOKY (2 instancias del mismo .glb) ──────────────────────
  spookyCat1: {
    id: 'spooky-cat-01',
    file: 'assets/models/cute_spooky_cat.glb',
    group: 'heart',
    type: 'sway',
    position: { x: -14.82, y: -9.12, z: 5.7 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 1.04732,
    sway: { phase: 10.95 }
  },
  spookyCat2: {
    id: 'spooky-cat-02',
    file: 'assets/models/cute_spooky_cat.glb',
    group: 'heart',
    type: 'sway',
    position: { x: 15.96, y: 2.28, z: 12.54 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 1.04732,
    sway: { phase: 11.68 }
  },

  // ── GATITOS TIERNOS ────────────────────────────────────────────────────
  cuteCatAssignment: {
    id: 'cute-cat-assignment',
    file: 'assets/models/cute_cat_assignment.glb',
    group: 'heart',
    type: 'sway',
    position: { x: -9.12, y: -6.84, z: 13.68 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 0.295463,
    sway: { phase: 12.41 }
  },
  cuteCatModel: {
    id: 'cute-cat-model',
    file: 'assets/models/cute_cat_model.glb',
    group: 'heart',
    type: 'sway',
    position: { x: -8.2, y: -6.84, z: 13.68 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 0.129301,
    sway: { phase: 13.14 }
  },

  // ── VIAJEROS / MASCOTAS INDEPENDIENTES (group: world) ─────────────────
  trader: {
    id: 'trader',
    file: 'assets/models/trader.glb',
    group: 'world',
    type: 'floating',
    position: { x: 1.075071, y: -203.174152, z: 0.227338 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 0.008673,
    float: { amplitude: 0.06, speed: 0.00055, phase: 2.4 }
  },
  bunny: {
    id: 'bunny2',
    file: 'assets/models/bunny2.glb',
    group: 'world',
    type: 'floating',
    position: { x: 20, y: 0, z: 5 },
    rotation: { x: 0, y: -180, z: 0 },
    scale: 0.872369,
    float: { amplitude: 0.05, speed: 0.0005, phase: 4.1 }
  },
  minecraft: {
    id: 'minecraft',
    file: 'assets/models/minecraft.glb',
    group: 'world',
    type: 'floating',
    position: { x: 0, y: -3.648366, z: 0.235 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 0.98258,
    float: { amplitude: 0.06, speed: 0.00055, phase: 3.1 }
  },

  // ── LETRAS 3D «J» Y «V» (rodean a `minecraft`) ─────────────────────────
  // Se colocan con el MISMO sistema de configuración que los modelos .glb
  // (misma posición/rotación/escala/animación), pero no cargan ningún .glb:
  // su geometría se genera a mano (letras extruidas) en js/letters.js.
  //   • primitive: 'letter' → letters.js las construye en vez de un .glb.
  //   • glyph     → la letra que se dibuja.
  //   • orbitHearts → corazones 3D pequeños que giran alrededor de la letra.
  // Desde el punto de vista inicial (cámara mirando hacia -Z) se leen como
  // «J  minecraft  V»: la J queda a la IZQUIERDA (-X) y la V a la DERECHA (+X).
  letterJ: {
    id: 'letterJ',
    primitive: 'letter',
    glyph: 'J',
    group: 'world',
    type: 'floating',
    position: { x: -1.7, y: -3.648366, z: 0.235 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 1.7,
    float: { amplitude: 0.06, speed: 0.00055, phase: 2.2 },
    orbitHearts: { count: 3, radius: 1.15, verticalRadius: 0.35, speed: 0.5, size: 0.12, color: 0xff9ec6 },
    color: 0xff9ec6
  },
  letterV: {
    id: 'letterV',
    primitive: 'letter',
    glyph: 'V',
    group: 'world',
    type: 'floating',
    position: { x: 1.7, y: -3.648366, z: 0.235 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 1.7,
    float: { amplitude: 0.06, speed: 0.00055, phase: 3.9 },
    orbitHearts: { count: 3, radius: 1.15, verticalRadius: 0.35, speed: 0.5, size: 0.12, color: 0xbda8ff },
    color: 0xbda8ff
  },

  // ══════════════════ NUEVA FASE: PERSONAJES Y DESCUBRIMIENTOS ═══════════════════

  // ── CAINE (1) ──────────────────────────────────────────────────────────
  // scale 1.0 → altura final ≈ 1.61 (casi como Momonga, 1.75).
  caine: {
    id: 'caine',
    file: 'assets/models/caine.glb',
    group: 'world',
    type: 'floating',
    position: { x: -17, y: 5, z: -20 },
    rotation: { x: 0, y: 20, z: 0 },
    scale: 1.0,
    float: { amplitude: 0.07, speed: 0.0007, phase: 0.5 }
  },

  // ── POMNI (1) ──────────────────────────────────────────────────────────
  // scale 2.0 → altura final ≈ 1.58 (el .glb nativo es pequeñito, 0.79).
  // Modelo esquelético animado: se clona con su esqueleto para flotar bien.
  pomni: {
    id: 'pomni',
    file: 'assets/models/pomni.glb',
    group: 'world',
    type: 'floating',
    position: { x: 20, y: 8, z: -21 },
    rotation: { x: 0, y: -15, z: 0 },
    scale: 2.0,
    float: { amplitude: 0.08, speed: 0.0007, phase: 1.2 }
  },

  // ── LOWPOLY JAX (1) ────────────────────────────────────────────────────
  // scale 0.65 → altura final ≈ 1.52 (nativo 2.34, se reduce un poco).
  lowpolyjax: {
    id: 'lowpolyjax',
    file: 'assets/models/lowpolyjax.glb',
    group: 'world',
    type: 'floating',
    position: { x: 12, y: 5, z: 21 },
    rotation: { x: 0, y: 25, z: 0 },
    scale: 0.65,
    float: { amplitude: 0.06, speed: 0.0006, phase: 2.4 }
  },

  // ── PIZZAS (10 instancias del mismo .glb) ──────────────────────────────
  // scale ~0.24-0.34 → altura final ≈ 0.52-0.73 (decoración pequeña, no
  // tapa la foto cercana). Cada pizza tiene SU scale para variar de tamaño.
  pizza1: {
    id: 'pizza1',
    file: 'assets/models/pizza.glb',
    group: 'world',
    type: 'sway',
    position: { x: 11.5, y: 0.5, z: -6 },
    rotation: { x: 0, y: 25, z: 0 },
    scale: 0.30,
    sway: { phase: 13.87 }
  },
  pizza2: {
    id: 'pizza2',
    file: 'assets/models/pizza.glb',
    group: 'world',
    type: 'sway',
    position: { x: -13, y: 4, z: -4 },
    rotation: { x: 0, y: -20, z: 0 },
    scale: 0.26,
    sway: { phase: 14.6 }
  },
  pizza3: {
    id: 'pizza3',
    file: 'assets/models/pizza.glb',
    group: 'world',
    type: 'sway',
    position: { x: -22, y: -8, z: -14 },
    rotation: { x: 0, y: 40, z: 0 },
    scale: 0.34,
    sway: { phase: 15.33 }
  },
  pizza4: {
    id: 'pizza4',
    file: 'assets/models/pizza.glb',
    group: 'world',
    type: 'sway',
    position: { x: -10, y: 1.5, z: 23 },
    rotation: { x: 0, y: 15, z: 0 },
    scale: 0.24,
    sway: { phase: 16.06 }
  },
  pizza5: {
    id: 'pizza5',
    file: 'assets/models/pizza.glb',
    group: 'world',
    type: 'sway',
    position: { x: 5, y: 2, z: 29 },
    rotation: { x: 0, y: -35, z: 0 },
    scale: 0.28,
    sway: { phase: 16.79 }
  },
  pizza6: {
    id: 'pizza6',
    file: 'assets/models/pizza.glb',
    group: 'world',
    type: 'sway',
    position: { x: 14, y: 4, z: 24 },
    rotation: { x: 0, y: 30, z: 0 },
    scale: 0.32,
    sway: { phase: 17.52 }
  },
  pizza7: {
    id: 'pizza7',
    file: 'assets/models/pizza.glb',
    group: 'world',
    type: 'sway',
    position: { x: -12, y: 13, z: -16 },
    rotation: { x: 0, y: -10, z: 0 },
    scale: 0.25,
    sway: { phase: 18.25 }
  },
  pizza8: {
    id: 'pizza8',
    file: 'assets/models/pizza.glb',
    group: 'world',
    type: 'sway',
    position: { x: 27, y: -6, z: -11 },
    rotation: { x: 0, y: 5, z: 0 },
    scale: 0.29,
    sway: { phase: 18.98 }
  },
  pizza9: {
    id: 'pizza9',
    file: 'assets/models/pizza.glb',
    group: 'world',
    type: 'sway',
    position: { x: 12, y: -12, z: -22 },
    rotation: { x: 0, y: -45, z: 0 },
    scale: 0.27,
    sway: { phase: 19.71 }
  },
  pizza10: {
    id: 'pizza10',
    file: 'assets/models/pizza.glb',
    group: 'world',
    type: 'sway',
    position: { x: 17, y: -8, z: -8 },
    rotation: { x: 0, y: 60, z: 0 },
    scale: 0.31,
    sway: { phase: 20.44 }
  },

  // ── TAKIS (5 instancias del mismo .glb) ────────────────────────────────
  // scale ~0.40-0.48 → altura final ≈ 0.88-1.06 (aperitivo pequeño).
  takis1: {
    id: 'takis1',
    file: 'assets/models/takis.glb',
    group: 'world',
    type: 'sway',
    position: { x: -8, y: -6, z: -15 },
    rotation: { x: 0, y: 20, z: 0 },
    scale: 0.40,
    sway: { phase: 21.17 }
  },
  takis2: {
    id: 'takis2',
    file: 'assets/models/takis.glb',
    group: 'world',
    type: 'sway',
    position: { x: 6, y: 12, z: -14 },
    rotation: { x: 0, y: -15, z: 0 },
    scale: 0.46,
    sway: { phase: 21.9 }
  },
  takis3: {
    id: 'takis3',
    file: 'assets/models/takis.glb',
    group: 'world',
    type: 'sway',
    position: { x: -9, y: -4, z: 19 },
    rotation: { x: 0, y: 45, z: 0 },
    scale: 0.42,
    sway: { phase: 22.63 }
  },
  takis4: {
    id: 'takis4',
    file: 'assets/models/takis.glb',
    group: 'world',
    type: 'sway',
    position: { x: -26, y: -4, z: -6 },
    rotation: { x: 0, y: -25, z: 0 },
    scale: 0.48,
    sway: { phase: 23.36 }
  },
  takis5: {
    id: 'takis5',
    file: 'assets/models/takis.glb',
    group: 'world',
    type: 'sway',
    position: { x: 17, y: -4, z: 29 },
    rotation: { x: 0, y: 10, z: 0 },
    scale: 0.44,
    sway: { phase: 24.09 }
  },

  // ── OMORI (1) ──────────────────────────────────────────────────────────
  // scale 400 → altura final ≈ 1.36. Su .glb nativo está a escala casi
  // microscópica (0.0034); se amplía hasta tamaño de personaje.
  omori: {
    id: 'omori',
    file: 'assets/models/omori.glb',
    group: 'world',
    type: 'floating',
    position: { x: 15, y: -4, z: 10 },
    rotation: { x: 0, y: -100, z: 0 },
    scale: 400,
    float: { amplitude: 0.05, speed: 0.0005, phase: 3.0 }
  },

  // ── CONEJITO TIERNO (3 instancias) ─────────────────────────────────────
  // Usan `cutebunny.glb` (el mismo archivo que la entrada `cutebunny`).
  // scale ~0.46-0.52 → altura final ≈ 0.92-1.04 (conejito pequeño).
  // Modelo esquelético animado: se clona con su esqueleto.
  cuteBunny1: {
    id: 'cuteBunny1',
    file: 'assets/models/cutebunny.glb',
    group: 'world',
    type: 'floating',
    position: { x: -9, y: 1.5, z: 12 },
    rotation: { x: 0, y: -10, z: 0 },
    scale: 0.46,
    float: { amplitude: 0.04, speed: 0.0005, phase: 4.2 }
  },
  cuteBunny2: {
    id: 'cuteBunny2',
    file: 'assets/models/cutebunny.glb',
    group: 'world',
    type: 'floating',
    position: { x: 8, y: 6, z: 27 },
    rotation: { x: 0, y: 20, z: 0 },
    scale: 0.52,
    float: { amplitude: 0.04, speed: 0.0005, phase: 5.3 }
  },
  cuteBunny3: {
    id: 'cuteBunny3',
    file: 'assets/models/cutebunny.glb',
    group: 'world',
    type: 'floating',
    position: { x: 1, y: 7, z: 32 },
    rotation: { x: 0, y: -5, z: 0 },
    scale: 0.48,
    float: { amplitude: 0.04, speed: 0.0005, phase: 6.1 }
  },

  // ── ROBLOX BACON BOY (1) ───────────────────────────────────────────────
  // scale 26 → altura final ≈ 1.45. Su .glb nativo está a escala diminuta
  // (0.056); se amplía hasta tamaño de personaje. Esqueleto animado.
  robloxBaconBoy: {
    id: 'robloxBaconBoy',
    file: 'assets/models/roblox-bacon-boy.glb',
    group: 'world',
    type: 'floating',
    position: { x: 19.8, y: 6, z: 12 },
    rotation: { x: 0, y: -100, z: 0 },
    scale: 26,
    float: { amplitude: 0.06, speed: 0.0006, phase: 3.7 }
  },

  // ── ROBLOX BACON GIRL (1) ──────────────────────────────────────────────
  // scale 0.28 → altura final ≈ 1.68 (nativo 6.0 de alto, se reduce).
  // `orientationFix: 180` corrige la orientación: este .glb está exportado
  // mirando hacia atrás (su cara queda del lado -Z), al revés que el resto
  // de personajes. Con +180° la cara mira hacia +Z (hacia la cámara).
  robloxBaconGirl: {
    id: 'robloxBaconGirl',
    file: 'assets/models/roblox-bacon-girl.glb',
    group: 'world',
    type: 'floating',
    position: { x: 12.9, y: 6, z: 13 },
    rotation: { x: 0, y: -100, z: 0 },
    orientationFix: 180,
    scale: 0.28,
    float: { amplitude: 0.07, speed: 0.0006, phase: 4.3 }
  },

  // ── ROBLOX NOOB (1) ────────────────────────────────────────────────────
  // scale 0.32 → altura final ≈ 1.63 (nativo 5.1 de alto, se reduce).
  robloxNoob: {
    id: 'robloxNoob',
    file: 'assets/models/roblox-noob.glb',
    group: 'world',
    type: 'floating',
    position: { x: -24, y: 16, z: -15 },
    rotation: { x: 0, y: 5, z: 0 },
    scale: 0.32,
    float: { amplitude: 0.06, speed: 0.0005, phase: 5.0 }
  },

  // ── CUTEBUNNY (1) ──────────────────────────────────────────────────────
  // scale 0.85 → altura final ≈ 1.24 (conejito pequeño-mediano).
  cutebunny: {
    id: 'cutebunny',
    file: 'assets/models/cutebunny.glb',
    group: 'world',
    type: 'floating',
    position: { x: -11, y: 2, z: -21 },
    rotation: { x: 0, y: -35, z: 0 },
    scale: 0.85,
    float: { amplitude: 0.05, speed: 0.0005, phase: 5.6 }
  },

  // ══════════════════ BT21: PERSONAJES DE LINE FRIENDS ══════════════════
  // Los 7 personajes BT21 (chimmy, koya, mang, rj, shooky, tata y van) se
  // colocan cada uno en un hueco vacío distinto del universo, mirando todos
  // hacia el corazón central. Cada uno tiene SU propia entrada: puedes
  // moverlos, girarlos o cambiarles el tamaño aquí sin tocar el cargador.
  //
  //  • `scale` está calculado para que la ALTURA FINAL de cada personaje
  //    sea ≈1.75 unidades del mundo: el mismo tamaño aparente que Momonga.
  //    Si quieres otro tamaño, cámbialo (p. ej. 1.2 = 20% más grande).
  //  • `rotation.y` está calculado (grados) para que cada uno mire hacia el
  //    centro del universo (la posición 0,0,0 del corazón gigante). Si un
  //    personaje se viera quedando de espaldas, usa `orientationFix: 180`
  //    en SU entrada para darle la vuelta sin cambiar su posición.
  //  • `position` es el punto de apoyo de sus "pies" en coordenadas de mundo.
  //  • `type: 'floating'` les da la misma flotación suave que a Momonga;
  //    si prefieres dejarlos quietos cambia a `type: 'static'`.

  bt21Chimmy: {
    id: 'bt21-chimmy',
    file: 'assets/models/bt21_chimmy.glb',
    group: 'world',
    type: 'floating',
    color: 0xffe29c,
    position: { x: 15, y: 0, z: -23 },
    rotation: { x: 0, y: -33, z: 0 },
    orientationFix: 0,
    scale: 1.0,
    float: { amplitude: 0.1, speed: 0.00065, phase: 0.6 }
  },
  bt21Koya: {
    id: 'bt21-koya',
    file: 'assets/models/bt21_koya.glb',
    group: 'world',
    type: 'floating',
    color: 0xbda8ff,
    position: { x: -19, y: -3, z: -27 },
    rotation: { x: 0, y: 35, z: 0 },
    orientationFix: 0,
    scale: 1.12,
    float: { amplitude: 0.1, speed: 0.00065, phase: 1.4 }
  },
  bt21Mang: {
    id: 'bt21-mang',
    file: 'assets/models/bt21_mang.glb',
    group: 'world',
    type: 'floating',
    color: 0xa0e6e6,
    position: { x: 0, y: 15, z: -29 },
    rotation: { x: 0, y: 0, z: 0 },
    orientationFix: 0,
    scale: 1.75,
    float: { amplitude: 0.1, speed: 0.00065, phase: 2.2 }
  },
  bt21Rj: {
    id: 'bt21-rj',
    file: 'assets/models/bt21_rj.glb',
    group: 'world',
    type: 'floating',
    color: 0xffe8cc,
    position: { x: 14, y: 13, z: -6 },
    rotation: { x: 0, y: -67, z: 0 },
    orientationFix: 0,
    scale: 0.65,
    float: { amplitude: 0.1, speed: 0.00065, phase: 3.0 }
  },
  bt21Shooky: {
    id: 'bt21-shooky',
    file: 'assets/models/bt21_shooky.glb',
    group: 'world',
    type: 'floating',
    color: 0xffc9a0,
    position: { x: -25, y: -11, z: -3 },
    rotation: { x: 0, y: 83, z: 0 },
    orientationFix: 0,
    scale: 1.57,
    float: { amplitude: 0.1, speed: 0.00065, phase: 3.8 }
  },
  bt21Tata: {
    id: 'bt21-tata',
    file: 'assets/models/bt21_tata.glb',
    group: 'world',
    type: 'floating',
    color: 0xffb3cf,
    position: { x: -9, y: 15, z: -6 },
    rotation: { x: 0, y: 56, z: 0 },
    orientationFix: 0,
    scale: 1.22,
    float: { amplitude: 0.1, speed: 0.00065, phase: 4.6 }
  },
  bt21Van: {
    id: 'bt21-van',
    file: 'assets/models/bt21_van.glb',
    group: 'world',
    type: 'floating',
    color: 0xaac8f0,
    position: { x: 27, y: -3, z: -2 },
    rotation: { x: 0, y: -86, z: 0 },
    orientationFix: 0,
    scale: 0.89,
    float: { amplitude: 0.1, speed: 0.00065, phase: 5.4 }
  }
};
