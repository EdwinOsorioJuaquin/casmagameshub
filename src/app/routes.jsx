import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Layout from './layout/Layout'
import Home from '../pages/Home'
import Play from '../pages/Play'
import Achievements from '../pages/Achievements'
import Blueprints from '../pages/Blueprints'   // <-- NUEVO

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/play/:gameId', element: <Play /> },
      { path: '/achievements', element: <Achievements /> },
      { path: '/planos', element: <Blueprints /> },   // <-- NUEVO
    ]
  }
])
