import React, { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'

const THEME_KEY = 'casma_theme'

export default function App(){
  useEffect(()=>{
    const saved = localStorage.getItem(THEME_KEY) || 'dark'
    document.documentElement.classList.toggle('dark', saved === 'dark')
  },[])
  return <RouterProvider router={router} />
}
