import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Gamepad2, Map, Moon, Sun, User, Settings, Trophy, Search, Wrench, Play } from 'lucide-react'
import { GAMES } from '../games'
import { useNavigate } from 'react-router-dom'

// DEBUG: Verificar que las rutas están correctas
console.log('🎯 GAMES:', GAMES.map(g => ({ title: g.title, route: g.route })))

const THEME_KEY = 'casma_theme'
const PROFILE_KEY = 'casma_profile'

function Pill({ text, className = '' }){
  return <span className={`text-xs px-2.5 py-1 rounded-full border border-white/10 bg-white/5 ${className}`}>{text}</span>
}

function CTA({ children, to = '#', variant = 'solid', icon, onClick }){
  const base = 'inline-flex items-center gap-2 px-4 py-2 rounded-xl border transition'
  const styles = variant === 'solid'
    ? 'bg-emerald-500/90 hover:bg-emerald-400 text-neutral-900 border-emerald-400'
    : 'bg-transparent hover:bg-white/5 text-neutral-100 border-white/10'
  return (
    <a href={to} onClick={onClick} className={`${base} ${styles}`}>
      {icon}<span className="font-medium">{children}</span>
    </a>
  )
}

function ProfileForm({ setProfile, close }){
  const [name, setName] = useState('')
  const [color, setColor] = useState('emerald')
  
  useEffect(() => {
    const p = localStorage.getItem(PROFILE_KEY)
    if(p){ 
      const j = JSON.parse(p); 
      setName(j.name || ''); 
      setColor(j.color || 'emerald') 
    }
  }, [])
  
  const save = (e) => {
    e.preventDefault()
    const p = { 
      name: name.trim() || 'Invitado', 
      color 
    }
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p))
    setProfile(p)
    close()
  }
  
  return (
    <form onSubmit={save} className="mt-3 space-y-3">
      <div>
        <label className="text-xs text-neutral-400">Nombre</label>
        <input 
          className="mt-1 w-full bg-neutral-800 border border-white/10 rounded-xl px-3 py-2 outline-none" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          placeholder="Tu nickname" 
        />
      </div>
      <div>
        <label className="text-xs text-neutral-400">Color de acento</label>
        <div className="mt-2 grid grid-cols-6 gap-2">
          {['emerald','yellow','lime','cyan','orange','teal'].map(c => (
            <button 
              type="button" 
              key={c} 
              onClick={() => setColor(c)} 
              className={`h-8 rounded-xl border border-white/10 bg-${c}-500 ${color === c ? 'ring-2 ring-white' : ''}`}
              title={c}
            />
          ))}
        </div>
      </div>
      <button 
        type="submit" 
        className="w-full bg-emerald-500/90 hover:bg-emerald-400 text-neutral-900 font-medium px-4 py-2 rounded-xl border border-emerald-400"
      >
        Guardar
      </button>
    </form>
  )
}

function ProfileButton({ profile, setProfile }){
  const [open, setOpen] = useState(false)
  
  return (
    <div className="relative">
      <button 
        onClick={() => setOpen(v => !v)} 
        className="p-2 rounded-xl border border-white/10 hover:bg-white/5 transition inline-flex items-center gap-2"
      >
        <User className="w-5 h-5" />
        <span className="text-sm">{profile?.name || 'Invitado'}</span>
      </button>
      
      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-white/10 bg-neutral-900 p-4 shadow-xl z-50">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Settings className="w-4 h-4"/> Perfil
          </h4>
          <ProfileForm 
            close={() => setOpen(false)} 
            setProfile={setProfile} 
          />
        </div>
      )}
    </div>
  )
}

function fancyShape(i){
  const shapes = [
    'polygon(12% 0, 100% 0, 100% 85%, 88% 100%, 0 100%, 0 12%)',
    'polygon(0 0, 100% 0, 100% 100%, 18% 100%, 0 82%)',
    'polygon(0 0, 90% 0, 100% 18%, 100% 100%, 0 100%)',
    'polygon(10% 0, 100% 0, 100% 90%, 92% 100%, 0 100%, 0 14%)'
  ]
  return shapes[i % shapes.length]
}

