import { useState, useEffect, useRef } from 'react';
import { Machine, IoTEvent } from '../types';
import { Activity, Droplet, Sparkles, AlertCircle, RefreshCw, Smartphone, Layers, Lock, Power } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const INITIAL_MACHINES: Machine[] = [
  {
    id: 'm1',
    name: 'CCS - Altamira Hub',
    city: 'Caracas',
    location: 'CC Altamira C2',
    status: 'online',
    waterLevel: 88,
    filterLife: 92,
    tdsLevel: 11,
    litersToday: 412,
    totalEarnings: 103,
  },
  {
    id: 'm2',
    name: 'MCBO - Bella Vista',
    city: 'Maracaibo',
    location: 'Av. Bella Vista Esq 72',
    status: 'online',
    waterLevel: 65,
    filterLife: 74,
    tdsLevel: 14,
    litersToday: 290,
    totalEarnings: 72.5,
  },
  {
    id: 'm3',
    name: 'VAL - Sambil',
    city: 'Valencia',
    location: 'CC Sambil Nivel Feria',
    status: 'online',
    waterLevel: 94,
    filterLife: 89,
    tdsLevel: 9,
    litersToday: 356,
    totalEarnings: 89,
  },
  {
    id: 'm4',
    name: 'BARQ - Las Trinitarias',
    city: 'Barquisimeto',
    location: 'CC Las Trinitarias P1',
    status: 'maintenance',
    waterLevel: 42,
    filterLife: 15,
    tdsLevel: 19,
    litersToday: 120,
    totalEarnings: 30,
  }
];

const INITIAL_EVENTS: IoTEvent[] = [
  { id: 'e1', timestamp: '08:24:12', machineName: 'CCS - Altamira Hub', type: 'sale', message: 'Venta completada: 5.0 Litros despachados ($1.25)' },
  { id: 'e2', timestamp: '08:25:05', machineName: 'VAL - Sambil', type: 'sale', message: 'Venta completada: 1.5 Litros despachados ($0.37)' },
  { id: 'e3', timestamp: '08:26:41', machineName: 'CCS - Altamira Hub', type: 'system', message: 'Autolimpieza UV completada de manera exitosa' },
  { id: 'e4', timestamp: '08:27:10', machineName: 'BARQ - Las Trinitarias', type: 'warning', message: 'Alerta: Vida de Filtros de Carbón inferior al 15%' },
];

