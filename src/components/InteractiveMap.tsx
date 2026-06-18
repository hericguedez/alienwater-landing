import { useState, useEffect } from 'react';
import { CityData } from '../types';
import { MapPin, CheckCircle, TrendingUp, Sparkles, Building2, Droplets } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const INITIAL_CITIES: CityData[] = [
  {
    id: 'ccs',
    name: 'Caracas (Sede Principal)',
    coordinates: { x: 580, y: 150 },
    machinesCount: 38,
    litersToday: 18240,
    activeStatus: 'Operación Óptima',
    statusColor: 'text-emerald-400',
    revenueToday: 4560,
  },
  {
    id: 'mcbo',
    name: 'Maracaibo',
    coordinates: { x: 260, y: 140 },
    machinesCount: 22,
    litersToday: 11400,
    activeStatus: 'Operación Óptima',
    statusColor: 'text-emerald-400',
    revenueToday: 2850,
  },
  {
    id: 'val',
    name: 'Valencia',
    coordinates: { x: 490, y: 170 },
    machinesCount: 19,
    litersToday: 8930,
    activeStatus: 'Operación Óptima',
    statusColor: 'text-emerald-400',
    revenueToday: 2232,
  },
  {
    id: 'barq',
    name: 'Barquisimeto',
    coordinates: { x: 410, y: 180 },
    machinesCount: 15,
    litersToday: 7200,
    activeStatus: 'Mantenimiento Programado',
    statusColor: 'text-amber-400',
    revenueToday: 1800,
  },
  {
    id: 'sc',
    name: 'San Cristóbal',
    coordinates: { x: 180, y: 320 },
    machinesCount: 8,
    litersToday: 3840,
    activeStatus: 'Operación Óptima',
    statusColor: 'text-emerald-400',
    revenueToday: 960,
  },
  {
    id: 'plc',
    name: 'Puerto La Cruz',
    coordinates: { x: 690, y: 175 },
    machinesCount: 12,
    litersToday: 5900,
    activeStatus: 'Operación Óptima',
    statusColor: 'text-emerald-400',
    revenueToday: 1475,
  },
  {
    id: 'mat',
    name: 'Maturín',
    coordinates: { x: 790, y: 210 },
    machinesCount: 10,
    litersToday: 4800,
    activeStatus: 'Operación Óptima',
    statusColor: 'text-emerald-400',
    revenueToday: 1200,
  },
  {
    id: 'pzo',
    name: 'Puerto Ordaz',
    coordinates: { x: 740, y: 340 },
    machinesCount: 14,
    litersToday: 6980,
    activeStatus: 'Operación Óptima',
    statusColor: 'text-emerald-400',
    revenueToday: 1745,
  },
];

