import Header from './Header';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

export default function Estatutos() {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-sans antialiased overflow-x-hidden">
      <Header 
        isLoggedIn={false} 
        onLoginClick={() => navigate('/')} 
        onQuoteClick={() => navigate('/')} 
        onSectionScroll={(id) => {
          navigate('/');
          setTimeout(() => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }} 
      />
      
      <main className="max-w-4xl mx-auto px-4 py-32 relative z-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-10 leading-tight">
          ESTATUTOS SOCIALES DE LA ASOCIACIÓN CIVIL <br className="hidden md:block"/> 
          <span className="text-cyan-400">"CLUB PRIVADO DE BIENESTAR E HIDRATACIÓN INTEGRAL ALIENWATER"</span>
        </h1>
        
        <div className="text-slate-300 space-y-8 text-sm md:text-base leading-relaxed">
          <section className="bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-800">
            <h2 className="text-xl font-bold text-cyan-400 mb-4 border-b border-slate-800 pb-2">
              CAPÍTULO I: DENOMINACIÓN, OBJETO, DOMICILIO Y DURACIÓN
            </h2>
            <p className="mb-4"><strong className="text-white">ARTÍCULO PRIMERO:</strong> La Asociación se denominará "CLUB PRIVADO DE BIENESTAR E HIDRATACIÓN INTEGRAL ALIENWATER", pudiendo utilizar comercialmente la marca "ALIENWATER". Es una institución privada, de carácter civil, sin fines de lucro, con personalidad jurídica propia y plena capacidad para obligarse y ejercer derechos.</p>
            <p className="mb-4"><strong className="text-white">ARTÍCULO SEGUNDO:</strong> El objeto principal de la Asociación es la promoción, fomento, autogestión y desarrollo de una comunidad privada orientada al bienestar físico, la salud y la hidratación de sus miembros asociados. Para el cumplimiento de sus fines, la Asociación podrá: a) Adquirir, instalar, mantener y administrar infraestructura tecnológica, módulos electrónicos de purificación de fluidos y sistemas automatizados de filtración multi-etapa para el uso exclusivo y cerrado de sus miembros inscritos; b) Fomentar la educación sanitaria y la cultura ecológica; c) Celebrar contratos de arrendamiento de espacios privados y contratos de servicios tecnológicos con proveedores especializados. Queda expresamente establecido que la Asociación no realiza actividades de comercialización, expendio, ni venta de agua potable al detal al público general, limitándose a la administración y distribución controlada de sus activos tecnológicos entre los miembros que integren la comunidad bajo estrictos principios de autogestión y derecho de admisión.</p>
            <p className="mb-4"><strong className="text-white">ARTÍCULO TERCERO:</strong> El domicilio de la Asociación será en la ciudad de Maracaibo, Municipio Maracaibo, Estado Zulia, República Bolivariana de Venezuela, pudiendo establecer estaciones de servicio automatizadas para socios en cualquier estacionamiento o recinto privado del territorio nacional.</p>
            <p className="mb-2"><strong className="text-white">ARTÍCULO CUARTO:</strong> La Asociación tendrá una duración de noventa y nueve (99) años, contados a partir de la fecha de su correspondiente registro o notaría.</p>
          </section>

          <section className="bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-800">
            <h2 className="text-xl font-bold text-cyan-400 mb-4 border-b border-slate-800 pb-2">
              CAPÍTULO II: DE LOS MIEMBROS ASOCIADOS Y EL ACCESO DIGITAL
            </h2>
            <p className="mb-4"><strong className="text-white">ARTÍCULO QUINTO:</strong> Serán miembros asociados todas aquellas personas naturales que completen satisfactoriamente el proceso de registro digital automatizado en la plataforma oficial del Club (Bot de WhatsApp / Aplicación), declaren su voluntad de adherirse a los presentes estatutos y reciban su credencial electrónica única de acceso (Código QR).</p>
            <p className="mb-4"><strong className="text-white">ARTÍCULO SEXTO:</strong> Por tratarse de una organización de carácter estrictamente privado, la Asociación se reserva el derecho de admisión de sus miembros. Ninguna persona ajena al club o que no ostente la condición de miembro activo debidamente verificado por la plataforma digital podrá tener acceso físico ni operativo a las estaciones de filtrado de la Asociación, las cuales permanecerán bloqueadas electrónicamente mediante sistemas magnéticos automatizados las veinticuatro (24) horas del día.</p>
            <p className="mb-2"><strong className="text-white">ARTÍCULO SÉPTIMO:</strong> Es condición obligatoria para el uso de la infraestructura del club que cada miembro asociado provea, transporte y garantice la higiene, lavado y desinfección interna y externa de sus propios envases retornables. La Asociación suministra y garantiza la tecnología de purificación del fluido en el punto de despacho automatizado, pero la inocuidad final del envase es de exclusiva responsabilidad del socio que consume, eximiendo a la junta directiva de la Asociación y a sus proveedores tecnológicos legítimos (AlienTech) de cualquier gestión o responsabilidad higiénica sobre recipientes de propiedad privada.</p>
          </section>

          <section className="bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-800">
            <h2 className="text-xl font-bold text-cyan-400 mb-4 border-b border-slate-800 pb-2">
              CAPÍTULO III: DEL PATRIMONIO Y EL SOSTENIMIENTO DIGITAL
            </h2>
            <p className="mb-4"><strong className="text-white">ARTÍCULO OCTAVO:</strong> El patrimonio de la Asociación estará constituido por los aportes iniciales de los miembros fundadores, las donaciones legítimas que reciba y, principalmente, por las Cuotas de Sostenimiento Tecnológico (Créditos o Membresías de Hidratación) que los miembros asociados abonen a través de las pasarelas digitales de pago. Estos ingresos se destinarán única y exclusivamente al mantenimiento técnico de las estaciones (filtros de carbón, sedimentos, membranas de ósmosis inversa, lámparas UV), sistemas de software, energía eléctrica y cánones de arrendamiento de los espacios privados donde operen los módulos.</p>
            <p className="mb-2"><strong className="text-white">ARTÍCULO NOVENO:</strong> El pago de las cuotas de sostenimiento, contribuciones o membresías por parte de los miembros asociados solo les otorga el derecho personal, condicionado e intransferible de uso de la infraestructura tecnológica del Club. Bajo ninguna circunstancia la condición de miembro asociado conferirá derechos de propiedad, copropiedad, acciones, cuotas de participación o derechos gananciales sobre el patrimonio físico, marcas o equipos de la Asociación, los cuales pertenecen de forma indiscutible a la institución o a sus respectivos proveedores y arrendadores tecnológicos (AlienTech, C.A.).</p>
          </section>

          <section className="bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-800">
            <h2 className="text-xl font-bold text-cyan-400 mb-4 border-b border-slate-800 pb-2">
              CAPÍTULO IV: DE LA DIRECCIÓN Y ADMINISTRACIÓN
            </h2>
            <p className="mb-2"><strong className="text-white">ARTÍCULO DÉCIMO:</strong> La Dirección, Administración y Representación Legal de la Asociación estará a cargo de una Junta Directiva conformada por un Director General y un Presidente Ejecutivo, quienes durarán cinco (5) años en sus funciones y podrán ser reelectos. El Director General tendrá las más amplias facultades de administración, disposición y control de la Asociación. El Presidente Ejecutivo ostentará la representación jurídica e institucional ante las autoridades nacionales, municipales o sanitarias, quedando facultado para suscribir contratos civiles de arrendamiento y de servicios con terceros proveedores.</p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
