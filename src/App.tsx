/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Estatutos from './components/Estatutos';
import Footer from './components/Footer';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Benefits from './components/Benefits';
import ProfitCalculator from './components/ProfitCalculator';
import Reviews from './components/Reviews';
import IoTTracker from './components/IoTTracker';
import QuoteModal from './components/QuoteModal';
import WhatsAppFloat from './components/WhatsAppFloat';
import logoCircle from '@/LOGO alien water circulo.png';
import { Mail, Phone, MapPin, Instagram } from 'lucide-react';

function Landing() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  const handleSectionScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans antialiased overflow-x-hidden">
      
      {/* Header element */}
      <Header
        onLoginClick={() => setIsDashboardOpen(true)}
        onQuoteClick={() => setIsQuoteOpen(true)}
        onSectionScroll={handleSectionScroll}
        isLoggedIn={isDashboardOpen}
      />

      {/* Main visual sections */}
      <main className="relative z-10">
        {/* HERO SECTION */}
        <Hero onQuoteClick={() => setIsQuoteOpen(true)} />

        {/* ABOUT / INNOVACIÓN NACIONAL */}
        <About />

        {/* BENEFITS / BENEFICIOS */}
        <Benefits />

        {/* GOOGLE MAPS LOCATIONS SECTION */}
        <section id="mapa" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full bg-slate-900 border border-slate-800/80 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
            <div className="relative z-10 text-center max-w-3xl mx-auto mb-8">
              <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest block mb-2">
                Nuestros Equipos
              </span>
              <h3 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white mb-3">
                Mapa de Dispensadores en Venezuela
              </h3>
              <p className="text-slate-400 text-sm">
                Encuentra tu dispensador automático Alienwater más cercano en el territorio nacional.
              </p>
            </div>
            <div className="relative w-full h-[480px] rounded-2xl overflow-hidden border border-slate-800 shadow-lg bg-slate-950">
              <iframe
                src="https://www.google.com/maps/d/embed?mid=1rpnFFURE-hNS2Rh31AIfBb_dyg-Ad0M&ehbc=2E312F&noprof=1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                title="Puntos de Distribución Alienwater"
              ></iframe>
            </div>
          </div>
        </section>

        {/* PROFIT PROJECTION CALCULATOR */}
        <section id="calculadora" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProfitCalculator />
        </section>

        {/* CUSTOMER REVIEWS */}
        <Reviews />
      </main>

      {/* FOOTER */}
      <Footer />

      {/* OVERLAY: PORTAL IoT TELEMETRÍA */}
      {isDashboardOpen && (
        <IoTTracker onClose={() => setIsDashboardOpen(false)} />
      )}

      {/* MODAL: SOLICITUD DE COTIZACIÓN */}
      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />

      {/* Floating WhatsApp Action Widget */}
      <WhatsAppFloat />

    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/estatutos" element={<Estatutos />} />
    </Routes>
  );
}
