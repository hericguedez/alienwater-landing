import { Star, MessageSquare } from 'lucide-react';

export default function Reviews() {
  const reviews = [
    {
      name: 'Carlos G.',
      location: 'CC El Recreo, Caracas',
      stars: 5,
      comment: 'La mejor infraestructura para nuestra comunidad privada. El equipo trabaja de manera 100% autónoma las 24 horas del día. El sistema de Pago Móvil automatizado y la telemetría IoT nos permiten gestionar las cuotas de sostenimiento en tiempo real.',
      role: 'Miembro Administrador',
    },
    {
      name: 'María L.',
      location: 'Consultorios Médicos, Valencia',
      stars: 5,
      comment: 'Tecnología de punta, un cambio total y positivo para mi oficina. Ofrecemos agua completamente estéril que da confianza a los pacientes. La calidad de purificación mediante ósmosis inversa de Alienwater no tiene comparación.',
      role: 'Gerente Operaciones',
    },
    {
      name: 'José V.',
      location: 'Bella Vista, Maracaibo',
      stars: 5,
      comment: 'El soporte técnico directo nacional es la clave. Tuvimos una duda sobre la presión del agua, y su equipo de ingenieros locales asistió en apenas un par de horas. El soporte de repuestos nos da total tranquilidad para el club.',
      role: 'Presidente de Capítulo',
    },
  ];

  return (
    <section className="relative bg-slate-900/40 py-24 border-y border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-16">
        
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest block font-mono">
            TESTIMONIOS REALES
          </span>
          <h2 className="text-hd text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Opiniones de Nuestros Socios Comerciales
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xl mx-auto">
            Comunidades y administradores que ya automatizaron su recaudación de cuotas de hidratación purificada con nuestra tecnología.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-slate-950/80 border border-slate-850 p-6 rounded-3xl flex flex-col justify-between shadow-lg relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 text-slate-800 pointer-events-none">
                <MessageSquare className="w-12 h-12 stroke-[1.5px]" />
              </div>

              <div className="space-y-4">
                {/* Stars container */}
                <div className="flex gap-1">
                  {[...Array(review.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-450 stroke-none" />
                  ))}
                </div>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed italic font-light relative z-10">
                  "{review.comment}"
                </p>
              </div>

              <div className="border-t border-slate-900 mt-6 pt-4 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold font-sans text-white">
                    {review.name}
                  </h4>
                  <span className="text-[10px] text-slate-500 block font-mono mt-0.5">
                    {review.location}
                  </span>
                </div>
                <span className="text-[9px] text-cyan-400/80 bg-cyan-950/20 border border-cyan-900/40 px-2 py-1 rounded-md font-bold font-mono">
                  {review.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
