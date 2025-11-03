import React from 'react'
import { useNavigate } from 'react-router-dom'

const GuardianesChankillo = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/')}
          className="mb-6 px-4 py-2 bg-emerald-500 rounded-lg hover:bg-emerald-400 transition"
        >
          ← Volver al Inicio
        </button>
        <h1 className="text-4xl font-bold text-center mb-8">Guardianes de Chankillo</h1>
        <div className="bg-neutral-800 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">¡Defensa Estratégica!</h2>
          <p className="text-neutral-300">Protege los torreones ancestrales.</p>
        </div>
      </div>
    </div>
  )
}

export default GuardianesChankillo