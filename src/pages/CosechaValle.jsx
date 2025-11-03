import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Gamepad2 } from 'lucide-react'

const CosechaValle = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-yellow-950 text-white">
      <div className="bg-neutral-800/50 border-b border-white/10 p-4 backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition">
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
          <Gamepad2 className="w-6 h-6 text-yellow-400" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Cosecha del Valle
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-neutral-800/30 rounded-2xl border border-white/10 p-8 backdrop-blur text-center">
          <h2 className="text-4xl font-bold mb-4">🌾 Agricultura Ancestral</h2>
          <p className="text-neutral-300 text-lg mb-8">Cultiva y prospera en el valle</p>
          
          <div className="bg-neutral-900 rounded-xl border-2 border-yellow-500/20 p-4 mb-6">
            <div className="aspect-video bg-neutral-800 rounded-lg flex items-center justify-center">
              <div className="text-6xl mb-4">🌱</div>
            </div>
          </div>

          <button onClick={() => navigate('/')} className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-semibold rounded-xl transition">
            Volver al Menú
          </button>
        </div>
      </div>
    </div>
  )
}

export default CosechaValle