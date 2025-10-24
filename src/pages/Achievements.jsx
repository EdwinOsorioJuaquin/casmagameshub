import React from 'react'
import { storage } from '../games/core/Storage'

export default function Achievements(){
  const saves = Object.entries(localStorage).filter(([k])=> k.startsWith('casma.games.'))
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">Logros</h2>
      {saves.length===0 ? <p className="text-neutral-400">Juega para desbloquear logros…</p> : (
        <ul className="space-y-3">
          {saves.map(([k,v])=>{
            const data = JSON.parse(v)
            return <li key={k} className="p-4 rounded-xl border border-white/10 bg-white/5">
              <div className="text-sm text-neutral-400">{k}</div>
              <pre className="text-xs whitespace-pre-wrap mt-2">{JSON.stringify(data,null,2)}</pre>
            </li>
          })}
        </ul>
      )}
    </div>
  )
}