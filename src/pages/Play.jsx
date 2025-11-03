import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getGameById } from '../games/index.js' // 👈 Ahora esta función existe

const Play = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const game = getGameById(id)

  // Si el juego no existe, mostrar error
  if (!game) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Juego no encontrado</h1>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-emerald-500 rounded-lg hover:bg-emerald-400 transition"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Header */}
      <div className="bg-neutral-800 border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Hub
          </button>
          <h1 className="text-2xl font-bold text-emerald-400">{game.title}</h1>
        </div>
      </div>

      {/* Contenido del juego */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-neutral-800 rounded-xl border border-white/10 p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">¡{game.title} en Desarrollo!</h2>
          <p className="text-neutral-300 mb-6">
            Este juego está siendo desarrollado con las mejores tecnologías web.
          </p>
          
          {/* Información del juego */}
          <div className="bg-neutral-700 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <img src={game.logo} alt={game.title} className="w-16 h-16 rounded-xl" />
              <div className="text-left">
                <h3 className="text-xl font-bold">{game.title}</h3>
                <p className="text-neutral-400">{game.type}</p>
                <p className="text-sm text-neutral-500">Dificultad: {game.difficulty}</p>
              </div>
            </div>
            <p className="text-neutral-300">{game.blurb}</p>
          </div>

          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-neutral-900 font-semibold rounded-xl transition"
          >
            Volver al Menú Principal
          </button>
        </div>
      </div>
    </div>
  )
}

export default Play