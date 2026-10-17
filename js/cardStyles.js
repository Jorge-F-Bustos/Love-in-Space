// ==========================================================================
//  CARDSTYLES.JS — ESTILOS DE TEXTO Y PALETAS DE TINTA PARA LAS CARTAS
// --------------------------------------------------------------------------
//  Fuente única de verdad para la TIPOGRAFÍA y el COLOR del texto de cada
//  carta de memoria. memoryObjects.js solo dibuja; aquí se decide cómo se ve.
//
//  Cada estilo define:
//    • font         : familia tipográfica (con respaldos seguros).
//    • weight       : grosor (100-900).
//    • italic       : cursiva suave.
//    • sizeScale    : multiplica el tamaño base del texto.
//    • lineHeight   : separación entre líneas.
//    • align        : 'center' | 'left' | 'right'.
//    • letterSpacing: separación extra entre letras (px).
//    • ink          : color base de la tinta (hex de 6 dígitos).
//    • decoration   : adorno sutil ('none', 'line', 'dots', 'hearts',
//                     'flourish').
//
//  Para cambiar el aspecto de todas las cartas que comparten un estilo,
//  edita su entrada aquí. Para cambiar SOLO una carta, usa `textStyle` o
//  `textColor` en js/memories.js.
// ==========================================================================

// Familias con respaldo: si una fuente no carga, se usa la siguiente.
const MANUSCRITA = '"Caveat", "Segoe Script", "Comic Sans MS", cursive';
const GUION = '"Dancing Script", "Brush Script MT", "Segoe Script", cursive';
const ROMANTICA = '"Parisienne", "Dancing Script", "Segoe Script", cursive';
const SERIFA = '"Cormorant Garamond", "Times New Roman", Georgia, serif';
const ELEGANTE = '"Playfair Display", Georgia, "Times New Roman", serif';
const REDONDA = '"Quicksand", "Trebuchet MS", "Segoe UI", sans-serif';
const MODERNA = '"DM Sans", "Helvetica Neue", Arial, sans-serif';

// Tintas románticas pensadas para leerse bien sobre los fondos pastel
// (rosa, lila, crema, durazno) y sobre el fondo lila oscuro de la estrella.
export const CARD_INKS = {
  rosa: '#a83f6d',
  rosaSuave: '#b25c86',
  vino: '#7a1436',
  mauve: '#7a3f78',
  ciruela: '#5c2a63',
  berenjena: '#43285a',
  lila: '#6a4f9c',
  lavanda: '#544291',
  indigo: '#3a2f6b',
  acero: '#3d3a6e',
  champan: '#8a6533',
  durazno: '#94513a',
  chocolate: '#6a3a2a',
  crema: '#fff6fb'
};

// Tinta adecuada para la leyenda de cada tipo de marco de foto.
export const CAPTION_INK_BY_FRAME = {
  polaroid: CARD_INKS.ciruela,
  pink: CARD_INKS.ciruela,
  cosmic: CARD_INKS.crema,
  heart: CARD_INKS.vino
};

