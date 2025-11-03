import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Layout from './layout/Layout'
import Home from '../pages/Home'
import Play from '../pages/Play'
import Achievements from '../pages/Achievements'
import Blueprints from '../pages/Blueprints'
import DueloSechin from '../pages/DueloSechin'

// Componentes de juego SIMPLES

function RallyCasma() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-cyan-900 text-white p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-4">🏎️ Rally Casma</h1>
        <p className="text-xl mb-8">Carreras por los valles de Casma</p>
        <div className="bg-black/30 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">¡Jugando Rally Casma!</h2>
          <p className="mb-4">El juego está funcionando correctamente ✅</p>
        </div>
        <a href="/" className="inline-block px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition text-lg">
          ← Volver al Inicio
        </a>
      </div>
    </div>
  )
}

function GuardianesChankillo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-emerald-900 text-white p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-4">🏰 Guardianes de Chankillo</h1>
        <p className="text-xl mb-8">Defiende los torreones ancestrales</p>
        <a href="/" className="inline-block px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition text-lg">
          ← Volver al Inicio
        </a>
      </div>
    </div>
  )
}

function TesoroChankillo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-pink-900 text-white p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-4">🧩 Tesoro en Chankillo</h1>
        <p className="text-xl mb-8">Descubre misterios ancestrales</p>
        <a href="/" className="inline-block px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition text-lg">
          ← Volver al Inicio
        </a>
      </div>
    </div>
  )
}

function CosechaValle() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-900 to-orange-900 text-white p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-4">🌾 Cosecha del Valle</h1>
        <p className="text-xl mb-8">Cultiva en el valle de Casma</p>
        <a href="/" className="inline-block px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition text-lg">
          ← Volver al Inicio
        </a>
      </div>
    </div>
  )
}

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/play/:gameId', element: <Play /> },
      { path: '/achievements', element: <Achievements /> },
      { path: '/planos', element: <Blueprints /> },
      
      // 👇 AÑADE TODAS LAS RUTAS DE JUEGOS DIRECTAMENTE
      { path: '/duelo-sechin', element: <DueloSechin /> },
      { path: '/rally-casma', element: <RallyCasma /> },
      { path: '/guardianes-chankillo', element: <GuardianesChankillo /> },
      { path: '/tesoro-chankillo', element: <TesoroChankillo /> },
      { path: '/cosecha-valle', element: <CosechaValle /> },
    ]
  }
])