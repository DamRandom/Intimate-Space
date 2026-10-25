import { Service } from '@/types';

export const SERVICES_DATA: Service[] = [
  {
    id: 'relajante',
    name: 'Masaje Relajante',
    category: 'relajacion',
    tag: 'RelajaciÃ³n',
    description: 'DiseÃ±ado para disminuir el estrÃ©s y alcanzar una relajaciÃ³n profunda mediante movimientos suaves y fluidos que favorecen la circulaciÃ³n.',
    image: '/relajante.jpeg',
    prices: [
      { duration: '60 min', price: 155 },
    ],
  },
  {
    id: 'descontracturante',
    name: 'Masaje Descontracturante',
    category: 'terapeutico',
    tag: 'TerapÃ©utico',
    description: 'Libera la tensiÃ³n muscular y alivia contracturas acumuladas con tÃ©cnicas enfocadas en las zonas de mayor rigidez para mejorar la movilidad.',
    image: '/descontracturante.jpeg',
    prices: [
      { duration: '60 min', price: 160 },
    ],
  },
  {
    id: 'descarga-muscular',
    name: 'Descarga Muscular',
    category: 'terapeutico',
    tag: 'TerapÃ©utico',
    description: 'Tratamiento integral que libera la tensiÃ³n muscular mientras promueve una profunda relajaciÃ³n y el equilibrio del cuerpo.',
    image: '/muscular.jpeg',
    prices: [
      { duration: '60 min', price: 210 },
    ],
  },
  {
    id: 'piedras-calientes',
    name: 'Relajante Piedras Calientes',
    category: 'relajacion',
    tag: 'Termoterapia',
    description: 'Combina tÃ©cnicas de masaje tradicional con el uso de piedras volcÃ¡nicas calientes para promover la relajaciÃ³n muscular profunda.',
    image: '/piedras.jpeg',
    prices: [
      { duration: '70 min', price: 200 },
    ],
  },
  {
    id: 'relajante-especial',
    name: 'Masaje Relajante Especial',
    category: 'relajacion',
    tag: 'Premium',
    description: 'Tratamiento exclusivo y personalizado que combina diversas tÃ©cnicas con un enfoque holÃ­stico para ofrecer relajaciÃ³n total.',
    image: '/relajante_especial.jpeg',
    prices: [
      { duration: '60 min', price: 290 },
    ],
  },
  {
    id: 'deportivo',
    name: 'Masaje Deportivo',
    category: 'deportivo',
    tag: 'Deportivo',
    description: 'Orientado a personas activas o con dolores musculares, utiliza tÃ©cnicas enfocadas en zonas especÃ­ficas para acelerar la recuperaciÃ³n.',
    image: '/deportivo.jpeg',
    prices: [
      { duration: '30 min', price: 150 },
      { duration: '60 min', price: 260 },
    ],
  },
  {
    id: 'reductor',
    name: 'Masaje Reductor',
    category: 'terapeutico',
    tag: 'Modelador',
    description: 'TÃ©cnica manual para disminuir medidas, moldear la figura (abdomen, cintura, piernas, brazos) y favorecer la circulaciÃ³n y el drenaje linfÃ¡tico.',
    image: '/reductor.jpeg',
    prices: [
      { duration: '45 min', price: 190 },
    ],
  },
  {
    id: 'tantrico',
    name: 'TÃ¡ntrico Relajante',
    category: 'sensorial',
    tag: 'Sensorial',
    description: 'Combina tÃ©cnicas de relajaciÃ³n profunda con una experiencia sensorial diseÃ±ada para aliviar tensiones y desconectar de la rutina.',
    image: '/tantrico.jpeg',
    prices: [
      { duration: '60 min', price: 275 },
    ],
  },
  {
    id: 'intimo-sensorial',
    name: 'Masaje Ãntimo Sensorial',
    category: 'sensorial',
    tag: 'Ãntimo',
    description: 'Experiencia sensorial enfocada en el placer y la relajaciÃ³n con movimientos suaves y envolventes. Incluye desnudo integral interactivo, masaje cuerpo a cuerpo y estimulaciÃ³n manual.',
    image: '/relajacion.jpeg',
    prices: [
      { duration: '60 min', price: 310 },
    ],
  },
  {
    id: 'intimo-4manos',
    name: 'Masaje Ãntimo Sensorial (A 4 Manos)',
    category: 'sensorial',
    tag: 'Ãntimo Â· 4 Manos',
    description: 'Dos terapeutas trabajan de forma sincronizada para ofrecer una experiencia envolvente y potenciar las sensaciones de relajaciÃ³n.',
    image: '/intimo4manos.jpeg',
    prices: [
      { duration: '60 min', price: 500 },
    ],
  },
  {
    id: 'programas',
    name: 'Programas Personalizados',
    category: 'relajacion',
    tag: 'Personalizable',
    description: 'Programas de RelajaciÃ³n (ReflexologÃ­a, Lomi Lomi, Piedras Calientes, Craneofacial o TailandÃ©s; combinables hasta 2) y Programa TerapÃ©utico (Descontracturante, Descarga Muscular, Deep Tissue, TENS, Ventosas, Pistola de PercusiÃ³n o PunciÃ³n Seca).',
    image: '/terapeutico.jpeg',
    prices: [
      { duration: '45 min', price: 175 },
      { duration: '60 min', price: 210 },
      { duration: '90 min', price: 260 },
    ],
  },
];

