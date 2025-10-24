import React from 'react'
import { GAMES } from '../games'

const TOP5 = ['duelo-sechin','rally-casma','guardianes-chankillo','tesoro-chankillo','cosecha-del-valle']

function Box({ title, children }){
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-3 grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/10 bg-neutral-900 h-52 flex items-center justify-center overflow-hidden">
          {children[0]}
        </div>
        <div className="space-y-2 text-sm text-neutral-300">{children[1]}</div>
      </div>
    </section>
  )
}

export default function Blueprints(){
  const items = GAMES.filter(g => TOP5.includes(g.id))
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold">Planos de Juego (Top 5)</h2>
      <p className="text-neutral-400 mt-1">Vista previa de mecánicas, controles y bucle principal.</p>

      <div className="mt-6 space-y-6">
        {/* Duelo Sechín */}
        {items.map(g => g.id === 'duelo-sechin' && (
          <Box key={g.id} title={`${g.title} — ${g.type}`}>
            {[
              <div key="mockup" className="w-full h-full bg-gradient-to-br from-yellow-900 via-amber-800 to-stone-900 relative">
                {/* Arena */}
                <div className="absolute bottom-0 w-full h-16 bg-stone-700 border-t-2 border-amber-500"></div>
                
                {/* Personaje izquierda */}
                <div className="absolute left-20 bottom-16">
                  <div className="w-12 h-20 bg-red-600 rounded-t-lg relative">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-3 bg-red-700 rounded-full"></div>
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-amber-300"></div>
                  </div>
                  <div className="text-xs text-white mt-1 text-center">Guerrero Sechín</div>
                </div>
                
                {/* Personaje derecha */}
                <div className="absolute right-20 bottom-16">
                  <div className="w-12 h-20 bg-blue-600 rounded-t-lg relative">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-3 bg-blue-700 rounded-full"></div>
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-amber-300"></div>
                  </div>
                  <div className="text-xs text-white mt-1 text-center">Invasor</div>
                </div>
                
                {/* Barra de vida */}
                <div className="absolute top-4 left-4 right-4 flex justify-between">
                  <div className="w-32 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-32 h-3 bg-blue-500 rounded-full"></div>
                </div>
                
                {/* Efecto de golpe */}
                <div className="absolute left-32 bottom-24 w-8 h-8 bg-yellow-400 rounded-full opacity-70"></div>
              </div>,
              <ul key="details" className="list-disc list-inside">
                <li><b>Cámara:</b> Lateral 2D estilo fighting game</li>
                <li><b>Core loop:</b> Moverse, saltar, encadenar combos (L,L,H), manejar distancia; vencer por KO o tiempo</li>
                <li><b>Controles:</b> A/D mover, SPACE saltar, F golpe rápido, G golpe pesado, H bloqueo</li>
                <li><b>Sistemas avanzados:</b> Hitstun, knockback, hitstop, cancels, IA adaptable (fácil/medio/difícil)</li>
                <li><b>Progresión:</b> Desbloqueo de personajes, skins culturales, ranking local</li>
                <li><b>Arte:</b> Spritesheet animado estilo guerreros Sechín con detalles arqueológicos</li>
              </ul>
            ]}
          </Box>
        ))}

        {/* Rally Casma */}
        {items.map(g => g.id === 'rally-casma' && (
          <Box key={g.id} title={`${g.title} — ${g.type}`}>
            {[
              <div key="mockup" className="w-full h-full bg-gradient-to-br from-emerald-900 via-green-800 to-lime-900 relative overflow-hidden">
                {/* Camino */}
                <div className="absolute inset-0 bg-green-900">
                  <div className="absolute top-1/2 left-0 right-0 h-8 bg-gray-700 transform -translate-y-1/2">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-yellow-300 transform -translate-y-1/2 dashed-border"></div>
                  </div>
                </div>
                
                {/* Auto del jugador */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                  <div className="w-16 h-8 bg-red-500 rounded-lg relative">
                    <div className="absolute -top-2 left-2 right-2 h-2 bg-red-600 rounded-t-lg"></div>
                    <div className="absolute top-1 left-1 right-1 h-4 bg-red-300 rounded-sm"></div>
                  </div>
                </div>
                
                {/* Auto rival */}
                <div className="absolute top-12 right-12">
                  <div className="w-12 h-6 bg-blue-500 rounded-lg"></div>
                </div>
                
                {/* Paisaje */}
                <div className="absolute top-4 left-4 w-8 h-8 bg-green-600 rounded-full"></div>
                <div className="absolute top-8 right-8 w-6 h-6 bg-green-600 rounded-full"></div>
                
                {/* UI */}
                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs p-1 rounded">
                  VEL: 120 km/h
                </div>
                <div className="absolute top-2 right-2 bg-black/50 text-white text-xs p-1 rounded">
                  NITRO: ████
                </div>
              </div>,
              <ul key="details" className="list-disc list-inside">
                <li><b>Cámara:</b> Vista top-down perspectiva 3/4</li>
                <li><b>Core loop:</b> Vueltas con checkpoints, usar nitro estratégicamente, evitar colisiones</li>
                <li><b>Controles:</b> ←→ direccion, ↑ acelerar, ↓ frenar, SPACE nitro, SHIFT derrape</li>
                <li><b>Sistemas:</b> Física de vehículos realista, IA rivales con personalidades, condiciones climáticas</li>
                <li><b>Progresión:</b> Desbloqueo de vehículos, mejoras, circuitos secretos</li>
                <li><b>Arte:</b> Low-poly con landmarks de Casma, efectos de partículas para polvo/nitro</li>
              </ul>
            ]}
          </Box>
        ))}

        {/* Guardianes de Chankillo */}
        {items.map(g => g.id === 'guardianes-chankillo' && (
          <Box key={g.id} title={`${g.title} — ${g.type}`}>
            {[
              <div key="mockup" className="w-full h-full bg-gradient-to-br from-amber-900 via-orange-800 to-yellow-900 relative">
                {/* Torreones */}
                <div className="absolute bottom-4 left-4 w-10 h-16 bg-stone-600 rounded-t-lg border-t-2 border-amber-400">
                  <div className="absolute top-1 left-1 right-1 h-3 bg-amber-300 rounded-sm"></div>
                </div>
                <div className="absolute bottom-4 left-20 w-8 h-12 bg-stone-500 rounded-t-lg"></div>
                <div className="absolute bottom-4 right-20 w-10 h-14 bg-stone-600 rounded-t-lg"></div>
                <div className="absolute bottom-4 right-4 w-12 h-18 bg-stone-700 rounded-t-lg border-t-2 border-amber-400">
                  <div className="absolute top-1 left-1 right-1 h-3 bg-amber-300 rounded-sm"></div>
                </div>
                
                {/* Enemigos */}
                <div className="absolute bottom-8 left-32">
                  <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                </div>
                <div className="absolute bottom-12 left-40">
                  <div className="w-5 h-5 bg-red-500 rounded-full"></div>
                </div>
                <div className="absolute bottom-16 left-36">
                  <div className="w-7 h-7 bg-red-600 rounded-full"></div>
                </div>
                
                {/* Proyectiles */}
                <div className="absolute left-16 bottom-20 w-3 h-3 bg-yellow-300 rounded-full"></div>
                <div className="absolute right-16 bottom-24 w-4 h-4 bg-yellow-400 rounded-full"></div>
                
                {/* Recursos */}
                <div className="absolute top-4 left-4 bg-black/50 text-white text-xs p-1 rounded">
                  ORO: 150
                </div>
                <div className="absolute top-4 right-4 bg-black/50 text-white text-xs p-1 rounded">
                  OLEADA: 3/10
                </div>
                
                {/* Sol */}
                <div className="absolute top-8 right-8 w-12 h-12 bg-yellow-400 rounded-full"></div>
              </div>,
              <ul key="details" className="list-disc list-inside">
                <li><b>Cámara:</b> 2D isométrico con scroll táctico</li>
                <li><b>Core loop:</b> Colocar y mejorar torres, gestionar recursos, sobrevivir oleadas crecientes</li>
                <li><b>Controles:</b> Mouse drag & drop, teclas rápidas 1-5 para torres, espacio pausa/avance rápido</li>
                <li><b>Sistemas:</b> Economía balanceada, árbol de mejoras, efectos solares según hora del día</li>
                <li><b>Progresión:</b> 13 niveles (uno por torreón), modos infinito y desafío</li>
                <li><b>Arte:</b> Estilo arqueológico con jeroglíficos, UI con motivos astronómicos incas</li>
              </ul>
            ]}
          </Box>
        ))}

        {/* Tesoro en Chankillo */}
        {items.map(g => g.id === 'tesoro-chankillo' && (
          <Box key={g.id} title={`${g.title} — ${g.type}`}>
            {[
              <div key="mockup" className="w-full h-full bg-gradient-to-br from-lime-900 via-green-800 to-emerald-900 relative">
                {/* Mapa */}
                <div className="absolute inset-4 bg-green-800 rounded-lg border-2 border-amber-600">
                  {/* Senderos */}
                  <div className="absolute top-8 left-8 right-8 h-1 bg-amber-300"></div>
                  <div className="absolute top-16 left-16 bottom-16 w-1 bg-amber-300"></div>
                  
                  {/* Puntos de interés */}
                  <div className="absolute top-6 left-6 w-4 h-4 bg-yellow-400 rounded-full"></div>
                  <div className="absolute top-6 right-6 w-4 h-4 bg-blue-400 rounded-full"></div>
                  <div className="absolute bottom-6 left-6 w-4 h-4 bg-red-400 rounded-full"></div>
                  <div className="absolute bottom-6 right-6 w-4 h-4 bg-purple-400 rounded-full"></div>
                  
                  {/* Jugador */}
                  <div className="absolute top-14 left-14 w-6 h-6 bg-white rounded-full border-2 border-green-700"></div>
                  
                  {/* Acertijo solar */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-12 h-12 bg-amber-500 rounded-full relative">
                      <div className="absolute top-1/2 left-1/2 w-8 h-1 bg-amber-700 transform -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                  </div>
                </div>
                
                {/* Inventario */}
                <div className="absolute bottom-2 left-2 right-2 h-8 bg-black/50 rounded flex gap-1 p-1">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="flex-1 bg-green-700 rounded border border-amber-400"></div>
                  ))}
                </div>
                
                {/* Diálogo */}
                <div className="absolute top-2 left-2 right-2 bg-black/70 text-white text-xs p-2 rounded">
                  Alinea las sombras con el solsticio...
                </div>
              </div>,
              <ul key="details" className="list-disc list-inside">
                <li><b>Cámara:</b> 2D perspectiva aventura gráfica con múltiples escenas</li>
                <li><b>Core loop:</b> Explorar, recolectar pistas, resolver acertijos astronómicos, desbloquear áreas</li>
                <li><b>Controles:</b> WASD movimiento, E interactuar, I inventario, M mapa, ESPACIO acelerar diálogo</li>
                <li><b>Sistemas:</b> Mecánica de sombras/sol, inventario de artefactos, sistema de pistas contextuales</li>
                <li><b>Progresión:</b> Historia no lineal, múltiples finales según acertijos resueltos</li>
                <li><b>Arte:</b> Ilustración digital estilo arqueológico, animaciones suaves de transición</li>
              </ul>
            ]}
          </Box>
        ))}

        {/* Cosecha del Valle */}
        {items.map(g => g.id === 'cosecha-del-valle' && (
          <Box key={g.id} title={`${g.title} — ${g.type}`}>
            {[
              <div key="mockup" className="w-full h-full bg-gradient-to-br from-green-900 via-lime-800 to-emerald-900 relative">
                {/* Terreno de cultivo */}
                <div className="absolute inset-4 bg-green-700 rounded-lg grid grid-cols-3 grid-rows-2 gap-2 p-2">
                  {/* Parcelas */}
                  <div className="bg-green-600 rounded border border-green-800 relative">
                    <div className="absolute inset-1 bg-yellow-600 rounded"></div>
                    <div className="absolute top-1 left-1 right-1 h-1 bg-green-300 rounded-full"></div>
                  </div>
                  <div className="bg-green-600 rounded border border-green-800 relative">
                    <div className="absolute inset-1 bg-brown-600 rounded">
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-3 bg-green-400"></div>
                    </div>
                  </div>
                  <div className="bg-green-600 rounded border border-green-800 relative">
                    <div className="absolute inset-1 bg-brown-600 rounded">
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-500 rounded-t-full"></div>
                    </div>
                  </div>
                  
                  <div className="bg-green-600 rounded border border-green-800"></div>
                  <div className="bg-green-600 rounded border border-green-800 relative">
                    <div className="absolute inset-1 bg-blue-400 rounded"></div>
                  </div>
                  <div className="bg-green-600 rounded border border-green-800"></div>
                </div>
                
                {/* Río */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-blue-500"></div>
                
                {/* UI */}
                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs p-1 rounded">
                  $ 1,250
                </div>
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs p-1 rounded">
                  DÍA 15
                </div>
                
                {/* Herramientas */}
                <div className="absolute bottom-2 left-2 right-2 flex justify-center gap-2">
                  <div className="w-6 h-6 bg-gray-400 rounded"></div>
                  <div className="w-6 h-6 bg-blue-400 rounded"></div>
                  <div className="w-6 h-6 bg-yellow-400 rounded"></div>
                </div>
                
                {/* Sol */}
                <div className="absolute top-6 right-6 w-8 h-8 bg-yellow-400 rounded-full"></div>
              </div>,
              <ul key="details" className="list-disc list-inside">
                <li><b>Cámara:</b> Isométrico 2D con zoom adaptable</li>
                <li><b>Core loop:</b> Planificar cultivos, gestionar riego, cosechar y vender en mercado</li>
                <li><b>Controles:</b> Mouse para selección y acciones, teclas 1-4 herramientas, ESPACIO pausa</li>
                <li><b>Sistemas:</b> Estaciones y clima, economía de oferta/demanda, sistema de riego realista</li>
                <li><b>Progresión:</b> Expansión de tierras, tecnología agrícola, relaciones con comerciantes</li>
                <li><b>Arte:</b> Pixel art detallado, animaciones de crecimiento, efectos climáticos dinámicos</li>
              </ul>
            ]}
          </Box>
        ))}
      </div>
    </div>
  )
}