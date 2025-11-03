import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const DueloSechinGame = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Header del juego */}
      <div className="bg-neutral-800 border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Hub
          </button>
          <h1 className="text-2xl font-bold text-emerald-400">Duelo Sechín</h1>
        </div>
      </div>

      {/* Contenedor del juego */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-neutral-800 rounded-xl border border-white/10 p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">¡Duelo Sechín en Desarrollo!</h2>
          <p className="text-neutral-300 mb-6">
            El épico juego de lucha está en construcción. Pronto podrás enfrentarte 
            a guerreros ancestrales en batallas llenas de acción.
          </p>
          <div className="bg-neutral-700 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-3">Características próximas:</h3>
            <ul className="text-left grid grid-cols-2 gap-2 text-sm">
              <li>✅ Combos y movimientos especiales</li>
              <li>✅ Guerrero Sechín vs Invasor</li>
              <li>✅ Sistema de bloqueo y contraataque</li>
              <li>✅ Física realista de lucha</li>
              <li>✅ Gráficos estilo cultural andino</li>
              <li>✅ Múltiples niveles de dificultad</li>
            </ul>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="mt-6 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-neutral-900 font-semibold rounded-lg transition"
          >
            Volver al Menú Principal
          </button>
        </div>
      </div>
    </div>
  )
}

export default DueloSechinGame