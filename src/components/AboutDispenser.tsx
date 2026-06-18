import { useState, useEffect } from 'react';
import { Sparkles, Droplet, Zap, Gauge, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AboutDispenser() {
  const [dispensing, setDispensing] = useState(false);
  const [fillLevel, setFillLevel] = useState(0);
  const [tds, setTds] = useState(12);
  const [temp, setTemp] = useState(6);
  const [viewMode, setViewMode] = useState<'standard' | 'filters'>('standard');

  useEffect(() => {
    let interval: any;
    if (dispensing) {
      interval = setInterval(() => {
        setFillLevel((prev) => {
          if (prev >= 100) {
            setDispensing(false);
            return 100;
          }
          return prev + 5;
        });
      }, 100);
    } else {
      // Slow drain over time if full and inactive
      if (fillLevel === 100) {
        const timeout = setTimeout(() => {
          const drain = setInterval(() => {
            setFillLevel((prev) => {
              if (prev <= 0) {
                clearInterval(drain);
                return 0;
              }
              return prev - 8;
            });
          }, 50);
        }, 1500);
        return () => clearTimeout(timeout);
      }
    }
    return () => clearInterval(interval);
  }, [dispensing, fillLevel]);

  // Micro-fluctuations for high-tech readouts
  useEffect(() => {
    const cycle = setInterval(() => {
      setTds((prev) => {
        const diff = Math.random() > 0.5 ? 1 : -1;
        const next = prev + diff;
        return next < 8 ? 8 : next > 14 ? 14 : next;
      });
      setTemp((prev) => {
        const diff = Math.random() > 0.5 ? 0.1 : -0.1;
        const next = prev + diff;
        return next < 5.0 ? 5.0 : next > 7.0 ? 7.0 : parseFloat(next.toFixed(1));
      });
    }, 3000);
    return () => clearInterval(cycle);
  }, []);

  const handleDispense = () => {
    if (fillLevel >= 100) {
      setFillLevel(0);
    }
    setDispensing(true);
  };

  return (
    <div className="relative w-full max-w-md mx-auto aspect-[3/4] bg-radial from-slate-900 via-slate-950 to-black rounded-3xl p-6 border border-slate-800 shadow-2xl shadow-cyan-950/40 overflow-hidden flex flex-col items-center justify-between">
      {/* Glow highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

      {/* Mode selectors */}
      <div className="flex bg-slate-900 border border-slate-800 rounded-full p-0.5 z-10 w-full max-w-[280px]">
        <button
          onClick={() => setViewMode('standard')}
          className={`flex-1 py-1.5 px-3 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 ${
            viewMode === 'standard' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          MAQUETA 3D
        </button>
        <button
          onClick={() => setViewMode('filters')}
          className={`flex-1 py-1.5 px-3 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 ${
            viewMode === 'filters' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          FILTRADO INTERNO
        </button>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'standard' ? (
          <motion.div
            key="std"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex-1 w-full flex flex-col items-center justify-center relative mt-4"
          >
            {/* The Machine Body */}
            <div className="w-56 h-80 bg-linear-to-b from-slate-700 via-slate-800 to-slate-950 rounded-2xl border-2 border-slate-600 shadow-inner flex flex-col justify-start items-center p-3 relative overflow-hidden">
              {/* Brushed metal accent lines */}
              <div className="absolute inset-y-0 left-2 w-[1px] bg-slate-500/20" />
              <div className="absolute inset-y-0 right-2 w-[1px] bg-slate-500/20" />

              {/* Holographic Glowing display Panel */}
              <div className="w-full h-24 bg-slate-950 rounded-xl border border-slate-700 p-2 flex flex-col justify-between items-center relative overflow-hidden shadow-lg shadow-cyan-500/10">
                {/* Cyber scanner overlay */}
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none animate-pulse" />
                <div className="flex justify-between w-full text-[10px] items-center text-cyan-400/80 font-mono">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 animate-spin duration-3000" /> ALIENWATER IoT
                  </span>
                  <span className="px-1 bg-cyan-950/50 border border-cyan-800 text-cyan-300 rounded-sm">V1.9</span>
                </div>

                {/* Display metric row / Dispensing status */}
                {!dispensing && fillLevel === 0 ? (
                  <div className="flex justify-around items-center w-full mt-1 font-mono">
                    <div className="text-center">
                      <div className="text-slate-500 text-[8px] uppercase tracking-wider">Flujo</div>
                      <div className="text-xs font-bold text-slate-100 flex items-center justify-center gap-0.5">
                        <Droplet className="w-3.5 h-3.5 text-slate-500" />
                        0.0L/m
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-slate-500 text-[8px] uppercase tracking-wider">Pureza</div>
                      <div className="text-xs font-bold text-cyan-400">{tds} <span className="text-[8px] text-slate-400">PPM</span></div>
                    </div>

                    <div className="text-center">
                      <div className="text-slate-500 text-[8px] uppercase tracking-wider">Temp</div>
                      <div className="text-xs font-bold text-emerald-400">{temp}°C</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center w-full mt-1 font-mono">
                    <div className="text-cyan-400 text-xs font-bold animate-pulse">
                      {fillLevel === 100 ? 'LLENADO COMPLETADO' : 'DESPACHANDO AGUA...'}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">Llenando Botellón de 20L ({fillLevel}%)</div>
                  </div>
                )}

                {/* Micro graphical readout */}
                <div className="w-full h-1.5 bg-slate-900 rounded-full mt-1 overflow-hidden relative flex items-center">
                  <div
                    className="h-full bg-linear-to-r from-emerald-500 to-cyan-400 transition-all duration-300"
                    style={{ width: `${fillLevel}%` }}
                  />
                </div>
              </div>

              {/* Dispensation Alcove */}
              <div className="w-44 h-40 bg-radial from-slate-950 to-slate-900 border border-slate-700/60 rounded-xl mt-4 relative flex flex-col justify-end items-center p-2 shadow-inner">
                {/* Embedded dynamic Blue Ambient Light inside alcove */}
                <div className={`absolute top-0 inset-x-0 h-6 blur-md transition-all duration-300 ${dispensing ? 'bg-cyan-500/50' : 'bg-cyan-500/10'}`} />

                {/* Chromium nozzle */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-5 bg-linear-to-b from-slate-500 to-slate-400 border border-slate-600 rounded-b-md flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
                </div>

                {/* Animated dispensing water stream */}
                {dispensing && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    className="absolute top-5 bottom-8 w-1 bg-linear-to-b from-cyan-400/90 to-cyan-300/40 rounded-full blur-[1px] origin-top z-10"
                  />
                )}

                {/* Water Container: Permanent 20L Water Jug (Botellón) - Custom Unique Model */}
                <svg viewBox="0 0 100 150" className="w-24 h-32 relative z-0">
                  <defs>
                    <clipPath id="jug-body-clip">
                      <path d="M 43 12 L 57 12 L 57 32 C 67 36 75 42 75 52 L 75 135 C 75 144 64 147 50 147 C 36 147 25 144 25 135 L 25 52 C 25 42 33 36 43 32 Z" />
                    </clipPath>
                    <linearGradient id="water-fill-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.7" />
                    </linearGradient>
                    <linearGradient id="bottle-glass-grad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="rgba(255, 255, 255, 0.08)" />
                      <stop offset="20%" stopColor="rgba(255, 255, 255, 0.18)" />
                      <stop offset="50%" stopColor="rgba(255, 255, 255, 0.03)" />
                      <stop offset="80%" stopColor="rgba(255, 255, 255, 0.18)" />
                      <stop offset="100%" stopColor="rgba(255, 255, 255, 0.08)" />
                    </linearGradient>
                  </defs>

                  {/* Main Bottle Body Contour */}
                  <path 
                    d="M 43 12 L 57 12 L 57 32 C 67 36 75 42 75 52 L 75 135 C 75 144 64 147 50 147 C 36 147 25 144 25 135 L 25 52 C 25 42 33 36 43 32 Z" 
                    fill="url(#bottle-glass-grad)" 
                    stroke="rgba(255, 255, 255, 0.25)" 
                    strokeWidth="2"
                  />

                  {/* Water Liquid Layer (clipped inside body) */}
                  <rect 
                    x="0" 
                    y={147 - (fillLevel * 1.35)} 
                    width="100" 
                    height="150" 
                    fill="url(#water-fill-grad)" 
                    clipPath="url(#jug-body-clip)"
                    className="transition-all duration-200"
                  />

                  {/* Horizontal reinforcing ribs/ridges across the body (like in the photo) */}
                  <path d="M 25 58 Q 50 61 75 58" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none" />
                  <path d="M 25 70 Q 50 73 75 70" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none" />
                  <path d="M 25 82 Q 50 85 75 82" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none" />
                  <path d="M 25 94 Q 50 97 75 94" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none" />
                  <path d="M 25 106 Q 50 109 75 106" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none" />
                  <path d="M 25 118 Q 50 121 75 118" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none" />

                  {/* Outer Blue Handle on the right side */}
                  <path 
                    d="M 74 55 C 80 55 83 58 83 65 L 83 115 C 83 122 80 125 74 125 L 74 116 C 77 116 79 114 79 110 L 79 70 C 79 66 77 64 74 64 Z" 
                    fill="#1d4ed8" 
                    stroke="#1e3a8a" 
                    strokeWidth="0.5" 
                  />

                  {/* Neck/Spout details */}
                  <rect x="43" y="12" width="14" height="20" fill="rgba(29, 78, 216, 0.4)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
                  <line x1="43" y1="18" x2="57" y2="18" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                  <line x1="43" y1="24" x2="57" y2="24" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />

                  {/* Label text */}
                  <text x="50" y="94" textAnchor="middle" className="fill-slate-300/80 font-sans text-[11px] font-black tracking-wider pointer-events-none drop-shadow-md select-none">20L</text>
                </svg>
              </div>

              {/* Tap control action label */}
              <span className="text-[9px] text-slate-400/80 font-mono mt-2 absolute bottom-2">UNIDAD AUTOMATIZADA CON IoT</span>
            </div>

            {/* Interactivity prompt */}
            <div className="absolute -bottom-4 flex flex-col items-center">
              <button
                onClick={handleDispense}
                disabled={dispensing}
                className={`py-2 px-6 rounded-full text-xs font-bold tracking-wider transition-all duration-300 flex items-center gap-2 ${
                  dispensing
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/40 scale-100 hover:scale-105 active:scale-95'
                }`}
              >
                <Droplet className={`w-4 h-4 ${dispensing ? 'animate-bounce' : ''}`} />
                {fillLevel === 100 ? 'REINICIAR SERVICIO' : dispensing ? 'DESPACHANDO AGUA...' : 'PROBAR DISPENSADOR'}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="fil"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex-1 w-full flex flex-col justify-center space-y-4 py-4"
          >
            {/* High-tech purification stages layout */}
            <div className="space-y-3 font-sans">
              <div className="text-center font-bold text-sm text-cyan-300 tracking-wide uppercase mb-2">
                Sistema de Purificación de 5 Etapas
              </div>

              {/* StageCard 1 */}
              <div className="flex items-center gap-3 p-2 bg-slate-900/60 rounded-xl border border-cyan-500/10">
                <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-300 text-xs font-bold shrink-0">
                  1
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">Filtro de Sedimento de Polipropileno</div>
                  <div className="text-[10px] text-slate-400">Elimina partículas en suspensión, arena y óxido mayor a 5 micras.</div>
                </div>
              </div>

              {/* StageCard 2 */}
              <div className="flex items-center gap-3 p-2 bg-slate-900/60 rounded-xl border border-cyan-500/10">
                <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-300 text-xs font-bold shrink-0">
                  2
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">Filtro de Carbón Activado Block</div>
                  <div className="text-[10px] text-slate-400">Absorbe el cloro residual, malos olores, compuestos orgánicos complejos.</div>
                </div>
              </div>

              {/* StageCard 3 */}
              <div className="flex items-center gap-3 p-2 bg-slate-900/60 rounded-xl border border-cyan-500/10">
                <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-300 text-xs font-bold shrink-0">
                  3
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">Membrana de Ósmosis Inversa</div>
                  <div className="text-[10px] text-slate-400">Filtrado nanométrico que retiene metales pesados, bacterias y patógenos.</div>
                </div>
              </div>

              {/* StageCard 4 */}
              <div className="flex items-center gap-3 p-2 bg-slate-900/60 rounded-xl border border-cyan-500/10">
                <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-300 text-xs font-bold shrink-0">
                  4
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">Post-Carbón de Cáscara de Coco</div>
                  <div className="text-[10px] text-slate-400">Acondiciona el sabor para un perfil mineral premium muy refrescante.</div>
                </div>
              </div>

              {/* StageCard 5 */}
              <div className="flex items-center gap-3 p-2 bg-slate-900/60 rounded-xl border border-cyan-500/10">
                <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-300 text-xs font-bold shrink-0">
                  5
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">Esterilización Ultravioleta (UV)</div>
                  <div className="text-[10px] text-slate-400">Mantiene el agua purificada de manera estéril y libre de virus 24/7.</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicators bottom bar */}
      {!dispensing && fillLevel === 0 ? (
        <div className="w-full flex justify-between text-slate-500 text-[10px] font-mono border-t border-slate-900 pt-3">
          <span className="flex items-center gap-1"><Gauge className="w-3.5 h-3.5" /> Presión: 4.8 Bar</span>
          <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> Consumo: Eficiente</span>
        </div>
      ) : (
        <div className="w-full flex justify-center text-cyan-500 text-[10px] font-mono border-t border-slate-900 pt-3 animate-pulse">
          <span>Sincronizando telemetría IoT...</span>
        </div>
      )}
    </div>
  );
}
