import { MessageCircle } from 'lucide-react';

export default function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/584141666380"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full shadow-2xl hover:shadow-emerald-500/30 hover:scale-110 active:scale-95 transition-all duration-350 group cursor-pointer"
      aria-label="Hablar con Alienwater por WhatsApp"
    >
      {/* Outer pulsing beacon */}
      <span className="absolute inset-0 rounded-full bg-emerald-500 opacity-40 animate-ping duration-3000 pointer-events-none" />
      
      <svg
        viewBox="0 0 24 24"
        className="w-7 h-7 fill-white stroke-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.967C16.488 2.022 14.02 1 11.393 1 5.956 1 1.532 5.37 1.529 10.8c-.002 1.766.47 3.483 1.37 5.02L1.932 20.2l4.715-1.046zM18.06 14.86c-.3-.15-1.774-.875-2.05-.976-.275-.1-.475-.15-.675.15-.2.3-.775.976-.95 1.176-.175.2-.35.225-.65.075-1.025-.513-1.74-.756-2.425-1.344-.585-.5-1.502-1.764-1.502-2.924 0-.3.1-.55.225-.7l.45-.45c.1-.1.175-.225.25-.375.075-.15.038-.275-.018-.375-.056-.1-.475-1.144-.65-1.569-.17-.412-.344-.356-.475-.362-.125-.006-.275-.006-.425-.006s-.4.056-.6.275c-.2.225-.775.756-.775 1.844 0 1.088.794 2.138.9 2.288.106.15 1.563 2.388 3.788 3.35.528.228 1.006.375 1.35.488.531.169 1.013.144 1.394.088.425-.062 1.775-.725 2.025-1.425.25-.7.25-1.294.175-1.425-.075-.125-.275-.2-.575-.35z" />
      </svg>
      
      {/* Floating tooltip */}
      <span className="absolute right-18 bg-slate-900 border border-slate-800 text-slate-100 text-xs font-bold font-sans py-1.5 px-3 rounded-xl shadow-lg opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 pointer-events-none transition-all duration-300 whitespace-nowrap select-none">
        ¿Cotizar por WhatsApp?
      </span>
    </a>
  );
}