export const CARD_STYLES = {
  // ── Manuscritas: letra a mano, cercana y tierna ───────────────────────
  'manuscrita-rosa': { font: MANUSCRITA, weight: 600, italic: false, sizeScale: 1.16, lineHeight: 1.32, align: 'center', letterSpacing: 0.5, ink: CARD_INKS.rosa, decoration: 'hearts' },
  'manuscrita-lila': { font: MANUSCRITA, weight: 500, italic: false, sizeScale: 1.18, lineHeight: 1.34, align: 'center', letterSpacing: 0.4, ink: CARD_INKS.lila, decoration: 'none' },
  'manuscrita-suave': { font: MANUSCRITA, weight: 400, italic: false, sizeScale: 1.14, lineHeight: 1.36, align: 'center', letterSpacing: 0.3, ink: CARD_INKS.lavanda, decoration: 'dots' },
  'manuscrita-dulce': { font: MANUSCRITA, weight: 700, italic: false, sizeScale: 1.12, lineHeight: 1.3, align: 'center', letterSpacing: 0.3, ink: CARD_INKS.rosaSuave, decoration: 'hearts' },

  // ── Cursivas románticas: estilo carta sentimental ─────────────────────
  'escritura-elegante': { font: GUION, weight: 700, italic: false, sizeScale: 1.2, lineHeight: 1.34, align: 'center', letterSpacing: 0.2, ink: CARD_INKS.champan, decoration: 'flourish' },
  'escritura-suave': { font: GUION, weight: 500, italic: false, sizeScale: 1.22, lineHeight: 1.36, align: 'center', letterSpacing: 0.2, ink: CARD_INKS.durazno, decoration: 'hearts' },
  'escritura-romantica': { font: GUION, weight: 600, italic: false, sizeScale: 1.18, lineHeight: 1.34, align: 'center', letterSpacing: 0.2, ink: CARD_INKS.vino, decoration: 'flourish' },
  'romantica-script': { font: ROMANTICA, weight: 400, italic: false, sizeScale: 1.24, lineHeight: 1.4, align: 'center', letterSpacing: 0.2, ink: CARD_INKS.rosaSuave, decoration: 'flourish' },

  // ── Serifas elegantes: aire clásico y refinado ────────────────────────
  'serif-poetica': { font: SERIFA, weight: 500, italic: true, sizeScale: 1.12, lineHeight: 1.5, align: 'center', letterSpacing: 0.1, ink: CARD_INKS.ciruela, decoration: 'line' },
  'serif-italiana': { font: SERIFA, weight: 400, italic: true, sizeScale: 1.1, lineHeight: 1.55, align: 'center', letterSpacing: 0.1, ink: CARD_INKS.lavanda, decoration: 'none' },
  'serif-clasica': { font: SERIFA, weight: 500, italic: false, sizeScale: 1.08, lineHeight: 1.5, align: 'center', letterSpacing: 0.1, ink: CARD_INKS.chocolate, decoration: 'line' },
  'cursiva-poetica': { font: SERIFA, weight: 400, italic: true, sizeScale: 1.06, lineHeight: 1.5, align: 'center', letterSpacing: 0.7, ink: CARD_INKS.lila, decoration: 'dots' },
  'decorada-serif': { font: ELEGANTE, weight: 600, italic: false, sizeScale: 1.04, lineHeight: 1.46, align: 'center', letterSpacing: 0.2, ink: CARD_INKS.ciruela, decoration: 'flourish' },
  'clasica-suave': { font: ELEGANTE, weight: 500, italic: false, sizeScale: 1.02, lineHeight: 1.5, align: 'center', letterSpacing: 0.2, ink: CARD_INKS.berenjena, decoration: 'line' },

  // ── Redondeadas tiernas: personalidad dulce ───────────────────────────
  'redondeada-dulce': { font: REDONDA, weight: 600, italic: false, sizeScale: 1.0, lineHeight: 1.46, align: 'center', letterSpacing: 0.4, ink: CARD_INKS.rosa, decoration: 'hearts' },
  'redondeada-tierna': { font: REDONDA, weight: 700, italic: false, sizeScale: 1.0, lineHeight: 1.44, align: 'center', letterSpacing: 0.4, ink: CARD_INKS.indigo, decoration: 'dots' },
  'redondeada-calida': { font: REDONDA, weight: 500, italic: false, sizeScale: 1.02, lineHeight: 1.46, align: 'center', letterSpacing: 0.4, ink: CARD_INKS.durazno, decoration: 'hearts' },
  'cute-round': { font: REDONDA, weight: 500, italic: false, sizeScale: 1.02, lineHeight: 1.46, align: 'center', letterSpacing: 0.4, ink: CARD_INKS.mauve, decoration: 'dots' },

  // ── Modernas limpias: máxima legibilidad ──────────────────────────────
  'moderna-clara': { font: MODERNA, weight: 400, italic: false, sizeScale: 0.98, lineHeight: 1.52, align: 'center', letterSpacing: 0.2, ink: CARD_INKS.berenjena, decoration: 'none' },
  'moderna-fuerte': { font: MODERNA, weight: 700, italic: false, sizeScale: 0.96, lineHeight: 1.48, align: 'center', letterSpacing: 0.2, ink: CARD_INKS.acero, decoration: 'none' },
  'moderna-suave': { font: MODERNA, weight: 500, italic: false, sizeScale: 0.98, lineHeight: 1.5, align: 'center', letterSpacing: 0.2, ink: CARD_INKS.ciruela, decoration: 'dots' },
  'moderna-calida': { font: MODERNA, weight: 500, italic: true, sizeScale: 0.98, lineHeight: 1.5, align: 'center', letterSpacing: 0.2, ink: CARD_INKS.vino, decoration: 'none' },

  // ── Leyendas para las fotos (texto corto) ─────────────────────────────
  'leyenda-ciruela': { font: SERIFA, weight: 500, italic: true, sizeScale: 1, lineHeight: 1.2, align: 'center', letterSpacing: 0.3, ink: CARD_INKS.ciruela, decoration: 'none' },
  'leyenda-vino': { font: ELEGANTE, weight: 600, italic: true, sizeScale: 1, lineHeight: 1.2, align: 'center', letterSpacing: 0.3, ink: CARD_INKS.vino, decoration: 'none' },
  'leyenda-crema': { font: SERIFA, weight: 500, italic: false, sizeScale: 1, lineHeight: 1.2, align: 'center', letterSpacing: 0.3, ink: CARD_INKS.crema, decoration: 'none' },
  'leyenda-rosa': { font: REDONDA, weight: 600, italic: false, sizeScale: 1, lineHeight: 1.2, align: 'center', letterSpacing: 0.4, ink: CARD_INKS.rosa, decoration: 'none' },
  'leyenda-lila': { font: SERIFA, weight: 500, italic: true, sizeScale: 1, lineHeight: 1.2, align: 'center', letterSpacing: 0.3, ink: CARD_INKS.lila, decoration: 'none' },
  'leyenda-champan': { font: ELEGANTE, weight: 500, italic: false, sizeScale: 1, lineHeight: 1.2, align: 'center', letterSpacing: 0.3, ink: CARD_INKS.champan, decoration: 'none' }
};

