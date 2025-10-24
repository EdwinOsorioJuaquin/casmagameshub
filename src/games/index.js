import { loadDueloSechin } from './duelo-sechin'

export const GAMES = [
  {
    id: 'duelo-sechin',
    title: 'Duelo Sechín',
    blurb: 'Pelea 2D local: Guerreros Sechín vs. invasores. 1v1 o vs CPU.',
    type: '2D • Versus',
    difficulty: 'Media',
    tags: ['PVP','CPU','Lucha','Cultural'],
    accent: 'from-yellow-400 to-emerald-500',
    logo: '/assets/logos/duelo-sechin.svg',
    loader: loadDueloSechin, // único jugable ahora
  },
  {
    id: 'rally-casma',
    title: 'Rally Casma',
    blurb: 'Carreras sobre el plano urbano y valle de Casma.',
    type: '2D/3D • Racing',
    difficulty: 'Media',
    tags: ['Carrera','Mapa','Reflejos'],
    accent: 'from-emerald-400 to-yellow-500',
    logo: '/assets/logos/rally-casma.svg',
    loader: async ()=> null
  },
  {
    id: 'guardianes-chankillo',
    title: 'Guardianes de Chankillo',
    blurb: 'Tower defense: Guerreros protegen los 13 torreones.',
    type: '2D • Defense',
    difficulty: 'Alta',
    tags: ['Estrategia','Oleadas','Cultural'],
    accent: 'from-amber-400 to-lime-500',
    logo: '/assets/logos/guardianes-chankillo.svg',
    loader: async ()=> null
  },
  {
    id: 'tesoro-chankillo',
    title: 'Tesoro en Chankillo',
    blurb: 'Búsqueda del tesoro con acertijos solares.',
    type: '2D • Puzzle',
    difficulty: 'Media',
    tags: ['Exploración','Puzzle','Cultural'],
    accent: 'from-lime-400 to-amber-500',
    logo: '/assets/logos/tesoro-chankillo.svg',
    loader: async ()=> null
  },
  {
    id: 'cosecha-del-valle',
    title: 'Cosecha del Valle',
    blurb: 'Gestión ligera de chacras y riego del río Casma.',
    type: '2D • Simulación',
    difficulty: 'Baja',
    tags: ['Gestión','Tiempo'],
    accent: 'from-green-400 to-yellow-400',
    logo: '/assets/logos/cosecha-valle.svg',
    loader: async ()=> null
  },
  {
    id: 'ruta-sechin',
    title: 'Ruta Sechín VR-lite',
    blurb: 'Recorrido 3D libre por el complejo Sechín.',
    type: '3D • Exploración',
    difficulty: 'Baja',
    tags: ['3D','Exploración','Cultural'],
    accent: 'from-emerald-300 to-lime-500',
    logo: '/assets/logos/ruta-sechin.svg',
    loader: async ()=> null
  },
  {
    id: 'surf-punta-hornillos',
    title: 'Surf Punta Hornillos',
    blurb: 'Arcade de surf con físicas simples.',
    type: '2D • Arcade',
    difficulty: 'Media',
    tags: ['Reflejos','Deporte'],
    accent: 'from-cyan-300 to-emerald-400',
    logo: '/assets/logos/surf-punta-hornillos.svg',
    loader: async ()=> null
  },
  {
    id: 'gastronomia-casma',
    title: 'Sazón Casmeña',
    blurb: 'Minijuegos de cocina: ceviche, chinguirito, charquicán.',
    type: '2D • MiniJuegos',
    difficulty: 'Baja',
    tags: ['Cocina','Casual'],
    accent: 'from-yellow-300 to-emerald-400',
    logo: '/assets/logos/sazon-casmena.svg',
    loader: async ()=> null
  },
  {
    id: 'arqueologo-express',
    title: 'Arqueólogo Express',
    blurb: 'Match-3 con piezas y monolitos de Sechín.',
    type: '2D • Puzzle',
    difficulty: 'Baja',
    tags: ['Casual','Match-3'],
    accent: 'from-amber-300 to-lime-400',
    logo: '/assets/logos/arqueologo-express.svg',
    loader: async ()=> null
  },
  {
    id: 'sendero-huarmey',
    title: 'Sendero a Huarmey',
    blurb: 'Runner costero esquivando obstáculos del desierto.',
    type: '2D • Runner',
    difficulty: 'Media',
    tags: ['Arcade','Velocidad'],
    accent: 'from-yellow-500 to-green-500',
    logo: '/assets/logos/sendero-huarmey.svg',
    loader: async ()=> null
  },
]

export function getGameById(id){
  return GAMES.find(g => g.id === id)
}