export default function Home(){
  const [theme, setTheme] = useState('dark')
  const [profile, setProfile] = useState(null)
  const [q, setQ] = useState('')
  const [tag, setTag] = useState('Todos')
  const navigate = useNavigate()

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'dark'
    setTheme(savedTheme)
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    const p = localStorage.getItem(PROFILE_KEY)
    if(p) setProfile(JSON.parse(p))
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.classList.toggle('dark', next === 'dark')
    localStorage.setItem(THEME_KEY, next)
  }

  // 👇 FUNCIÓN CORREGIDA - Asegura que las rutas tengan /
  const handlePlayGame = (gameRoute) => {
    console.log('🔍 DEBUG - Ruta original:', gameRoute)
    
    // Corrige la ruta si no empieza con /
    const correctedRoute = gameRoute.startsWith('/') ? gameRoute : `/${gameRoute}`
    
    console.log('🔍 DEBUG - Ruta corregida:', correctedRoute)
    console.log('🔍 DEBUG - Navegando a:', correctedRoute)
    
    navigate(correctedRoute)
  }

  const filtered = useMemo(() => (
    GAMES.filter(g => 
      (tag === 'Todos' || g.tags.includes(tag)) && 
      (q.trim() === '' || 
       g.title.toLowerCase().includes(q.toLowerCase()) || 
       g.blurb.toLowerCase().includes(q.toLowerCase()))
    )
  ), [q, tag])

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-50 bg-gradient-to-b from-neutral-900 to-neutral-950">
      {/* Topbar */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/60 bg-neutral-900/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <Gamepad2 className="w-7 h-7 text-emerald-400" />
          <div className="flex-1">
            <h1 className="text-xl font-semibold tracking-tight">Casma Games Hub</h1>
            <p className="text-xs text-neutral-400">Centro de videojuegos web — Cultura, turismo y diversión</p>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-neutral-800 rounded-xl px-3 py-2 border border-white/10">
            <Search className="w-4 h-4 text-neutral-400" />
            <input 
              value={q} 
              onChange={e => setQ(e.target.value)} 
              placeholder="Buscar juego…" 
              className="bg-transparent outline-none text-sm placeholder:text-neutral-500 w-56" 
            />
          </div>

          <select 
            className="hidden md:block bg-neutral-800 text-sm rounded-xl px-3 py-2 border border-white/10" 
            value={tag} 
            onChange={e => setTag(e.target.value)}
          >
            {['Todos','PVP','CPU','Lucha','Carrera','Mapa','Estrategia','Oleadas','Exploración','Puzzle','Gestión','Tiempo','3D','Cultural','Reflejos','Deporte','Cocina','Casual','Match-3','Arcade','Velocidad'].map(t => 
              <option key={t}>{t}</option>
            )}
          </select>

          <button 
            onClick={() => navigate('/planos')}
            className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-sm"
          >
            <Wrench className="w-4 h-4" /> Planos (Top 5)
          </button>

          <button 
            onClick={toggleTheme} 
            className="ml-2 p-2 rounded-xl border border-white/10 hover:bg-white/5 transition"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}
          </button>
          
          <ProfileButton profile={profile} setProfile={setProfile} />
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
          <div className="grid md:grid-cols-5 gap-6 items-center">
            <div className="md:col-span-3">
              <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">
                Bienvenido a <span className="bg-gradient-to-r from-yellow-400 to-emerald-500 bg-clip-text text-transparent">Casma</span>:<br/> juega, aprende y descubre.
              </h2>
              <p className="mt-3 text-neutral-300 max-w-prose">
                Una colección de minijuegos 2D/3D para celebrar la cultura Sechín, los torreones de Chankillo y los paisajes del valle. 100% web, rápido y sin instalaciones.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Pill text="Amarillo" className="bg-yellow-400/10 text-yellow-300 border-yellow-400/30" />
                <Pill text="Verde" className="bg-emerald-400/10 text-emerald-300 border-emerald-400/30" />
                <Pill text="Blanco" className="bg-white/5 text-white border-white/20" />
                <Pill text="Modo nocturno" className="bg-neutral-800 text-neutral-200 border-white/10" />
              </div>
              <div className="mt-6 flex gap-3">
                <button 
                  onClick={() => document.getElementById('juegos').scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border bg-emerald-500/90 hover:bg-emerald-400 text-neutral-900 border-emerald-400 transition"
                >
                  <Map className="w-4 h-4" />
                  <span className="font-medium">Ver colección</span>
                </button>
                <button 
                  onClick={() => navigate('/planos')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-neutral-100 transition"
                >
                  <Wrench className="w-4 h-4" />
                  <span className="font-medium">Planos (Top 5)</span>
                </button>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="relative rounded-3xl border border-white/10 p-5 h-full bg-neutral-900 overflow-hidden">
                <div className="absolute -top-24 -right-20 w-64 h-64 rounded-full bg-gradient-to-tr from-yellow-400 to-emerald-500 blur-3xl opacity-20" />
                <div className="relative">
                  <h4 className="text-lg font-bold">Evento: Festival Chavín & Sechín</h4>
                  <p className="text-neutral-300 text-sm mt-1">Completa retos diarios y desbloquea insignias temáticas. ¡Próximamente!</p>
                  <ul className="mt-3 text-sm list-disc list-inside space-y-1 text-neutral-300">
                    <li>Desafíos por tiempo</li>
                    <li>Clasificación local</li>
                    <li>Recompensas cosméticas</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid of Games */}
      <section id="juegos" className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Colección</h3>
          <span className="text-sm text-neutral-400">{filtered.length} juegos</span>
        </div>
        
        {/* Indicador de juegos disponibles */}
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <div className="flex items-center gap-3">
            <Play className="w-5 h-5 text-emerald-400" />
            <div>
              <h4 className="font-medium text-emerald-300">¡Juegos disponibles!</h4>
              <p className="text-sm text-neutral-300">Los primeros 5 juegos ya están listos para jugar</p>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((g, i) => (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="group relative rounded-2xl p-5 border border-white/10 bg-gradient-to-br hover:shadow-2xl hover:shadow-emerald-500/10 transition overflow-hidden cursor-pointer"
              style={{ clipPath: fancyShape(i) }}
              onClick={() => handlePlayGame(g.route)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${g.accent} opacity-20 group-hover:opacity-30 transition`} />
              
              {/* Badge de "Disponible" para los primeros 5 juegos */}
              {i < 5 && (
                <div className="absolute top-3 right-3">
                  <span className="bg-emerald-500 text-emerald-900 text-xs px-2 py-1 rounded-full font-bold">
                    ¡JUGAR!
                  </span>
                </div>
              )}
              
              <div className="relative">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center">
                    <span className="text-lg">{g.title.split(' ').map(w => w[0]).join('')}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold tracking-tight">{g.title}</h4>
                    <p className="mt-0.5 text-xs text-neutral-400">{g.type} • Dificultad {g.difficulty}</p>
                  </div>
                </div>
                <p className="mt-2 text-sm text-neutral-300 line-clamp-2">{g.blurb}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {g.tags.slice(0, 3).map(t => <Pill key={t} text={t} />)}
                </div>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePlayGame(g.route)
                  }}
                  className={`mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all ${
                    i < 5 
                      ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/30 hover:scale-105 cursor-pointer' 
                      : 'bg-white/5 border-white/10 text-neutral-400 cursor-not-allowed'
                  }`}
                  disabled={i >= 5}
                >
                  <Play className="w-4 h-4" />
                  {i < 5 ? 'Jugar Ahora' : 'Próximamente'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-sm text-neutral-400">
        Hecho con ❤️ para Casma — Progreso y perfiles se guardan en localStorage.
      </footer>
    </div>
  )
}