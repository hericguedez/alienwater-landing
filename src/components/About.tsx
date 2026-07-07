import AboutDispenser from './AboutDispenser';
import { ShieldCheck, Award, HeartHandshake, Settings2 } from 'lucide-react';

export default function About() {
  return (
    <section id="acerca" className="relative bg-slate-900/40 py-24 border-y border-slate-900">
      <div className="absolute inset-0 bg-radial from-cyan-950/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Text and copy columns */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest block mb-2">
                ACERCA DE ALIENWATER
              </span>
              <h2 className="text-hd text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Innovación Nacional en Agua Purificada
              </h2>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
              Somos la <strong className="text-white font-bold">única empresa fabricante en Venezuela</strong> especializada en tecnología de dispensado e hidratación automatizada. Nuestro propósito es transformar la manera en que se gestiona la hidratación de comunidades mediante autogestión, ofreciendo soluciones de ingeniería de primer nivel que operan de forma 100% autónoma.
            </p>

            <p className="text-slate-400 text-sm leading-relaxed">
              Olvídate de los sistemas tradicionales, envases retornables pesados y logística de personal costosa. Nosotros creamos <em className="text-slate-200 not-italic font-semibold">estaciones de acceso controlado y uso exclusivo para miembros</em> diseñadas para trabajar solas las 24 horas del día.
            </p>

            {/* Grid checklist highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-900/50 flex items-center justify-center text-cyan-400 shrink-0">
                  <Award className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Únicos Fabricantes</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Ingeniería directa fabricada en Venezuela con repuesto garantizado.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-900/50 flex items-center justify-center text-cyan-400 shrink-0">
                  <Settings2 className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-sans">Soporte Técnico Local</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Equipo de ingenieros calificados en las principales ciudades del país.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-900/50 flex items-center justify-center text-cyan-400 shrink-0">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Sanidad Certificada</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Certificaciones de laboratorio acordes a normas de salud nacionales.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-900/50 flex items-center justify-center text-cyan-400 shrink-0">
                  <HeartHandshake className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Sostenibilidad Financiera</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Retorno de infraestructura menor a 12 meses por excedentes de sostenibilidad.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Render the fully interactive CSS/SVG Water Dispenser */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <AboutDispenser />
          </div>

        </div>
      </div>
    </section>
  );
}
