import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getGameById } from '../games'
import { storage } from '../games/core/Storage'

export default function Play(){
  const { gameId } = useParams()
  const nav = useNavigate()
  const ref = useRef(null)
  const [game, setGame] = useState(null)
  const [meta, setMeta] = useState(null)

  useEffect(()=>{
    const m = getGameById(gameId)
    setMeta(m)
    if(!m) return
    let instance
    m.loader().then(GameClass => {
      instance = new GameClass()
      instance.init(ref.current, {
        save: (data)=> storage.set(`games.${gameId}.save`, data),
        onEvent: (ev)=> console.log('event', ev)
      })
      setGame(instance)
    })
    return ()=> { instance?.destroy() }
  }, [gameId])

  useEffect(()=>{
    const onResize = ()=> game?.resize(ref.current.clientWidth, ref.current.clientHeight)
    window.addEventListener('resize', onResize)
    return ()=> window.removeEventListener('resize', onResize)
  }, [game])

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-50">
      <div className="p-3 flex items-center gap-2 border-b border-white/10">
        <button onClick={()=> nav('/')} className="px-3 py-2 rounded-lg border border-white/10">Salir</button>
        <button onClick={()=> game?.pause()} className="px-3 py-2 rounded-lg border border-white/10">Pausa</button>
        <button onClick={()=> game?.resume()} className="px-3 py-2 rounded-lg border border-white/10">Reanudar</button>
        <div className="ml-auto flex items-center gap-3 text-sm text-neutral-400">
          {meta && (<><img src={meta.logo} className="h-6 w-6 rounded"/> <span>{meta.title}</span></>)}
        </div>
      </div>
      <div ref={ref} className="w-full h-[calc(100vh-56px)]" />
    </div>
  )
}
