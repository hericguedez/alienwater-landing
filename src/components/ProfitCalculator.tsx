import { useState } from 'react';
import { Calculator, DollarSign, ArrowRight, ShieldCheck, Download, Sparkles, ReceiptText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ProfitCalculator() {
  const [machines, setMachines] = useState(2);
  const [litersPerDay, setLitersPerDay] = useState(350);
  const [pricePerLiter, setPricePerLiter] = useState(0.20);
  const [opEx, setOpEx] = useState(120); // USD/month per machine (rent and power)
  const [showQuotation, setShowQuotation] = useState(false);

  // Machine hardware assumptions
  const machineUnitCost = 3600; // USD per full Alienwater IoT dispense cabinet
  const totalInvestment = machines * machineUnitCost;

  // Monthly revenue calculations (30 days)
  const monthlyGrossRevenue = machines * litersPerDay * pricePerLiter * 30;
  const monthlyOpEx = machines * opEx;
  const monthlyNetProfit = Math.max(0, monthlyGrossRevenue - monthlyOpEx);

  // ROI timeline in months
  const roiMonths = monthlyNetProfit > 0 
    ? parseFloat((totalInvestment / monthlyNetProfit).toFixed(1)) 
    : 0;

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Inputs Sliders */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 mb-2">
              <Calculator className="w-4 h-4 text-cyan-400" /> Modelador Financiero
            </span>
            <h3 className="text-hd text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Calcula Tu Rentabilidad
            </h3>
            <p className="text-slate-400 text-sm mt-1 leading-relaxed">
              Descubre cuán rápido recuperas tu inversión instalando dispensadores inteligentes Alienwater. Los números demuestran la fuerza de la automatización comercial.
            </p>
          </div>

          <div className="space-y-5 bg-slate-950/40 p-5 rounded-2xl border border-slate-800/60 font-sans">
            {/* Input 1: Machines count */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs lg:text-sm">
                <label className="text-slate-300 font-bold">Número de Máquinas</label>
                <span className="text-cyan-400 font-mono font-bold text-base bg-cyan-950/40 border border-cyan-900/55 px-2.5 py-0.5 rounded-lg">
                  {machines} {machines === 1 ? 'Unidad' : 'Unidades'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                step="1"
                value={machines}
                onChange={(e) => setMachines(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1 Máquina</span>
                <span>15 Máquinas</span>
              </div>
            </div>

            {/* Input 2: Liters Sold daily */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs lg:text-sm">
                <label className="text-slate-300 font-bold">Liters Dispensed / Day (por máquina)</label>
                <span className="text-cyan-400 font-mono font-bold text-base bg-cyan-950/40 border border-cyan-900/55 px-2.5 py-0.5 rounded-lg">
                  {litersPerDay} Litros
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="1000"
                step="50"
                value={litersPerDay}
                onChange={(e) => setLitersPerDay(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>100 Litros (Fluctuación baja)</span>
                <span>1000 Litros (Capacidad máxima pico)</span>
              </div>
            </div>

            {/* Input 3: Price per liter */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs lg:text-sm">
                <label className="text-slate-300 font-bold">Refill Price per Liter ($ USD)</label>
                <span className="text-emerald-400 font-mono font-bold text-base bg-emerald-950/20 border border-emerald-900/40 px-2.5 py-0.5 rounded-lg">
                  ${pricePerLiter.toFixed(2)} USD
                </span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.50"
                step="0.05"
                value={pricePerLiter}
                onChange={(e) => setPricePerLiter(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>$0.10 USD / litro</span>
                <span>$0.50 USD / litro</span>
              </div>
            </div>

            {/* Input 4: Operating expense */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs lg:text-sm">
                <label className="text-slate-300 font-bold">Costos Fijos por Máquina (Mensuales)</label>
                <span className="text-amber-400 font-mono font-bold text-base bg-amber-950/20 border border-amber-900/30 px-2.5 py-0.5 rounded-lg">
                  ${opEx} USD
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="300"
                step="10"
                value={opEx}
                onChange={(e) => setOpEx(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>$50 USD (Económico)</span>
                <span>$300 USD (Renta Prime)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Projections panel */}
        <div className="lg:col-span-5 bg-radial from-slate-950 to-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col justify-between shadow-lg font-sans">
          <div className="space-y-5">
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest border-b border-slate-800 pb-2">
              Proyección de Rendimiento
            </h4>

            {/* Metric Display 1 */}
            <div className="flex justify-between items-center bg-slate-900/40 p-3.5 rounded-xl border border-slate-850">
              <span className="text-xs text-slate-400">Inversión Estimada:</span>
              <span className="text-lg font-mono font-bold text-slate-200">
                ${totalInvestment.toLocaleString()} USD
              </span>
            </div>

            {/* Metric Display 2 */}
            <div className="flex justify-between items-center bg-slate-900/40 p-3.5 rounded-xl border border-slate-850">
              <span className="text-xs text-slate-400">Ingreso Mensual Bruto:</span>
              <span className="text-lg font-mono font-bold text-cyan-400">
                ${monthlyGrossRevenue.toLocaleString()} USD
              </span>
            </div>

            {/* Metric Display 3 */}
            <div className="flex justify-between items-center bg-slate-900/40 p-3.5 rounded-xl border border-slate-850">
              <span className="text-xs text-slate-400">Costos Operativos Fijos:</span>
              <span className="text-lg font-mono font-bold text-rose-450">
                -${monthlyOpEx.toLocaleString()} USD
              </span>
            </div>

            {/* Metric Display 4 - Ganancia Neta */}
            <div className="bg-linear-to-r from-cyan-950/40 to-blue-950/40 p-4 rounded-xl border border-cyan-800/50 flex justify-between items-center">
              <div>
                <span className="text-xs text-cyan-300 font-bold block">Ganancia Neta Mensual:</span>
                <span className="text-xs text-slate-400 font-mono mt-0.5 block">Pasivo Automatizado</span>
              </div>
              <span className="text-2xl font-black font-mono text-emerald-400">
                ${monthlyNetProfit.toLocaleString()} <span className="text-xs font-semibold">USD</span>
              </span>
            </div>

            {/* Metric Display 5 - ROI */}
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-300 block font-bold">Tiempo de Retorno (ROI):</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Recuperación de capital</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black font-mono text-cyan-400">
                  {roiMonths > 0 ? `${roiMonths} Meses` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 space-y-3">
            <button
              onClick={() => setShowQuotation(true)}
              className="w-full py-3 bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 rounded-xl text-xs font-bold tracking-wider transition-all duration-300 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-400/20 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <ReceiptText className="w-4.5 h-4.5" />
              DESCARGAR PROPUESTA COMERCIAL
            </button>
            <p className="text-[10px] text-slate-500 text-center font-mono flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 inline" /> Valores proyecciones con 92% rentabilidad neta promedio.
            </p>
          </div>
        </div>
      </div>

      {/* Commercial Quotation Modal overlay */}
      <AnimatePresence>
        {showQuotation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-2xl bg-white text-slate-900 rounded-3xl p-6 lg:p-8 font-sans shadow-2xl relative overflow-y-auto max-h-[90vh]"
            >
              <button
                onClick={() => setShowQuotation(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm transition-all duration-200"
              >
                ✕
              </button>

              {/* Quotation Header content */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-extrabold text-sm">A</span>
                    <span className="font-sans font-extrabold text-xl tracking-tight text-blue-900">Alienwater <span className="text-cyan-500 font-light">Venezuela</span></span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">R.I.F: J-50029384-1 | Caracas, Venezuela</p>
                </div>
                <div className="text-right">
                  <span className="text-xs uppercase bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full">COTIZACIÓN INTELIGENTE</span>
                  <p className="text-[11px] text-slate-500 mt-1.5 font-mono">Validez: 30 Días</p>
                </div>
              </div>

              {/* Content body */}
              <div className="my-6 space-y-4">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-l-4 border-blue-600 pl-3">
                  Propuesta de Inversión y Retorno Automatizado
                </h4>
                
                <p className="text-xs text-slate-600 leading-relaxed">
                  Basado en los parámetros configurados en nuestro modelador en tiempo real, presentamos la estimación oficial para la adición de sistemas expendedores de tecnología avanzada Alienwater para la distribución de agua potable purificada:
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden mt-3">
                  <table className="w-full text-xs text-slate-700">
                    <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-4 text-left">DESCRIPCIÓN DE ITEM</th>
                        <th className="py-2.5 px-4 text-center">CANTIDAD</th>
                        <th className="py-2.5 px-4 text-right">UNITARIO (USD)</th>
                        <th className="py-2.5 px-4 text-right">TOTAL (USD)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-850">Gabinete Monedero Despachador Automatizado Alienwater</span>
                          <span className="text-[10px] text-slate-500 block mt-1">Conectividad IoT, Telemetría satelital, Pantalla táctil color, dispensador dual, sistema de filtrado integrado de 5 etapas.</span>
                        </td>
                        <td className="py-3 px-4 text-center font-bold font-mono">{machines}</td>
                        <td className="py-3 px-4 text-right font-mono">${machineUnitCost.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-bold text-slate-900 font-mono">${totalInvestment.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-850">Servicio de Instalación y Configuración IoT de Red</span>
                          <span className="text-[10px] text-slate-500 block mt-1">Acople de filtros, calibración del caudalímetro digital, pruebas de conductividad de agua e inducción al operador.</span>
                        </td>
                        <td className="py-3 px-4 text-center font-bold font-mono">{machines}</td>
                        <td className="py-3 px-4 text-right font-mono text-emerald-600">INCLUIDO</td>
                        <td className="py-3 px-4 text-right font-bold text-emerald-600 font-mono">$0</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold font-mono">PROYECCIÓN DE INGRESOS MENSUAL</span>
                    <span className="text-xl font-bold font-mono text-emerald-600 mt-1 block">+ ${monthlyNetProfit.toLocaleString()} USD/Mes</span>
                    <span className="text-[10px] text-slate-450 block mt-1 font-sans">Retorno neto estimado después de descontar ${monthlyOpEx} USD de costos fijos de electricidad/agua.</span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold font-mono">RETORNO ESTIMADO (ROI)</span>
                    <span className="text-xl font-bold font-mono text-blue-600 mt-1 block">{roiMonths} Meses de Plazo</span>
                    <span className="text-[10px] text-slate-450 block mt-1 font-sans">Estimando flujo diario promedio de {litersPerDay} litros por máquina con precio de refill a ${pricePerLiter.toFixed(2)}.</span>
                  </div>
                </div>

                {/* Technical specs of Alienwater IoT machines */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-800">
                  <span className="font-bold block">✓ Especificaciones Técnicas Incluidas en la Red:</span>
                  <p className="text-[11px] mt-1 font-light leading-relaxed">
                    Unidades auto-suficientes que aceptan método de cobro multi-moneda (Pago Móvil automatizado con API, lector de billetes USD nacionales integrables y ficha inteligente de refill). Monitoreo de calidad de agua con sensor TDS continuo para asegurar bienestar de los clientes.
                  </p>
                </div>
              </div>

              {/* Download signature footer */}
              <div className="flex justify-between items-center border-t border-slate-200 pt-5 mt-6">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Emisor de Propuesta</span>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">Asesoría Tecnológica Alienwater</p>
                </div>
                <button
                  onClick={() => alert("Simulación de Descarga: Su propuesta comercial en formato PDF ha sido generada correctamente.")}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold tracking-wider flex items-center gap-1.5 transition-all duration-300 shadow-md shadow-blue-600/10"
                >
                  <Download className="w-4 h-4" /> COMPARTIR PROPUESTA
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
