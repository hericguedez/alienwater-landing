import { Check, Briefcase } from 'lucide-react';

export default function Clients() {
  const brands = [
    { name: 'Empresas Polar', desc: 'Líder de Alimentos y Bebidas' },
    { name: 'Coca-Cola FEMSA', desc: 'Operación Refill Automatizada' },
    { name: 'PepsiCo Venezuela', desc: 'Cadena de Suministro Directa' },
    { name: 'Gatorade Venezuela', desc: 'Hidratación Masiva Deportiva' },
    { name: 'Nestea Venezuela', desc: 'Dispensadores de Té y Agua' },
    { name: 'Farmatodo', desc: 'Surtido Clínico de Refill' },
  ];

  return (
    <section id="clientes" className="relative bg-slate-900/10 py-16 border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
        
        <div className="space-y-2">
          <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest block font-mono">
            RESPALDO CORPORATIVO
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Nuestros Equipos en las Principales Cadenas y Oficinas
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            La ingeniería de dispensado de Alienwater cumple con las exigencias del consumo masivo comercial e industrial en Venezuela.
          </p>
        </div>

        {/* Sliding Carousel of brands inline representations */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 items-center">
          {brands.map((brand, idx) => (
            <div
              key={idx}
              className="group bg-slate-950/40 hover:bg-slate-900/70 border border-slate-850 hover:border-cyan-500/30 p-4.5 rounded-2xl transition-all duration-300 flex flex-col items-center text-center shadow-inner"
            >
              {/* Brand placeholder logo styling */}
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 group-hover:text-cyan-400 group-hover:bg-cyan-950/20 group-hover:border-cyan-900/60 transition-all duration-300 shrink-0 mb-3">
                <Briefcase className="w-5 h-5" />
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors duration-200">
                  {brand.name}
                </h4>
                <p className="text-[10px] text-slate-500 mt-1 font-sans">
                  {brand.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Certification highlights banner */}
        <div className="bg-slate-950/80 p-4.5 rounded-2xl border border-slate-850 max-w-3xl mx-auto flex flex-col sm:flex-row gap-4 items-center justify-between text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-950/40 border border-emerald-900 text-emerald-400 rounded-lg flex items-center justify-center shrink-0">
              <Check className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wide block">PROCESOS DE PURIFICACIÓN CONTROLADOS</span>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">Sistemas testados bajo microbiología rigurosa para garantizar pureza libre de metales pesados en Venezuela.</p>
            </div>
          </div>
          <span className="text-[10px] font-bold font-mono text-emerald-400 bg-emerald-950/20 border border-emerald-900/40 px-3 py-1.5 rounded-full shrink-0">
            MIN-SALUD REG: 8201A-85
          </span>
        </div>

      </div>
    </section>
  );
}
