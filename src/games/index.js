export const GAMES = [
  {
    id: 'duelo-sechin',
    title: 'Duelo Sechín',
    type: '2D • Versus',
    difficulty: 'Media',
    blurb: 'Enfrentamiento épico entre guerreros Sechín. Combos, bloqueos y estrategia.',
    tags: ['Lucha', 'PVP', 'CPU', 'Cultural', 'Reflejos'],
    accent: 'from-red-500 to-orange-500',
    logo: '/assets/logos/duelo-sechin.svg',
    route: '/duelo-sechin'  // 👈 Coincide con la ruta en routes.jsx
  },
  {
    id: 'rally-casma',
    title: 'Rally Casma', 
    type: '2D/3D • Racing',
    difficulty: 'Media',
    blurb: 'Carreras emocionantes por los valles de Casma. Nitro y derrapes.',
    tags: ['Carrera', 'Velocidad', '3D', 'Cultural'],
    accent: 'from-blue-500 to-cyan-500',
    logo: '/assets/logos/rally-casma.svg',
    route: '/rally-casma'  // 👈 Coincide con la ruta en routes.jsx
  },
  {
    id: 'guardianes-chankillo',
    title: 'Guardianes de Chankillo',
    type: '2D • Defense',
    difficulty: 'Alta',
    blurb: 'Defiende los torreones ancestrales de oleadas de invasores.',
    tags: ['Estrategia', 'Oleadas', 'Gestión', 'Cultural'],
    accent: 'from-green-500 to-emerald-500',
    logo: '/assets/logos/guardianes-chankillo.svg',
    route: '/guardianes-chankillo'
  },
  {
    id: 'tesoro-chankillo',
    title: 'Tesoro en Chankillo',
    type: '2D • Puzzle',
    difficulty: 'Media',
    blurb: 'Resuelve acertijos astronómicos y descubre secretos ancestrales.',
    tags: ['Puzzle', 'Exploración', 'Cultural', 'Mapa'],
    accent: 'from-purple-500 to-pink-500',
    logo: '/assets/logos/tesoro-chankillo.svg',
    route: '/tesoro-chankillo'
  },
  {
    id: 'cosecha-valle',
    title: 'Cosecha del Valle',
    type: '2D • Simulación',
    difficulty: 'Baja',
    blurb: 'Gestiona tu cultivo en el valle de Casma. Planifica y comercia.',
    tags: ['Gestión', 'Simulación', 'Tiempo', 'Cultural'],
    accent: 'from-yellow-500 to-orange-500',
    logo: '/assets/logos/cosecha-valle.svg',
    route: '/cosecha-valle'
  }
]
export function getGameById(id) {
  return GAMES.find(game => game.id === id) || null
}

export function getGameByRoute(route) {
  return GAMES.find(game => game.route === route) || null
} 