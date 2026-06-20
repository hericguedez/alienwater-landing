import { useState, FormEvent } from 'react';
import { Mail, Phone, MapPin, Building2, Send, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const WINDOW_OPTIONS = [
  { id: 'monedero', name: 'Solo Monedero', price: 550, subscription: 0, desc: 'Sistema físico de fichas/monedas, ideal para operaciones independientes.' },
  { id: 'qr', name: 'Solo Código QR', price: 550, subscription: 20, desc: 'Pago digital inteligente a través de código QR, incluye acceso a la nube.' },
  { id: 'monedero_qr', name: 'Monedero + Código QR', price: 625, subscription: 20, desc: 'El sistema híbrido más popular: monedero físico y código QR digital.' },
  { id: 'monedero_billete', name: 'Monedero + Billetes ($)', price: 750, subscription: 0, desc: 'Aceptador de billetes de dólares USD y monedero físico.' },
  { id: 'monedero_billete_qr', name: 'Monedero + Billetes ($) + Código QR', price: 825, subscription: 20, desc: 'Equipamiento full: monedero, billetero USD y código QR digital.' },
];

export default function QuoteModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Maracaibo',
    windowType: 'monedero_qr',
    includeFiltration: false,
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    
    const selectedWindow = WINDOW_OPTIONS.find(opt => opt.id === formData.windowType) || WINDOW_OPTIONS[0];
    const filtrationText = formData.includeFiltration ? 'Sí (+$749 USD)' : 'No (ya tengo sistema)';
    
    // Generate prefilled WhatsApp message
    const messageText = `Hola Alienwater, mi nombre es ${formData.name}. Estoy interesado en una cotización para la ciudad de ${formData.city}.\n\n` +
      `- Ventana: ${selectedWindow.name} ($${selectedWindow.price} USD${selectedWindow.subscription ? ' + $' + selectedWindow.subscription + '/mes' : ''})\n` +
      `- Sistema de Filtración: ${filtrationText}\n` +
      `- Correo: ${formData.email}\n` +
      `- Teléfono: ${formData.phone}\n` +
      `${formData.message ? '- Mensaje adicional: ' + formData.message : ''}`;
      
    const waUrl = `https://wa.me/584141666380?text=${encodeURIComponent(messageText)}`;
    
    // Redirect to WhatsApp after a brief delay
    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 font-sans shadow-2xl relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center font-bold text-sm transition-all duration-200"
            >
              ✕
            </button>

            <div className="mb-6">
              <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1 mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Cotización Inteligente
              </span>
              <h3 className="text-xl lg:text-2xl font-black text-white tracking-tight">
                Cotiza Tu Equipo Automático Hoy
              </h3>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                Ingresa tus datos y procesaremos de inmediato una propuesta adaptada a tu ciudad y capacidad comercial en Venezuela.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Grid 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Nombre Completo</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-500"><Building2 className="w-4 h-4" /></span>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ej: Carlos Gómez"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-9 text-xs focus:border-cyan-500 focus:outline-hidden text-slate-250"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Email Comercial</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-500"><Mail className="w-4 h-4" /></span>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ejemplo@correo.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-9 text-xs focus:border-cyan-500 focus:outline-hidden text-slate-250"
                    />
                  </div>
                </div>
              </div>

              {/* Grid 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Teléfono de Contacto</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-500"><Phone className="w-4 h-4" /></span>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Ej: +58 412 1234567"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-9 text-xs focus:border-cyan-500 focus:outline-hidden text-slate-250"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Ciudad en Venezuela</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-500"><MapPin className="w-4 h-4" /></span>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-9 text-xs focus:border-cyan-500 focus:outline-hidden text-slate-250 appearance-none font-sans"
                    >
                      <option value="Caracas">Caracas</option>
                      <option value="Maracaibo">Maracaibo</option>
                      <option value="Valencia">Valencia</option>
                      <option value="Barquisimeto">Barquisimeto</option>
                      <option value="Maracay">Maracay</option>
                      <option value="San Cristóbal">San Cristóbal</option>
                      <option value="Maturín">Maturín</option>
                      <option value="Puerto La Cruz">Puerto La Cruz</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Selector de Ventana */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-400 uppercase tracking-wider font-bold block">
                  Tipo de Ventana de Despacho
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500"><Building2 className="w-4 h-4" /></span>
                  <select
                    value={formData.windowType}
                    onChange={(e) => setFormData({ ...formData, windowType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 pl-9 text-xs focus:border-cyan-500 focus:outline-hidden text-slate-250 appearance-none font-sans"
                  >
                    {WINDOW_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.name} — ${opt.price} USD {opt.subscription > 0 ? `(+ $${opt.subscription}/mes)` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sistema de filtrado checkbox */}
              <div className="bg-slate-950/50 border border-slate-850 rounded-xl p-3 flex items-center justify-between gap-3">
                <div className="flex-1">
                  <span className="text-[11px] font-bold text-slate-200 block uppercase tracking-wide">
                    ¿Incluir Kit de Filtración Profesional?
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Filtro desbarrador, doble pulidor, lámpara UV 2 GPM, bomba de 1hp con presscontrol y tanque de 500L (+$749 USD).
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.includeFiltration}
                  onChange={(e) => setFormData({ ...formData, includeFiltration: e.target.checked })}
                  className="w-4.5 h-4.5 accent-cyan-500 cursor-pointer rounded-sm bg-slate-950 border-slate-800"
                />
              </div>

              {/* Nota sobre capacidad de producción */}
              <div className="text-[10px] text-slate-400 italic bg-cyan-950/10 border border-cyan-900/30 p-2.5 rounded-lg font-sans">
                * Nota: Todas las ventanas están fabricadas para producir 20 litros por minuto (1 botellón por minuto), incluyendo el proceso automático de lavado y llenado.
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Mensaje / Especificación Técnica Adicional</label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Escriba aquí alguna duda o consulta técnica..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs focus:border-cyan-500 focus:outline-hidden text-slate-250 text-sans"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 rounded-xl text-xs font-bold tracking-wider transition-all duration-300 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-400/20 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-1.5"
              >
                <Send className="w-4 h-4" /> ENVIAR SOLICITUD DE COTIZACIÓN
              </button>

              <div className="text-center">
                <span className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Información protegida por ley de confidencialidad de datos.
                </span>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 font-sans shadow-2xl text-center space-y-6"
          >
            <div className="w-16 h-16 bg-emerald-950 border-2 border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10 scale-110">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-white">¡Solicitud Procesada Exitosamente!</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Hola, <span className="text-white font-semibold">{formData.name}</span>. Hemos generado un registro de cotización comercial para la ciudad de <span className="text-cyan-400 font-bold">{formData.city}</span>.
              </p>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-850 text-left font-mono text-[11px] space-y-1.5 text-slate-400">
              <div>
                <span className="text-slate-500">Ventana:</span>{' '}
                {WINDOW_OPTIONS.find(opt => opt.id === formData.windowType)?.name || ''}
              </div>
              <div>
                <span className="text-slate-500">Filtrado:</span>{' '}
                {formData.includeFiltration ? 'Sí (+$749 USD)' : 'No'}
              </div>
              <div><span className="text-slate-500">Ciudad:</span> {formData.city}</div>
              <div><span className="text-slate-500">Teléfono:</span> {formData.phone}</div>
              <div><span className="text-slate-500">Estatus:</span> Redirigiendo a Asesor Comercial</div>
            </div>

            <p className="text-[11px] text-slate-400">
              Un asesor tecnológico de <strong className="text-white">Alienwater Venezuela</strong> se comunicará contigo vía telefónica o WhatsApp en las próximas 2 horas.
            </p>

            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-xl text-xs tracking-wider transition-all duration-200"
            >
              CERRAR VENTANA
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
