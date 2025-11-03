import React from 'react'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className="min-h-screen bg-neutral-900">
      <Outlet />  {/* 👈 Esto renderiza las páginas hijas */}
    </div>
  )
}

export default Layout