import { Settings, BrainCircuit, Landmark, Globe } from 'lucide-react';
import { motion } from 'motion/react';

export default function Benefits() {
  const benefitCards = [
    {
      icon: Settings,
      title: 'Fabricantes Nacionales',
      text: 'Entendemos el mercado venezolano mejor que nadie. Diseñamos y construimos nuestros equipos localmente, garantizando calidad, repuestos y soporte técnico oportuno sin intermediarios.',
      label: '🇻🇪 CALIDAD VENEZOLANA',
    },
    {
      icon: BrainCircuit,
      title: 'Soluciones Inteligentes',
      text: 'Vamos más allá del hardware. Nuestras máquinas automáticas despachadoras integran telemetría IoT satelital que te permite tener un control comercial absoluto y moderno de tus ventas.',
      label: '🚀 TECNOLOGÍA EN LA NUBE',
    },
    {
      icon: Landmark,
      title: 'Sostenibilidad 24/7',
      text: 'Convierte tu espacio en un punto de hidratación autónomo que capta cuotas de mantenimiento continuas sin necesidad de presencia física ni costos de personal constantes.',
      label: '📈 FLUJO DE SOSTENIMIENTO',
    },
    {
      icon: Globe,
      title: 'Expansión Nacional',
      text: 'Sin importar en qué rincón o ciudad de Venezuela te encuentres, nuestra tecnología y red de distribución de ingenieros llega hasta tu negocio para impulsarlo al siguiente nivel.',
      label: '📍 RED EN TODO EL PAÍS',
    },
  ];

  return (
    <section id="beneficios" className="relative bg-slate-950 py-24 border-b border-slate-900">
      <div className="absolute top-0 inset-x-0 h-[100px] bg-linear-to-b from-slate-900/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Section title */}
        <div className="max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest block font-sans">
            ¿Por qué elegirnos?
          </span>
          <h2 className="text-hd text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Beneficios de la Tecnología Alienwater
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Nuestros dispensadores inteligentes son verdaderas estaciones exclusivas para socios que purifican y distribuyen hidratación bajo autogestión, con el menor costo de mantenimiento del mercado.
          </p>
        </div>

        {/* Responsive Grid list of benefits columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {benefitCards.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="group relative bg-slate-900/45 hover:bg-slate-900 border border-slate-850 hover:border-cyan-500/50 p-6 rounded-3xl transition-all duration-350 shadow-inner flex flex-col justify-between overflow-hidden"
              >
                {/* Glow hovering aura */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="space-y-4">
                  {/* Icon bracket container */}
                  <div className="w-11 h-11 rounded-2xl bg-cyan-950/40 border border-cyan-900/60 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-350 shadow-inner">
                    <Icon className="w-5.5 h-5.5" />
                  </div>

                  <div>
                    <span className="text-[9px] text-cyan-400/80 font-mono tracking-widest font-extrabold block mb-1">
                      {benefit.label}
                    </span>
                    <h3 className="text-base font-extrabold text-white tracking-tight">
                      {benefit.title}
                    </h3>
                  </div>

                  <p className="text-slate-400 text-xs leading-relaxed font-sans font-light">
                    {benefit.text}
                  </p>
                </div>

                <div className="border-t border-slate-900 mt-5 pt-3.5 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                  <span>Operatividad: 24h</span>
                  <span className="text-cyan-400/80 font-bold">100% Garantizado</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