export default function IoTTracker({ onClose }: { onClose: () => void }) {
  const [machines, setMachines] = useState<Machine[]>(INITIAL_MACHINES);
  const [events, setEvents] = useState<IoTEvent[]>(INITIAL_EVENTS);
  const [selectedMachineId, setSelectedMachineId] = useState<string>('m1');
  const [lcdMessage, setLcdMessage] = useState<string>('PURA Y REFRESCANTE');
  const [activeActions, setActiveActions] = useState<{ [key: string]: string }>({});
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll logs
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [events]);

  // Telemetry loop - simulates sales and actions to bring dashboard to life
  useEffect(() => {
    const interval = setInterval(() => {
      // Pick a random machine that is online
      const onlineMachines = machines.filter(m => m.status === 'online');
      if (onlineMachines.length === 0) return;
      const machine = onlineMachines[Math.floor(Math.random() * onlineMachines.length)];

      const saleLiters = parseFloat((Math.random() * 4.5 + 0.5).toFixed(1));
      const saleUSD = Number((saleLiters * 0.25).toFixed(2));

      // Update machine
      setMachines(prev => prev.map(m => {
        if (m.id === machine.id) {
          return {
            ...m,
            litersToday: m.litersToday + saleLiters,
            totalEarnings: m.totalEarnings + saleUSD,
            waterLevel: Math.max(10, m.waterLevel - 0.2), // slow drain
          };
        }
        return m;
      }));

      // Generate timeline event
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const newEvent: IoTEvent = {
        id: Math.random().toString(),
        timestamp: timeStr,
        machineName: machine.name,
        type: 'sale',
        message: `Venta completada: ${saleLiters} Litros despachados ($${saleUSD} USD)`,
      };

      setEvents(prev => [...prev.slice(-15), newEvent]); // keep last 15 elements
    }, 5500);

    return () => clearInterval(interval);
  }, [machines]);

  const triggerDiagnostic = (machineId: string) => {
    const machine = machines.find(m => m.id === machineId);
    if (!machine) return;

    setActiveActions(prev => ({ ...prev, [machineId]: 'diagnostic' }));

    // Generate diagnostic start event
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newEvent: IoTEvent = {
      id: Math.random().toString(),
      timestamp: timeStr,
      machineName: machine.name,
      type: 'system',
      message: 'Iniciando calibración remota de sensores de flujo...',
    };
    setEvents(prev => [...prev, newEvent]);

    setTimeout(() => {
      setActiveActions(prev => {
        const copy = { ...prev };
        delete copy[machineId];
        return copy;
      });

      // Update values
      setMachines(prev => prev.map(m => {
        if (m.id === machineId) {
          return { ...m, tdsLevel: Math.max(8, m.tdsLevel - 1) };
        }
        return m;
      }));

      const finTime = new Date().toTimeString().split(' ')[0];
      setEvents(prev => [...prev, {
        id: Math.random().toString(),
        timestamp: finTime,
        machineName: machine.name,
        type: 'system',
        message: 'Calibración completada: Desviación corregida. Purity Optimum.',
      }]);
    }, 2500);
  };

  const triggerAutolimpieza = (machineId: string) => {
    const machine = machines.find(m => m.id === machineId);
    if (!machine) return;

    setActiveActions(prev => ({ ...prev, [machineId]: 'clean' }));

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setEvents(prev => [...prev, {
      id: Math.random().toString(),
      timestamp: timeStr,
      machineName: machine.name,
      type: 'system',
      message: 'Orden remota ejecutada: Ciclo de retrolavado e irrigación química activa.',
    }]);

    setTimeout(() => {
      setActiveActions(prev => {
        const copy = { ...prev };
        delete copy[machineId];
        return copy;
      });

      setMachines(prev => prev.map(m => {
        if (m.id === machineId) {
          return { ...m, filterLife: Math.min(100, m.filterLife + 5) };
        }
        return m;
      }));

      const finTime = new Date().toTimeString().split(' ')[0];
      setEvents(prev => [...prev, {
        id: Math.random().toString(),
        timestamp: finTime,
        machineName: machine.name,
        type: 'system',
        message: 'Limpieza e higienización UV-C completada con éxito.',
      }]);
    }, 3000);
  };

  const applyLcdMessage = (machineId: string) => {
    const machine = machines.find(m => m.id === machineId);
    if (!machine) return;

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setEvents(prev => [...prev, {
      id: Math.random().toString(),
      timestamp: timeStr,
      machineName: machine.name,
      type: 'system',
      message: `Mensaje LCD remoto actualizado: "${lcdMessage.toUpperCase()}"`,
    }]);
  };

  const selectedMachine = machines.find(m => m.id === selectedMachineId) || machines[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950 font-sans text-slate-100 flex flex-col justify-start">
      {/* Dynamic Dashboard Top Nav */}
      <header className="bg-slate-900 border-b border-slate-800 py-4 px-6 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black tracking-tighter shadow-md shadow-cyan-500/10">
            AW
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5 leading-none">
              Portal del Franquiciado <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded-full">SATELLITE IoT</span>
            </h1>
            <p className="text-[11px] text-slate-400 mt-1">Monitoreo Comercial Automatizado 24/7</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end text-xs font-mono">
            <span className="text-slate-400">Usuario Activo:</span>
            <span className="text-cyan-400 font-bold">hericj@gmail.com</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg text-xs font-bold transition-all duration-200 border border-slate-700/65 flex items-center gap-2"
          >
            <Power className="w-4 h-4 text-rose-500" /> CERRAR MÓDULO CORPO
          </button>
        </div>
      </header>

      {/* Grid Dashboard Body */}
      <main className="flex-1 p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto w-full">
        
        {/* Left Column (8 cols): Overviews & Machine selection */}
        <div className="lg:col-span-8 space-y-6">
          {/* Quick Metrics Header */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Metric 1 */}
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-850 shadow-inner flex flex-col justify-between">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Equipos Online</span>
              <div className="flex items-baseline gap-1 mt-1.5">
                <span className="text-3xl font-black text-white">
                  {machines.filter(m => m.status === 'online').length}
                </span>
                <span className="text-xs text-slate-400">/ {machines.length}</span>
              </div>
              <span className="text-[10px] text-emerald-450 mt-1 flex items-center gap-1">
                <Activity className="w-3 h-3 animate-pulse" /> Sincronizados
              </span>
            </div>

            {/* Metric 2 */}
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-850 shadow-inner flex flex-col justify-between col-span-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Litros Despachados</span>
              <div className="flex items-baseline gap-1 mt-1.5">
                <span className="text-3xl font-black text-cyan-400">
                  {machines.reduce((acc, m) => acc + m.litersToday, 0).toFixed(0)}
                </span>
                <span className="text-xs text-slate-400">Litros Hoy</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 font-mono">Promedio: 294 L/maq</span>
            </div>

            {/* Metric 3 */}
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-850 shadow-inner flex flex-col justify-between">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Recaudado Estimado</span>
              <div className="flex items-baseline gap-1 mt-1.5">
                <span className="text-3xl font-black text-emerald-400">
                  ${machines.reduce((acc, m) => acc + m.totalEarnings, 0).toLocaleString()}
                </span>
                <span className="text-xs text-slate-400">USD</span>
              </div>
              <span className="text-[10px] text-emerald-400/80 mt-1 font-mono">Liquidez Inmediata</span>
            </div>

            {/* Metric 4 */}
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-850 shadow-inner flex flex-col justify-between">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Pureza Promedio</span>
              <div className="flex items-baseline gap-1 mt-1.5">
                <span className="text-3xl font-black text-emerald-400">11</span>
                <span className="text-xs text-slate-400">PPM TDS</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 font-mono">Agua Destilada Refill</span>
            </div>
          </div>

          {/* Machine Grid List */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unidades de Dispensado Registradas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {machines.map((machine) => {
                const isSelected = machine.id === selectedMachineId;
                const progressColor = machine.waterLevel > 70 ? 'bg-cyan-500' : machine.waterLevel > 30 ? 'bg-amber-500' : 'bg-red-500';

                return (
                  <div
                    key={machine.id}
                    onClick={() => setSelectedMachineId(machine.id)}
                    className={`cursor-pointer transition-all duration-300 p-4 rounded-2xl border ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-500/80 shadow-md shadow-cyan-500/5'
                        : 'bg-slate-900/30 border-slate-850 hover:bg-slate-900/50 hover:border-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-100">{machine.name}</h3>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{machine.location}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        machine.status === 'online' 
                          ? 'bg-emerald-950 text-emerald-450 border border-emerald-900' 
                          : 'bg-amber-950 text-amber-450 border border-amber-900'
                      }`}>
                        {machine.status === 'online' ? 'Online' : 'Mantenimiento'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800/40 my-1 font-mono text-[11px]">
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase block">Refill Hoy</span>
                        <span className="font-bold text-slate-200">{machine.litersToday.toFixed(1)} L</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase block">Pureza</span>
                        <span className="font-bold text-cyan-400">{machine.tdsLevel} PPM</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase block">Caja</span>
                        <span className="font-bold text-emerald-400">${machine.totalEarnings.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Progress slider bar showing tank level */}
                    <div className="mt-2.5">
                      <div className="flex justify-between text-[9px] text-slate-400 mb-1">
                        <span>Filtro de Membrana</span>
                        <span className="font-bold">{machine.filterLife}% de vida</span>
                      </div>
                      <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${machine.filterLife > 50 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                          style={{ width: `${machine.filterLife}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Remote IoT Controls Panel */}
          <div className="bg-slate-900/60 border border-slate-850 p-5 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Smartphone className="w-4.5 h-4.5 text-cyan-400" />
              Consola IoT de Control Remoto: <span className="text-cyan-400 font-mono text-xs">{selectedMachine.name}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* LCD message configurator */}
              <div className="space-y-2 font-sans">
                <label className="text-xs text-slate-400 font-bold block">Actualizar Mensaje de Pantalla LCD (Máquina)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={20}
                    value={lcdMessage}
                    onChange={(e) => setLcdMessage(e.target.value.toUpperCase())}
                    placeholder="Escriba mensaje..."
                    className="flex-1 bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs font-mono focus:border-cyan-500 focus:outline-hidden text-cyan-300"
                  />
                  <button
                    onClick={() => applyLcdMessage(selectedMachine.id)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold font-mono transition-all duration-200 shrink-0"
                  >
                    APLICAR
                  </button>
                </div>
                <span className="text-[10px] text-slate-500 italic block font-mono">Mensaje actual simulado: {lcdMessage}</span>
              </div>

              {/* Instant actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => triggerAutolimpieza(selectedMachine.id)}
                  disabled={!!activeActions[selectedMachine.id]}
                  className={`p-3 rounded-xl border text-xs font-bold font-mono transition-all duration-300 block text-center ${
                    activeActions[selectedMachine.id] === 'clean'
                      ? 'bg-slate-850 border-cyan-800 text-cyan-300 animate-pulse cursor-wait'
                      : 'bg-slate-950 border-slate-800 hover:bg-slate-900 text-slate-350'
                  }`}
                >
                  <RefreshCw className={`w-4 h-4 mx-auto mb-1.5 ${activeActions[selectedMachine.id] === 'clean' ? 'animate-spin' : 'text-cyan-500'}`} />
                  {activeActions[selectedMachine.id] === 'clean' ? 'LAVANDO...' : 'CICLO LAVADO'}
                </button>

                <button
                  onClick={() => triggerDiagnostic(selectedMachine.id)}
                  disabled={!!activeActions[selectedMachine.id]}
                  className={`p-3 rounded-xl border text-xs font-bold font-mono transition-all duration-300 block text-center ${
                    activeActions[selectedMachine.id] === 'diagnostic'
                      ? 'bg-slate-850 border-cyan-800 text-cyan-300 animate-pulse cursor-wait'
                      : 'bg-slate-950 border-slate-800 hover:bg-slate-900 text-slate-350'
                  }`}
                >
                  <Activity className={`w-4 h-4 mx-auto mb-1.5 ${activeActions[selectedMachine.id] === 'diagnostic' ? 'animate-bounce' : 'text-cyan-500'}`} />
                  {activeActions[selectedMachine.id] === 'diagnostic' ? 'DIAGNÓSTICO...' : 'CALIBRACIÓN'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Real-time Event log terminal */}
        <div className="lg:col-span-4 flex flex-col justify-start">
          <div className="bg-slate-950 border border-slate-850 rounded-3xl p-5 shadow-lg flex-1 flex flex-col min-h-[480px]">
            <div className="flex justify-between items-center border-b border-slate-850 pb-3 mb-4 shrink-0">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" /> TELEMETRÍA IOT (REAL-TIME)
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {/* scrolling log window */}
            <div className="flex-1 overflow-y-auto max-h-[380px] space-y-3 pr-1 text-xs font-mono scrollbar-thin">
              {events.map((event) => {
                const isSale = event.type === 'sale';
                const isWarning = event.type === 'warning';
                
                return (
                  <div key={event.id} className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-850/66">
                    <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                      <span className="font-bold text-slate-400">{event.machineName}</span>
                      <span>{event.timestamp}</span>
                    </div>
                    <p className={`text-xs ${isSale ? 'text-emerald-400' : isWarning ? 'text-rose-450 font-bold' : 'text-cyan-300'}`}>
                      {event.message}
                    </p>
                  </div>
                );
              })}
              <div ref={logEndRef} />
            </div>

            <div className="mt-4 pt-4 border-t border-slate-850 text-[10px] text-slate-500 shrink-0 flex items-center justify-between">
              <span>Sincronizando: Caracas AWS</span>
              <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> Encriptado SSL v3</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
