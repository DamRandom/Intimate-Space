import { Service } from '@/types';

export const SERVICES_DATA: Service[] = [
  {
    id: 'relajante',
    name: 'Masaje Relajante',
    category: 'relajacion',
    tag: 'Relajación',
    description: 'Diseñado para disminuir el estrés y alcanzar una relajación profunda mediante movimientos suaves y fluidos que favorecen la circulación.',
    image: '/relajante.jpeg',
    prices: [
      { duration: '60 min', regular: 155, discount: 125 },
    ],
  },
  {
    id: 'descontracturante',
    name: 'Masaje Descontracturante',
    category: 'terapeutico',
    tag: 'Terapéutico',
    description: 'Libera la tensión muscular y alivia contracturas acumuladas con técnicas enfocadas en las zonas de mayor rigidez para mejorar la movilidad.',
    image: '/descontracturante.jpeg',
    prices: [
      { duration: '60 min', regular: 160, discount: 130 },
    ],
  },
  {
    id: 'descarga-muscular',
    name: 'Descarga Muscular',
    category: 'terapeutico',
    tag: 'Terapéutico',
    description: 'Tratamiento integral que libera la tensión muscular mientras promueve una profunda relajación y el equilibrio del cuerpo.',
    image: '/muscular.jpeg',
    prices: [
      { duration: '60 min', regular: 210, discount: 170 },
    ],
  },
  {
    id: 'piedras-calientes',
    name: 'Relajante Piedras Calientes',
    category: 'relajacion',
    tag: 'Termoterapia',
    description: 'Combina técnicas de masaje tradicional con el uso de piedras volcánicas calientes para promover la relajación muscular profunda.',
    image: '/piedras.jpeg',
    prices: [
      { duration: '70 min', regular: 200, discount: 160 },
    ],
  },
  {
    id: 'relajante-especial',
    name: 'Masaje Relajante Especial',
    category: 'relajacion',
    tag: 'Premium',
    description: 'Tratamiento exclusivo y personalizado que combina diversas técnicas con un enfoque holístico para ofrecer relajación total.',
    image: '/relajante_especial.jpeg',
    prices: [
      { duration: '60 min', regular: 290, discount: 230 },
    ],
  },
  {
    id: 'deportivo',
    name: 'Masaje Deportivo',
    category: 'deportivo',
    tag: 'Deportivo',
    description: 'Orientado a personas activas o con dolores musculares, utiliza técnicas enfocadas en zonas específicas para acelerar la recuperación.',
    image: '/deportivo.jpeg',
    prices: [
      { duration: '30 min', regular: 150, discount: 120 },
      { duration: '60 min', regular: 260, discount: 210 },
    ],
  },
  {
    id: 'reductor',
    name: 'Masaje Reductor',
    category: 'terapeutico',
    tag: 'Modelador',
    description: 'Técnica manual para disminuir medidas, moldear la figura (abdomen, cintura, piernas, brazos) y favorecer la circulación y el drenaje linfático.',
    image: '/reductor.jpeg',
    prices: [
      { duration: '45 min', regular: 190, discount: 150 },
    ],
  },
  {
    id: 'tantrico',
    name: 'Tántrico Relajante',
    category: 'sensorial',
    tag: 'Sensorial',
    description: 'Combina técnicas de relajación profunda con una experiencia sensorial diseñada para aliviar tensiones y desconectar de la rutina.',
    image: '/tantrico.jpeg',
    prices: [
      { duration: '60 min', regular: 275, discount: 220 },
    ],
  },
  {
    id: 'intimo-sensorial',
    name: 'Masaje Íntimo Sensorial',
    category: 'sensorial',
    tag: 'Íntimo',
    description: 'Experiencia sensorial enfocada en el placer y la relajación con movimientos suaves y envolventes. Incluye desnudo integral interactivo, masaje cuerpo a cuerpo y estimulación manual.',
    image: '/relajacion.jpeg',
    prices: [
      { duration: '60 min', regular: 310, discount: 250 },
    ],
  },
  {
    id: 'intimo-4manos',
    name: 'Masaje Íntimo Sensorial (A 4 Manos)',
    category: 'sensorial',
    tag: 'Íntimo · 4 Manos',
    description: 'Dos terapeutas trabajan de forma sincronizada para ofrecer una experiencia envolvente y potenciar las sensaciones de relajación.',
    image: '/intimo4manos.jpeg',
    prices: [
      { duration: '60 min', regular: 500, discount: 450 },
    ],
  },
  {
    id: 'programas',
    name: 'Programas Personalizados',
    category: 'relajacion',
    tag: 'Personalizable',
    description: 'Programas de Relajación (Reflexología, Lomi Lomi, Piedras Calientes, Craneofacial o Tailandés; combinables hasta 2) y Programa Terapéutico (Descontracturante, Descarga Muscular, Deep Tissue, TENS, Ventosas, Pistola de Percusión o Punción Seca).',
    image: '/terapeutico.jpeg',
    prices: [
      { duration: '45 min', regular: 175, discount: 140 },
      { duration: '60 min', regular: 210, discount: 170 },
      { duration: '90 min', regular: 260, discount: 210 },
    ],
  },
];
