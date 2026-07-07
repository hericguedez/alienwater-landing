import logoCircle from '@/LOGO alien water circulo.png';
import { Mail, Phone, MapPin, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contacto" className="bg-slate-950 border-t border-slate-900 py-16 text-slate-400 font-sans relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Logo & Slogan Column */}
        <div className="md:col-span-4 space-y-4 text-left">
          <div className="flex items-center gap-2.5">
            <img src={logoCircle} alt="Alienwater Logo" className="h-16 w-auto object-contain" />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed font-light font-sans">
            La evolución en la distribución de agua purificada en Venezuela. Maquinaria automatizada robusta con tecnología IoT satelital.
          </p>
        </div>

        {/* Contact Details Column */}
        <div className="md:col-span-4 space-y-2.5 text-xs text-left">
          <h4 className="text-sm font-bold text-slate-200 uppercase tracking-widest font-sans mb-3 select-none">Contacto Directo</h4>
          <div className="flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Dirección: Sector Santa María, calle 71 con avenida 27. Frente a la plaza la cruz. Maracaibo, Venezuela.</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Teléfono: +58 414-1666380</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Email: contacto@alienwater.ve</span>
          </div>
        </div>

        {/* Social Icons & Copyright */}
        <div className="md:col-span-4 flex flex-col items-center md:items-end space-y-4">
          <div className="flex gap-4">
            <a href="https://www.instagram.com/alienwatermcbo/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all duration-200" title="Instagram">
              <Instagram className="w-4.5 h-4.5" />
            </a>
            <a href="https://vm.tiktok.com/ZS9jbn4HC58mh-CF7rc/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all duration-200" title="TikTok">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.72 3.01 1.83 4.09.92.89 2.15 1.44 3.44 1.61v3.58c-1.4-.04-2.77-.47-3.92-1.27-.47-.32-.88-.73-1.23-1.19V14.5c0 1.25-.26 2.51-.78 3.63-.8 1.76-2.31 3.19-4.14 3.73-1.85.57-3.93.38-5.63-.52-2-1.07-3.32-3.14-3.52-5.42-.31-3.18 1.95-6.2 5.09-6.8 1.23-.25 2.53-.11 3.69.4v3.63c-.88-.54-1.95-.71-2.95-.44-1.24.31-2.28 1.34-2.52 2.59-.34 1.58.53 3.29 2.05 3.86 1.28.5 2.8.23 3.79-.67.45-.4.72-.96.79-1.57.06-1.58.02-3.17.03-4.75 0-3.39-.01-6.78 0-10.17z"/></svg>
            </a>
          </div>
          <p className="text-[10px] text-slate-650 font-mono text-center md:text-right">
            © 2026 Alienwater. Todos los derechos reservados. <br />
            Hecho con orgullo en Venezuela.
          </p>
        </div>

      </div>
    </footer>
  );
}
