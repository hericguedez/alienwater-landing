import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, UserCheck, ShieldCheck, Sparkles } from 'lucide-react';
import logoCircle from '@/LOGO alien water circulo.png';

interface HeaderProps {
  onLoginClick: () => void;
  onQuoteClick: () => void;
  onSectionScroll: (sectionId: string) => void;
  isLoggedIn: boolean;
}

export default function Header({ onLoginClick, onQuoteClick, onSectionScroll, isLoggedIn }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', id: 'inicio' },
    { name: 'Acerca de', id: 'acerca' },
    { name: 'Beneficios', id: 'beneficios' },
    { name: 'Mapa', id: 'mapa' },
    { name: 'Calculadora', id: 'calculadora' },
  ];

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    onSectionScroll(id);
  };

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-350 font-sans ${
        isScrolled
          ? 'bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-md py-3 shadow-lg'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo matching original image */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleLinkClick('inicio')}>
          <img src={logoCircle} alt="Alienwater Logo" className={`w-auto object-contain transition-all duration-300 ${isScrolled ? 'h-14' : 'h-20'}`} />
        </div>

        {/* Desktop Links Navigation */}
        <div className="hidden md:flex items-center space-y-0 space-x-7">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className="text-xs lg:text-sm font-semibold tracking-wide text-slate-300 hover:text-cyan-400 cursor-pointer transition-all duration-200"
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Action button login/portal */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={onQuoteClick}
            className="px-4.5 py-1.5 bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 rounded-full text-xs font-black tracking-wider transition-all duration-300 hover:shadow-cyan-500/20 cursor-pointer shadow-md"
          >
            COTIZAR
          </button>
        </div>

        {/* Mobile menu trigger button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 text-slate-300 hover:text-white transition-all duration-200 focus:outline-hidden"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drop menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 border-b border-slate-850 px-4 py-5 space-y-4 shadow-xl backdrop-blur-lg">
          <div className="flex flex-col space-y-3 pb-3 border-b border-slate-900">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className="text-left py-1.5 text-xs uppercase tracking-wider font-bold text-slate-300 hover:text-cyan-400"
              >
                {link.name}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onQuoteClick();
              }}
              className="w-full text-center py-2.5 bg-linear-to-r from-cyan-500 to-blue-500 text-slate-950 font-black rounded-xl text-xs tracking-wider"
            >
              COTIZAR MÁQUINA
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