export default function InteractiveMap() {
  const [selectedCity, setSelectedCity] = useState<CityData | null>(INITIAL_CITIES[0]);
  const [cities, setCities] = useState<CityData[]>(INITIAL_CITIES);

  // Simulate updating water sales telemetry in real-time
  useEffect(() => {
    const telemetry = setInterval(() => {
      setCities((prevCities) =>
        prevCities.map((city) => {
          // Add random liters dispensed (1-5 liters)
          const addedLiters = Math.floor(Math.random() * 4) + 1;
          const updatedLiters = city.litersToday + addedLiters;
          const updatedRevenue = Number((updatedLiters * 0.25).toFixed(0)); // assume $0.25 USD per liter

          const newCity = {
            ...city,
            litersToday: updatedLiters,
            revenueToday: updatedRevenue,
          };

          // If this city is currently selected, update its view too
          if (selectedCity && selectedCity.id === city.id) {
            setSelectedCity(newCity);
          }

          return newCity;
        })
      );
    }, 4000);

    return () => clearInterval(telemetry);
  }, [selectedCity]);

  return (
    <div className="w-full bg-slate-900 border border-slate-800/80 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
      {/* Background cyber grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Side: Stats and Info Box */}
        <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-6">
          <div>
            <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> Expansión Geográfica
            </span>
            <h3 className="text-hd text-2xl lg:text-3xl font-extrabold tracking-tight text-white mb-3">
              Presencia Alienwater en Venezuela
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Monitoreamos en tiempo real la red de expendedores inteligentes de agua en el territorio nacional. Selecciona una ciudad en el mapa interactivo para ver estadísticas de consumo locales.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {selectedCity ? (
              <motion.div
                key={selectedCity.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.25 }}
                className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 backdrop-blur-md shadow-lg"
              >
                <div className="flex justify-between items-start border-b border-slate-800 pb-3 mb-4">
                  <div>
                    <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                      <MapPin className="w-4.5 h-4.5 text-cyan-400 shrink-0" />
                      {selectedCity.name}
                    </h4>
                    <span className="text-xs text-slate-400 block mt-0.5 font-mono">
                      Estado: <span className={selectedCity.statusColor}>{selectedCity.activeStatus}</span>
                    </span>
                  </div>
                  <div className="bg-cyan-950/40 border border-cyan-800 text-cyan-300 text-[10px] font-bold font-mono px-2 py-0.5 rounded-full uppercase">
                    IoT ACTIVO
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/40">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">
                      Máquinas Activas
                    </span>
                    <span className="text-2xl font-black text-slate-200 mt-1 block flex items-center gap-1.5">
                      <Building2 className="w-5 h-5 text-cyan-400/80" />
                      {selectedCity.machinesCount}
                    </span>
                  </div>

                  <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/40">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">
                      Litros Hoy
                    </span>
                    <span className="text-2xl font-black text-slate-200 mt-1 block flex items-center gap-1.5">
                      <Droplets className="w-5 h-5 text-blue-400" />
                      {selectedCity.litersToday.toLocaleString()} L
                    </span>
                  </div>

                  <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/40 col-span-2 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">
                        Venta Acumulada
                      </span>
                      <span className="text-xl font-bold text-emerald-400 mt-0.5 block flex items-center gap-1">
                        <TrendingUp className="w-4.5 h-4.5 text-emerald-400" />
                        ${selectedCity.revenueToday.toLocaleString()} USD
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-400/80 px-2 py-1 bg-emerald-950/20 border border-emerald-900/40 rounded-lg font-bold font-mono">
                      +100% Autónomo
                    </span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-slate-950/40 p-6 rounded-2xl border border-dashed border-slate-800 text-center text-slate-500 text-sm">
                Haz clic en cualquier nodo del mapa para desplegar mediciones.
              </div>
            )}
          </AnimatePresence>

          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950/40 border border-slate-850 px-3 py-1.5 rounded-full font-mono">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse inline-block" />
              98.2% Uptime Nacional
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950/40 border border-slate-850 px-3 py-1.5 rounded-full font-mono">
              <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
              Certificado SENCAMER
            </div>
          </div>
        </div>

        {/* Right Side: Beautiful SVG Interactive Map of Venezuela */}
        <div className="lg:col-span-8 flex justify-center items-center relative py-4 lg:py-8">
          <div className="relative w-full max-w-[650px] aspect-[1.3/1] bg-slate-950/30 border border-slate-850 rounded-2xl p-4 lg:p-6 overflow-hidden shadow-inner">
            {/* Compass / High-tech aesthetic details */}
            <div className="absolute top-4 left-4 w-12 h-12 border border-slate-800/80 rounded-full flex items-center justify-center pointer-events-none">
              <div className="w-8 h-8 border border-dashed border-slate-800 rounded-full flex items-center justify-center font-mono text-[9px] text-slate-600">
                N
              </div>
              <div className="absolute top-1 w-0.5 h-2 bg-cyan-500" />
            </div>

            <div className="absolute bottom-4 right-4 text-slate-600 font-mono text-[9px] uppercase pointer-events-none text-right">
              Malla Tecnológica IoT<br />
              Sincronización: Activa
            </div>

            {/* Custom SVG Drawing representing Venezuela outline */}
            <svg
              viewBox="0 0 1000 650"
              className="w-full h-full select-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <radialGradient id="marine-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="solid-land" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
              </defs>

              {/* Ocean / territorial water styling */}
              <rect x="0" y="0" width="1000" height="650" fill="transparent" />

              {/* Decorative Caribbean Sea grid lines */}
              <line x1="100" y1="50" x2="300" y2="50" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="5 5" />
              <line x1="100" y1="50" x2="100" y2="150" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="5 5" />

              {/* Beautiful, High-fidelity stylized Vector Outline path of Venezuela territory */}
              {/* To make it look gorgeous and geographically convincing, we carefully map a stylized grid representation of the Venezuelan states */}
              <g id="venezuela-landmass" opacity="0.9">
                {/* Venezuela land polygon stylized to represent Gulf of Venezuela, Falcón, central coast, east coast, Guayana, and the Andes region */}
                <path
                  d="M 200 150 L 220 100 L 250 80 L 280 120 L 320 80 L 370 75 L 430 90 L 460 110 L 520 105 L 560 115 L 610 115 L 650 110 L 685 110 L 720 125 L 750 120 L 770 145 L 810 140 L 830 110 L 860 142 L 870 178 L 840 215 L 870 230 L 910 215 L 940 230 L 960 270 L 915 285 L 890 310 L 915 370 L 930 450 L 910 495 L 870 515 L 850 560 L 820 570 L 795 550 L 760 515 L 778 450 L 750 420 L 720 395 L 660 410 L 625 390 L 560 380 L 525 340 L 450 345 L 395 330 L 300 355 L 250 375 L 180 390 L 150 365 L 130 350 L 110 320 L 132 284 L 145 270 L 195 272 L 180 230 L 240 230 L 260 220 L 230 195 L 205 180 Z"
                  fill="url(#solid-land)"
                  stroke="#334155"
                  strokeWidth="2.5"
                  className="transition-all duration-500 hover:fill-slate-800/90"
                />

                {/* Light reflection effect inside map */}
                <path
                  d="M 200 150 L 220 100 L 250 80 L 280 120 Q 500 200 800 160 L 840 215 L 870 230 Q 600 350 300 355 Z"
                  fill="url(#marine-glow)"
                  pointerEvents="none"
                />
              </g>

              {/* State boundary styling overlays (aesthetic lines) */}
              <path d="M 490 170 L 510 260 L 560 300" stroke="#475569" strokeWidth="0.75" fill="none" opacity="0.4" />
              <path d="M 260 140 L 320 220 L 410 180" stroke="#475569" strokeWidth="0.75" fill="none" opacity="0.4" />
              <path d="M 720 125 L 690 175 L 710 290 L 790 210" stroke="#475569" strokeWidth="0.75" fill="none" opacity="0.4" />
              <path d="M 450 345 L 560 380 L 758 430" stroke="#475569" strokeWidth="0.75" fill="none" opacity="0.3" fillOpacity="0.1" />

              {/* Core interactive city coordinates pins */}
              {cities.map((city) => {
                const isSelected = selectedCity && selectedCity.id === city.id;
                return (
                  <g
                    key={city.id}
                    className="cursor-pointer group"
                    onClick={() => setSelectedCity(city)}
                  >
                    {/* Ring highlight aura for selection */}
                    <circle
                      cx={city.coordinates.x}
                      cy={city.coordinates.y}
                      r={isSelected ? 24 : 12}
                      className={`fill-none transition-all duration-300 ${
                        isSelected
                          ? 'stroke-cyan-500 stroke-2 opacity-100 animate-pulse'
                          : 'stroke-cyan-500/40 stroke-[1.5px] opacity-0 group-hover:opacity-100'
                      }`}
                    />

                    {/* Outer pulsating beacon */}
                    <circle
                      cx={city.coordinates.x}
                      cy={city.coordinates.y}
                      r={isSelected ? 14 : 7}
                      className="fill-cyan-400/20 stroke-none"
                    >
                      <animate
                        attributeName="r"
                        values={`${isSelected ? '14;28;14' : '7;17;7'}`}
                        dur="3s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.2;0.7;0.2"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </circle>

                    {/* Main target center pin */}
                    <circle
                      cx={city.coordinates.x}
                      cy={city.coordinates.y}
                      r={isSelected ? 6.5 : 4}
                      className={`transition-all duration-300 ${
                        isSelected ? 'fill-cyan-400' : 'fill-slate-900 stroke-cyan-500 stroke-2'
                      }`}
                    />

                    {/* Float label */}
                    <text
                      x={city.coordinates.x}
                      y={city.coordinates.y - 12}
                      textAnchor="middle"
                      className={`font-sans tracking-tight select-none font-bold text-[10px] pointer-events-none transition-all duration-300 ${
                        isSelected ? 'fill-cyan-300 font-extrabold translate-y-[-2px]' : 'fill-slate-400 group-hover:fill-slate-200'
                      }`}
                    >
                      {city.id === 'ccs' ? 'CCS 🇻🇪' : city.name.split(' (')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
