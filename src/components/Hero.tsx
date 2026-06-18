import { Droplet, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import { motion } from 'motion/react';

export default function Hero({ onQuoteClick }: { onQuoteClick: () => void }) {
  return (
    <section
      id="inicio"
      className="relative min-h-screen bg-slate-950 flex flex-col justify-center items-center overflow-hidden pt-28 pb-32"
    >
      {/* Background Cyber-Cosmic Overlay Grid */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.12),transparent_70%)]" />
      
      {/* Abstract Circuit / Cyber Light lines using SVGs */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <svg viewBox="0 0 1000 1000" className="w-full h-full stroke-cyan-500 stroke-[0.5px] fill-none">
          {/* Node 1 */}
          <path d="M 100,200 L 250,200 L 300,250 L 500,250" />
          <circle cx="500" cy="250" r="3" className="fill-cyan-400" />
          {/* Node 2 */}
          <path d="M 900,150 L 800,150 L 750,220 L 750,400 Q 750,500 600,550" />
          <circle cx="900" cy="150" r="3" className="fill-cyan-400" />
          {/* Node 3 */}
          <path d="M 50,850 L 200,850 L 350,700 L 550,700" />
          <circle cx="550" cy="700" r="3" className="fill-cyan-400" />
          {/* Animated node sparks */}
          <circle cx="250" cy="200" r="2" className="fill-cyan-300">
            <animate attributeName="cx" values="100;250;300;500" dur="4s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      {/* Hero content container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center space-y-8 flex flex-col items-center">
        
        {/* Modern Label */}
        <div className="inline-flex items-center gap-2 bg-slate-900/50 border border-slate-800 px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs text-cyan-400/90 tracking-widest font-mono uppercase font-bold">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Fabricación 100% Nacional Certificada
        </div>

        {/* Core Main Heading with glorious typography */}
        <h1 className="text-hd text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight max-w-4xl mx-auto drop-shadow-[0_2px_10px_rgba(6,182,212,0.15)]">
          Alienwater: Revolucionando la Distribución de Agua en Venezuela
        </h1>

        {/* Sub-headline slogan */}
        <p className="text-sm sm:text-lg lg:text-xl font-bold tracking-wide text-slate-300 italic max-w-2xl mx-auto">
          Es momento de innovar, el futuro es ahora.
        </p>

        {/* High-Contrast Interactive CTA button */}
        <div className="pt-4">
          <button
            onClick={onQuoteClick}
            className="group px-8 py-4.5 bg-linear-to-r from-cyan-500 via-blue-500 to-cyan-500 bg-[size:200%_auto] hover:bg-right hover:scale-105 active:scale-95 text-slate-950 font-black rounded-full text-sm tracking-wider shadow-xl shadow-cyan-500/20 hover:shadow-cyan-400/40 transition-all duration-500 flex items-center justify-center gap-2 cursor-pointer"
          >
            {/* Water drop vector inside key visual */}
            <div className="w-6 h-6 bg-slate-950 rounded-full flex items-center justify-center text-cyan-400 shrink-0">
              <Droplet className="w-4 h-4 fill-cyan-400 stroke-none group-hover:animate-bounce" />
            </div>
            <span>Cotiza tu Máquina Automática Hoy</span>
            <ArrowRight className="w-4 h-4 text-slate-950 stroke-[3px]" />
          </button>
        </div>

        {/* Small trust assurances */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 items-center justify-center text-xs text-slate-500 font-mono pt-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
            Control de Caja en Dólares (USD / Pago Móvil)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
            Ingresos Pasivos Continuos 24/7
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
            Garantía Directa de Fábrica
          </span>
        </div>
      </div>

      {/* Beautiful Layered Fluid Water Wave Separator SVG at the bottom */}
      <div className="absolute bottom-0 inset-x-0 w-full overflow-hidden leading-none z-10">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-[60px] sm:h-[100px] fill-slate-950"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background deeper dark wave */}
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,8.75,53.86,17.43,81.07,25.85,152.09,47.88,227.18,63.79,321.39,56.44Z"
            className="fill-blue-950/20"
          />
          {/* Main forward transition wave */}
          <path
            d="M0,0 C150,90 350,90 500,40 C650,-10 850,-10 1000,40 C1100,75 1150,75 1200,50 L1200,120 L0,120 Z"
            className="fill-slate-950"
          />
        </svg>
      </div>
    </section>
  );
}
