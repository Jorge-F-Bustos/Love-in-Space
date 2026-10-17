// Edita solo este archivo para cambiar las memorias de este universo.
// Cada carta tiene su propio `textStyle` (tipografía y color, definidos en
// js/cardStyles.js). Para cambiar solo el mensaje, edita `title`, `text` o
// `caption`; para cambiar la tipografía de una carta, cambia su `textStyle`.
//
// IMÁGENES O VÍDEOS (type: 'photo'):
//   Puedes mostrar una imagen o un vídeo .mp4 en el mismo sitio. El marco se
//   adapta solo a la proporción real del archivo. Opciones válidas:
//     • image: 'assets/images/foto.jpg'   → imagen (jpg, jpeg, png, webp...).
//     • video: 'assets/images/clip.mp4'   → vídeo en bucle, sin sonido.
//     • media: 'assets/images/clip.mp4'   → el tipo se detecta por la
//                                            extensión (.mp4, .webm, .mov...).
//     • mediaType: 'image' | 'video'      → fuerza el tipo si hiciera falta.
//   Cambiar una foto por un vídeo es tan simple como apuntar `image` a un
//   .mp4 o añadir la clave `video`. Los vídeos se reproducen en continuo.
export const memories = [
  { id:'memory-01', type:'photo', image:'assets/images/video01.mp4', caption:'JAJSAKJSJKASA\natake epiléptico ♡', position:{x:7,y:2,z:-10}, rotation:{x:0,y:-.2,z:.04}, frame:'pink', glow:true, textStyle:'leyenda-vino' },
  { id:'memory-02', type:'photo', image:'assets/images/photo01.png', caption:'Te la dejé bien clavada ohsi\n( ͡° ͜ʖ ͡°)', position:{x:-8,y:5,z:-7}, rotation:{x:.08,y:.25,z:-.05}, frame:'polaroid', particles:true, textStyle:'leyenda-ciruela' },
  { id:'memory-03', type:'note', title:'Para mi amorcito ♡', text:'Si algún día sientes que todo pesa demasiado, recuerda que me tienes a mi. Puedes descansar, llorar, desahogarte o simplemente quedarte conmigo en silencio. No necesitas estar bien para merecer amor. Quiero acompañarte también en esos días en los que tu sonrisa necesita un descansito. Te amo muchísimo, coshita bella. (っ˘̩╭╮˘̩)っ♡', position:{x:-5,y:-3,z:-11}, rotation:{x:0,y:.18,z:-.04}, style:'love-letter', glow:true, textStyle:'serif-poetica' },
  { id:'memory-04', type:'photo', image:'assets/images/video02.mp4', caption:'Mi mundo girando\nal rededor mio ♡', position:{x:12,y:-4,z:-4}, rotation:{x:-.08,y:-.45,z:.05}, frame:'cosmic', textStyle:'leyenda-crema' },
  { id:'memory-05', type:'note', title:'', text:'', position:{x:2,y:8,z:-9}, rotation:{x:.1,y:-.18,z:.03}, style:'cloud-note', textStyle:'redondeada-dulce' },
  { id:'memory-06', type:'photo', image:'assets/images/photo02.png', caption:'Amo mucho nuestro estilo\nde dibujo ་⁺₊♡', position:{x:-13,y:1,z:-15}, rotation:{x:.12,y:.55,z:-.08}, frame:'heart', textStyle:'leyenda-vino' },
  { id:'memory-07', type:'note', title:'', text:'', position:{x:9,y:7,z:-19}, rotation:{x:-.1,y:-.3,z:.06}, style:'star-note', glow:true, textStyle:'escritura-elegante' },
  { id:'memory-08', type:'note', title:'Para mi niña chikita preciosa ♡', text:'Ojalá pudiera abrazarte tan fuerte que sintieras todo el amor que tengo guardadito para ti. Eres mi lugar favorito, mi personita más bonita y mi razón para sonreír incluso en los días más simples. Te amo muchísimoooo. (っ˘з(˘⌣˘ ) ♡', position:{x:-17,y:-6,z:-9}, rotation:{x:.08,y:.7,z:-.04}, style:'postcard', textStyle:'manuscrita-rosa' },

  { id:'back-memory-01', type:'photo', image:'assets/images/video03.mp4', caption:'JKSAKKJASKJASJKSA\nTE AMOOOOOOOOO mi niña lag ♡', position:{x:-6,y:4,z:17}, rotation:{x:-.08,y:.25,z:-.04}, frame:'cosmic', glowColor:0xb9a5ff, particles:true, textStyle:'moderna-calida' },
  { id:'back-memory-02', type:'photo', image:'assets/images/photo03.png', caption:'Ese día casi muero de risa\nJKASJKSAJKASJKAS', position:{x:5,y:-2,z:20}, rotation:{x:.06,y:-.35,z:.05}, frame:'pink', glowColor:0xffa8c9, textStyle:'leyenda-champan' },
  { id:'back-memory-03', type:'photo', image:'assets/images/video04.mp4', caption:'Nunca te separes de mi\n ＞⩊＜', position:{x:11,y:6,z:28}, rotation:{x:-.12,y:.48,z:-.03}, frame:'polaroid', glowColor:0xffe2b9, textStyle:'leyenda-rosa' },
  { id:'back-memory-04', type:'note', title:'Mi bebecita jodidaaaa >:3', text:'Hasta cuando te pones necia me pareces la cosita más preciosa del universo. No cambiaría tu forma de ser por nada, porque amo hasta esas pequeñas cositas que te hacen ser tú. ฅ(˶ᵔ ᵕ ᵔ˶)ฅ', position:{x:-11,y:-3,z:21}, rotation:{x:.05,y:.6,z:-.06}, style:'love-letter', glowColor:0xffb8d5, textStyle:'serif-italiana' },
  { id:'back-memory-05', type:'note', title:'Mi niña neciaaaaa ♡', text:'Aquí estoy para escucharte, apoyarte y recordarte lo muchísimo que te amo. Puedes ser la niña más necia del mundo, pero también eres la niña más preciosa. (づ> v <)づ♡', position:{x:2,y:7,z:25}, rotation:{x:-.08,y:-.2,z:.04}, style:'postcard', glowColor:0xffd895, textStyle:'moderna-clara' },
  { id:'back-memory-06', type:'note', title:'Para mi gatita ฅ^•ﻌ•^ฅ', text:'me encantan tus cachetitos, son lo más bonito que existe y me dan unas ganas inmensas de llenártelos de besitos hasta que te dé penita. Quiero darte mimitos, abrazarte por horas y consentirte como la gatita hermosa que eres. MIAAAU, TE AMOOOO. ♡', position:{x:-3,y:-1,z:25}, rotation:{x:.12,y:-.55,z:.07}, style:'diary-page', glowColor:0xd8c5ff, textStyle:'manuscrita-lila' },
  { id:'back-memory-07', type:'note', title:'MI SOLECITOOOO >ω<', text:'tienes esa manera tan tuya de hacer que hasta los días más grises se sientan un poquito más bonitos. No necesitas hacer nada extraordinario para iluminar mi vida, porque con existir y ser tú ya haces demasiado por mi corazón. Gracias por ser mi rayito de felicidad. (˶˃ ᵕ ˂˶)♡', position:{x:-3,y:-8,z:15}, rotation:{x:.04,y:.3,z:-.05}, style:'envelope', glowColor:0xffb7ca, textStyle:'romantica-script' },

  { id:'memory-left-01', type:'photo', image:'assets/images/photo04.png', caption:'mobsito observador ꒪꒳꒪', position:{x:-18,y:10,z:-5}, rotation:{x:-.1,y:.3,z:.02}, frame:'heart', glowColor:0xffabc8, textStyle:'leyenda-champan' },
  { id:'memory-left-02', type:'note', title:'', text:'', position:{x:-22,y:-2,z:-2}, rotation:{x:.08,y:.72,z:-.04}, style:'cloud-note', glowColor:0xcbbaff, textStyle:'cute-round' },
  { id:'memory-right-01', type:'photo', image:'assets/images/photo05.png', caption:'Eres mi solecito y mi lunita\n(◡ ⩊ ◡)', position:{x:18,y:4,z:-11}, rotation:{x:.08,y:-.5,z:.06}, frame:'polaroid', glowColor:0xffe2af, textStyle:'leyenda-ciruela' },
  { id:'memory-right-02', type:'note', title:'', text:'', position:{x:22,y:-7,z:-13}, rotation:{x:180,y:180,z:0}, style:'heart-card', glowColor:0xff9fc6, textStyle:'escritura-suave' },
  { id:'memory-upper-01', type:'photo', image:'assets/images/video05.mp4', caption:'JSAKJSA Mi cachorrita\n bugeada ૮ - ﻌ • ა ♥', position:{x:-8,y:14,z:-18}, rotation:{x:.18,y:.18,z:-.05}, frame:'cosmic', glowColor:0xa9eaff, textStyle:'leyenda-crema' },
  { id:'memory-upper-02', type:'note', title:'AY CHAMAAAAAAA 🗣️', text:'Me encanta tenerte en mi vida y poder construir esta historia contigo, pasito a pasito, con muchísimo amor y un montón de besitos pendientes. TE QUIEROOOOO CRACK. (っ˘ω˘ς )', position:{x:8,y:16,z:-25}, rotation:{x:-.14,y:-.35,z:.04}, style:'star-note', glowColor:0xffd99a, textStyle:'moderna-fuerte' },
  { id:'memory-lower-01', type:'photo', image:'assets/images/video06.mp4', caption:'Más fuerte amorcito ⸝⸝⸝˃ ̫ ˂⸝⸝⸝', position:{x:9,y:-12,z:-24}, rotation:{x:-.2,y:-.18,z:.07}, frame:'pink', glowColor:0xffb0da, textStyle:'leyenda-lila' },
  { id:'memory-lower-02', type:'note', title:'Mi esposita hermosa ⋆𐙚₊˚⊹❤︎', text:'Quiero seguir conociéndote, enamorándome de tus pequeñas ocurrencias que tanto menkantan y eligiéndote incluso en los días difíciles. Mi sueño bonito es seguir construyendo nuestra wonita historia contigo. ♡(˃͈ દ ˂͈ ༶ )', position:{x:-10,y:-14,z:14}, rotation:{x:.12,y:.4,z:-.05}, style:'diary-page', glowColor:0xd0c1ff, textStyle:'serif-clasica' },

  { id:'side-left-01', type:'photo', image:'assets/images/video07.mp4', caption:'TE AMOOOOOOOO ･ﾟ･(｡>ω<｡)･ﾟ･', position:{x:-24,y:4,z:-8}, rotation:{x:0,y:.2,z:-.03}, frame:'pink', glowColor:0xffb6d5, textStyle:'leyenda-champan' },
  { id:'side-left-02', type:'note', title:'', text:'', position:{x:-26,y:-6,z:-14}, rotation:{x:0,y:.4,z:.04}, style:'cloud-note', glowColor:0xc8b8ff, textStyle:'manuscrita-suave' },
  { id:'side-left-03', type:'photo', image:'assets/images/photo06.png', caption:'JSAKJSKJSAKJAS menkantas\n･ﾟ･(｡>ω<｡)･ﾟ･', position:{x:-27,y:10,z:4}, rotation:{x:.08,y:.55,z:-.04}, frame:'cosmic', glowColor:0xaeeaff, textStyle:'leyenda-rosa' },
  { id:'side-right-01', type:'photo', image:'assets/images/video08.mp4', caption:'TE ADOROOOOOOO ( ˘͈ ᵕ ˘͈♡)', position:{x:20,y:7,z:0}, rotation:{x:-.04,y:-.35,z:.03}, frame:'polaroid', glowColor:0xffe2b2, textStyle:'leyenda-vino' },
  { id:'side-right-02', type:'note', title:'COSITA CONSENTIDAAAA ˶˃ᆺ˂˶', text:'Te mereces todo lo bonito, muchísimos abrazos, palabras bonitas, apapachos y muchos besitos en esa carita preciosa. Quiero que conmigo puedas sentirte querida, cuidada y libre de ser tú misma. Así que quedate a mi lado y déjame recordarte una vez más que eres mi coshita favorita. (つ≧▽≦)つ♡', position:{x:27,y:-4,z:-15}, rotation:{x:.06,y:-.5,z:-.02}, style:'star-note', glowColor:0xffd493, textStyle:'decorada-serif' },
  { id:'side-right-03', type:'note', title:'Para tus cachetitos wonitos :3', text:'Necesito dejar constancia de que tus cachetitos son patrimonio de mi corazón uwu. Son demasiado bonitos y mi misión en esta vida es llenarlos de besitos hasta que me digas que pare. Aunque no te woi a hacer caso porque MENKANTAAAAAAAN. Muaks muaks muaks. ( ˘ ³˘)♥', position:{x:25,y:11,z:5}, rotation:{x:-.08,y:-.65,z:.04}, style:'postcard', glowColor:0xffaacb, textStyle:'redondeada-tierna' },

  { id:'radial-front-01', type:'photo', image:'assets/images/photo07.png', caption:'Mi niña peruanita ohsi ･𖥦･', position:{x:-2,y:3,z:-16}, rotation:{x:0,y:.1,z:.02}, frame:'polaroid', glowColor:0xffdcb4, textStyle:'leyenda-ciruela' },
  { id:'radial-front-right-01', type:'note', title:'Para esos ojitos preciosos ⸝⸝꙳⋆♡', text:'Amo muchísimo tus ojitos, son de las cosas más preciosas que he visto en mi vida. Me encanta imaginarme mirándolos de cerquita mientras te digo cuánto te amo, hasta que te dé penita y escondas tu carita. Si pudiera guardar una imagen para siempre en mi corazón, sería una de tus ojitos brillando de felicidad. (⁄ ⁄•⁄ω⁄•⁄ ⁄)♡', position:{x:12,y:-5,z:-11}, rotation:{x:0,y:-.25,z:-.03}, style:'love-letter', glowColor:0xffb4d7, textStyle:'cursiva-poetica' },
  { id:'radial-back-right-01', type:'photo', image:'assets/images/video09.mp4', caption:'Por más momentos divertidos\n•⩊•', position:{x:15,y:4,z:16}, rotation:{x:.06,y:-.4,z:.03}, frame:'pink', glowColor:0xffaccd, textStyle:'leyenda-crema' },
  { id:'radial-back-01', type:'note', title:'MI UNIVERSO HERMOSOOOO -`♡´-', text:'entre tantas personas, lugares y posibilidades, tuve la suerte de encontrarte a ti. Ninguna cosa se compara contigo, porque lo que significas para mí no tiene reemplazo. Eres una personita única, llena de magia, y me siento muy feliz de poder amarte y descubrir cada parte de ti. ☾⋆⁺₊♡', position:{x:-4,y:10,z:23}, rotation:{x:-.05,y:.25,z:-.04}, style:'star-note', glowColor:0xd8c5ff, textStyle:'escritura-romantica' },
  { id:'radial-back-left-01', type:'photo', image:'assets/images/photo08.png', caption:'Tu, yo y nuestros futuros michisitos\n≽^•⩊•^≼', position:{x:-16,y:-1,z:15}, rotation:{x:0,y:.55,z:.03}, frame:'heart', glowColor:0xffa8c7, textStyle:'leyenda-lila' },
  { id:'radial-left-01', type:'note', title:'', text:'', position:{x:-19,y:8,z:8}, rotation:{x:.04,y:.7,z:-.02}, style:'cloud-note', glowColor:0xc8c0ff, textStyle:'manuscrita-dulce' },
  { id:'radial-lower-right-01', type:'photo', image:'assets/images/video10.mp4', caption:'Eres mi todo ⁺˳‧₊♡࿐', position:{x:18,y:-11,z:7}, rotation:{x:.1,y:-.65,z:.04}, frame:'cosmic', glowColor:0xaedff0, textStyle:'leyenda-champan' },
  { id:'radial-lower-left-01', type:'note', title:'Mi artista favorita ｡>ㅅ<｡', text:'Menkanta muchísimo tu creatividad y esa capacidad tan bonita que tienes para transformar tus ideas en cosas preciosas. Admiro tu imaginación, tus ocurrencias y la manera tan especial en que ves el mundo. Ojalá nunca dudes de todo lo bonito que puedes crear, porque tu talento y tu forma de ser tienen una magia muy tuya. Estoy muy orgulloso de ti. ♡(˶˃ ᵕ ˂˶)', position:{x:-15,y:-11,z:-7}, rotation:{x:-.08,y:.85,z:-.03}, style:'diary-page', glowColor:0xffd89f, textStyle:'clasica-suave' },

  { id:'central-bunny-memory', type:'photo', image:'assets/images/photo09.png', caption:'Me tienes bien puesta la correa\nJASJASJKAS ૮₍◔ᴥ◔₎ა', position:{x:-15,y:2,z:5}, rotation:{x:0,y:.2,z:-.02}, frame:'pink', glowColor:0xffb9d5, textStyle:'leyenda-rosa' },
  { id:'central-momonga-memory', type:'note', title:'TE ADOROOOOOOOO ♡⁺₊˚✧', text:'Mi amorcito, quiero que recuerdes que mi intención es seguir a tu lado, cuidando lo nuestro y buscando soluciones contigo cuando las cosas se pongan difíciles. No quiero que tengas que adivinar cuánto me importas, quiero demostrártelo con mis palabras y mis acciones. Nunca olvides que eres muy importante para mí y que siempre voy a querer escucharte y acompañarte. ♡', position:{x:15,y:1,z:2}, rotation:{x:0,y:-.2,z:.02}, style:'postcard', glowColor:0xffd39d, textStyle:'moderna-suave' },
  { id:'pumpkin-memory', type:'note', title:'TEAMOKIEROADOROMUCHOOOOO ♡·₊˚˖˙⊹ˑ', text:'TE AMO CON TODO MI CORAZÓN. Gracias por ser tú, amo cada parte de ti y todas tus personalidades, no te cambiaría por nadaaaaa. Definitivamente eres de las cosas más bonitas que me han pasado en la vida, y me emociona pensar en todo lo precioso que todavía podemos vivir. (っ´▽｀)っ♡', position:{x:-20,y:-10,z:24}, rotation:{x:0,y:.35,z:-.03}, style:'postcard', glowColor:0xffaa73, textStyle:'redondeada-calida' },

  // ══════════════════ 16 MARCOS NUEVOS (LISTOS PARA FOTOS O VÍDEOS) ══════════════════
  // Son 16 marcos vacíos, repartidos en huecos libres del universo. Funcionan
  // exactamente igual que los de arriba: el marco se adapta solo a la
  // proporción real del medio (imagen o vídeo .mp4).
  //
  //   • image : escribe aquí la ruta del archivo, por ejemplo
  //             'assets/images/mi-foto.jpg' o 'assets/images/mi-clip.mp4'.
  //             El tipo (imagen o vídeo) se detecta por la extensión.
  //             Mientras esté vacío ('') el marco muestra un marcador suave,
  //             SIN errores ni iconos rotos.
  //   • video : alternativa a `image` para dejar claro que es un vídeo, ej.
  //             video:'assets/images/mi-clip.mp4'.
  //   • position : {x, y, z} → lugar en el mundo (igual criterio que arriba).
  //   • rotation : el marco gira solo para mirar al corazón; `z` (entre -0.1
  //             y 0.1) inclina un poco el marco para que no quede rígido.
  //   • frame  : color del marco → 'pink', 'polaroid', 'cosmic' o 'heart'.
  //   • caption (opcional) : texto de la leyenda, ej. caption:'Nuestro día ♡'.
  //   • textStyle (opcional) : tipografía de la leyenda (ver js/cardStyles.js).
  // El tamaño NO se pone a mano: se ajusta solo a la proporción del medio.
  { id:'marco_nuevo_01', type:'photo', image:'assets/images/photo24.png', caption:'Los más pros /ᐠ ˶˃ᆺ˂˶マ', position:{x:-2.56,y:-13.51,z:-22.55}, rotation:{x:0,y:0,z:.03}, frame:'pink', textStyle:'leyenda-ciruela' },
  { id:'marco_nuevo_02', type:'photo', image:'assets/images/photo10.png', caption:'Nuestro arte es el mejor (⁎˃ᴗ˂⁎)', position:{x:-12.03,y:13.18,z:19.44}, rotation:{x:0,y:0,z:-.04}, frame:'polaroid', textStyle:'leyenda-vino' },
  { id:'marco_nuevo_03', type:'photo', image:'assets/images/photo11.png', caption:'Siempre juntitos ꒰>ヮ<꒱', position:{x:23.4,y:-12.58,z:-0.59}, rotation:{x:0,y:0,z:.05}, frame:'cosmic', textStyle:'leyenda-crema' },
  { id:'marco_nuevo_04', type:'photo', image:'assets/images/photo12.png', caption:'LOVIUUUUUUUU ⸜(｡˃ ᵕ ˂ )⸝♡', position:{x:-21.98,y:-14.25,z:3.92}, rotation:{x:0,y:0,z:-.03}, frame:'heart', textStyle:'leyenda-rosa' },
  { id:'marco_nuevo_05', type:'photo', image:'assets/images/photo25.png', caption:'', position:{x:2.69,y:-13.58,z:21.5}, rotation:{x:0,y:0,z:.04}, frame:'pink', textStyle:'leyenda-champan' },
  { id:'marco_nuevo_06', type:'photo', image:'assets/images/photo13.png', caption:'ÑAÑAÑAÑAÑAÑAÑAÑA ⌯>ᴗ<⌯♡', position:{x:-0.95,y:10.37,z:-22.2}, rotation:{x:0,y:0,z:-.05}, frame:'polaroid', textStyle:'leyenda-lila' },
  { id:'marco_nuevo_07', type:'photo', image:'assets/images/photo14.png', caption:'TE KIEROOOOO ･ﾟ･(｡>ω<｡)･ﾟ･', position:{x:3.05,y:5.32,z:8.64}, rotation:{x:0,y:0,z:.02}, frame:'cosmic', textStyle:'leyenda-crema' },
  { id:'marco_nuevo_08', type:'photo', image:'assets/images/photo15.png', caption:'Somos el mejor dúo \n(ɔ ˘⌣˘)˘⌣˘ c)', position:{x:-10.4,y:-2.29,z:-0.93}, rotation:{x:0,y:0,z:-.02}, frame:'heart', textStyle:'leyenda-ciruela' },
  { id:'marco_nuevo_09', type:'photo', image:'assets/images/photo16.png', caption:'MENKANTAAAAS ˶ᵔ ᵕ ᵔ˶', position:{x:-24.13,y:1.02,z:10.11}, rotation:{x:0,y:0,z:.03}, frame:'pink', textStyle:'leyenda-rosa' },
  { id:'marco_nuevo_10', type:'photo', image:'assets/images/photo17.png', caption:'Siempre tú,siempre nosotros\n ( ˘ ᵕ˘(˘ᵕ ˘ )', position:{x:3.34,y:-5.73,z:-9.06}, rotation:{x:0,y:0,z:-.04}, frame:'polaroid', textStyle:'leyenda-champan' },
  { id:'marco_nuevo_11', type:'photo', image:'assets/images/photo18.png', caption:'MI TESOROOOOO (｡>ㅅ<｡)', position:{x:9.81,y:-6.46,z:4.42}, rotation:{x:0,y:0,z:.05}, frame:'cosmic', textStyle:'leyenda-vino' },
  { id:'marco_nuevo_12', type:'photo', image:'assets/images/photo19.png', caption:'Amo cada instante a tu lado\n/ᐠ˵- ⩊ -˵マ', position:{x:-15.25,y:-13.25,z:-16.44}, rotation:{x:0,y:0,z:-.03}, frame:'heart', textStyle:'leyenda-vino' },
  { id:'marco_nuevo_13', type:'photo', image:'assets/images/photo20.png', caption:'CALVAAAAAAAAA 🗣️', position:{x:-1.13,y:-1.37,z:-26.29}, rotation:{x:0,y:0,z:.02}, frame:'pink', textStyle:'leyenda-lila' },
  { id:'marco_nuevo_14', type:'photo', image:'assets/images/photo21.png', caption:'Eres mi mundo, mi universo entero, mi todo\n*.☆⸜(⑉˙ᗜ˙⑉)⸝♡.*', position:{x:-19.12,y:-12.78,z:12.94}, rotation:{x:0,y:0,z:-.05}, frame:'polaroid', textStyle:'leyenda-ciruela' },
  { id:'marco_nuevo_15', type:'photo', image:'assets/images/photo22.png', caption:'Pasito de maicol jakson JASKSJA', position:{x:2.13,y:-5.42,z:8.96}, rotation:{x:0,y:0,z:.04}, frame:'cosmic', textStyle:'leyenda-crema' },
  { id:'marco_nuevo_16', type:'photo', image:'assets/images/photo23.png', caption:'ÑAMÑAMÑAM ૮₍ ˃ ⤙ ˂ ₎ა', position:{x:-6.78,y:-5.39,z:6.04}, rotation:{x:0,y:0,z:-.02}, frame:'heart', textStyle:'leyenda-rosa' }
];