// Estilo por defecto según la forma de la carta, por si una entrada de
// memories.js no indica `textStyle`.
const FALLBACK_BY_SHAPE = {
  'love-letter': 'serif-poetica',
  'cloud-note': 'redondeada-dulce',
  'star-note': 'escritura-elegante',
  postcard: 'manuscrita-rosa',
  'diary-page': 'manuscrita-lila',
  envelope: 'romantica-script',
  'heart-card': 'escritura-suave'
};

function toCssColor(value) {
  if (typeof value === 'number') return `#${value.toString(16).padStart(6, '0')}`;
  return value;
}

// Devuelve una copia del estilo que corresponde a una carta, aplicando las
// sobreescrituras opcionales de memories.js (`textStyle`, `textColor`,
// `textScale`, `textAlign`).
export function resolveCardStyle(data = {}, role = 'body') {
  let base = null;
  if (data.textStyle && CARD_STYLES[data.textStyle]) base = CARD_STYLES[data.textStyle];
  if (!base) base = CARD_STYLES[FALLBACK_BY_SHAPE[data.style]] || CARD_STYLES['moderna-clara'];

  const style = { ...base };
  if (data.textColor !== undefined) style.ink = toCssColor(data.textColor);
  if (data.textScale !== undefined) style.sizeScale = data.textScale;
  if (data.textAlign) style.align = data.textAlign;

  // Las leyendas de foto son cortas: mejor sin adornos y con interlineado fino.
  if (role === 'caption') {
    style.decoration = 'none';
    if (data.textColor === undefined && CAPTION_INK_BY_FRAME[data.frame]) {
      style.ink = CAPTION_INK_BY_FRAME[data.frame];
    }
  }
  return style;
}
