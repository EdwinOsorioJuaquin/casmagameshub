import React from 'react'
import { Outlet } from 'react-router-dom'

export default function Layout(){
  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-50">
      <Outlet />
    </div>
  )
}