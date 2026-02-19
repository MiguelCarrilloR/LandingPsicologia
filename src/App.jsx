import { useState, useEffect, useRef } from "react";

const colors = {
  sage: "#7a9e8a",
  sageLight: "#b2cdc0",
  sagePale: "#e8f0ec",
  cream: "#faf7f2",
  warmWhite: "#f5f0e8",
  stone: "#8b7d6b",
  stoneDark: "#5c4f42",
  charcoal: "#2e2a26",
  blush: "#d4a5a5",
  blushLight: "#f0dede",
};

// ─── Inline font injection ───────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
    html { scroll-behavior: smooth; }
    * { box-sizing: border-box; }
    body { font-family: 'DM Sans', sans-serif; background: #faf7f2; overflow-x: hidden; }
    .font-serif { font-family: 'Cormorant Garamond', serif !important; }
    .fade-up { opacity: 0; transform: translateY(28px); transition: opacity 0.7s ease, transform 0.7s ease; }
    .fade-up.visible { opacity: 1; transform: translateY(0); }
    .blob-filter { filter: blur(80px); }
    .backdrop-blur-nav { backdrop-filter: blur(8px); }
    @keyframes pulse-slow { 0%,100%{transform:scale(1);} 50%{transform:scale(1.04);} }
    .pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
  `}</style>
);

// ─── Hooks ───────────────────────────────────────────────────────────────────
function useScrolled(threshold = 40) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, [threshold]);
  return scrolled;
}

function useFadeUp() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ─── Small components ────────────────────────────────────────────────────────
const SectionLabel = ({ children, light }) => (
  <span
    className="block text-xs font-medium tracking-widest uppercase mb-2"
    style={{ color: light ? colors.sageLight : colors.sage }}
  >
    {children}
  </span>
);

const Divider = ({ light }) => (
  <div
    className="w-12 h-0.5 my-5"
    style={{ background: light ? colors.blush : colors.sage }}
  />
);

const SectionTitle = ({ children, light, className = "" }) => (
  <h2
    className={`font-serif text-4xl md:text-5xl font-light leading-tight ${className}`}
    style={{ color: light ? "#fff" : colors.charcoal }}
  >
    {children}
  </h2>
);

// ─── NAV ─────────────────────────────────────────────────────────────────────
const NavLink = ({ href, children, scrolled, cta }) => (
  <a
    href={href}
    className={`text-xs font-medium tracking-widest uppercase transition-colors duration-300 ${
      cta
        ? "px-5 py-2 rounded-full text-white"
        : scrolled
        ? "hover:text-sage"
        : "hover:text-sage-light"
    }`}
    style={{
      color: cta ? "#fff" : scrolled ? colors.stone : "rgba(255,255,255,0.85)",
      background: cta ? colors.sage : "transparent",
      textDecoration: "none",
    }}
  >
    {children}
  </a>
);

function Navbar({ onOpenMenu }) {
  const scrolled = useScrolled();
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-400 ${
        scrolled ? "backdrop-blur-nav shadow-sm" : ""
      }`}
      style={{ background: scrolled ? "rgba(250,247,242,0.96)" : "transparent" }}
    >
      <a
        href="#"
        className="font-serif text-xl font-semibold tracking-wide no-underline transition-colors duration-300"
        style={{ color: scrolled ? colors.charcoal : colors.cream }}
      >
        Carlos Ariel Carrillo · PSI
      </a>
      <div className="hidden lg:flex items-center gap-8">
        {[["#about","Sobre mí"],["#services","Servicios"],["#approach","Mi enfoque"],["#testimonials","Testimonios"]].map(([href,label]) => (
          <NavLink key={href} href={href} scrolled={scrolled}>{label}</NavLink>
        ))}
        <NavLink href="#contact" scrolled={scrolled} cta>Solicitar consulta</NavLink>
      </div>
      <button
        className="lg:hidden flex flex-col gap-1.5 cursor-pointer bg-transparent border-none"
        onClick={onOpenMenu}
      >
        {[0,1,2].map(i => (
          <span key={i} className="block w-6 h-0.5 transition-colors duration-300"
            style={{ background: scrolled ? colors.charcoal : "#fff" }} />
        ))}
      </button>
    </nav>
  );
}

// ─── MOBILE MENU ─────────────────────────────────────────────────────────────
function MobileMenu({ open, onClose }) {
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-10 transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      style={{ background: "rgba(46,42,38,0.97)" }}
    >
      <button
        className="absolute top-5 right-5 text-3xl bg-transparent border-none cursor-pointer"
        style={{ color: "rgba(255,255,255,0.5)" }}
        onClick={onClose}
      >✕</button>
      {[["#about","Sobre mí"],["#services","Servicios"],["#approach","Mi enfoque"],["#testimonials","Testimonios"],["#faq","FAQ"],["#contact","Contacto"]].map(([href,label]) => (
        <a
          key={href} href={href}
          className="font-serif text-4xl font-light no-underline transition-colors duration-200"
          style={{ color: "rgba(255,255,255,0.85)" }}
          onClick={onClose}
        >{label}</a>
      ))}
    </div>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-28 pb-16"
      style={{ background: "linear-gradient(160deg, #3d5a4a 0%, #5d7a6a 40%, #7a9e8a 100%)" }}
    >
      {/* dot pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='2' fill='%23ffffff' fill-opacity='0.04'/%3E%3C/svg%3E")`,
        }}
      />
      {/* blobs */}
      <div className="absolute rounded-full blob-filter pointer-events-none"
        style={{ width:600, height:600, background:colors.blush, opacity:0.22, top:-200, right:-150 }} />
      <div className="absolute rounded-full blob-filter pointer-events-none"
        style={{ width:400, height:400, background:"#b5cfc0", opacity:0.22, bottom:-100, left:-100 }} />

      <div className="relative z-10 max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
        {/* text */}
        <div>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light leading-none text-white mb-6">
            Ambientes<br /><em>seguros</em>,<br />personas sanas
          </h1>
          <p className="text-base leading-relaxed mb-8 max-w-md" style={{ color:"rgba(255,255,255,0.78)" }}>
            Psicólogo especialista en Gerencia de Riesgos Laborales y Seguridad y Salud en el Trabajo. Acompaño personas y organizaciones hacia el bienestar integral.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#contact"
              className="inline-block px-7 py-3 rounded-full text-sm font-medium tracking-wide uppercase no-underline transition-all duration-200 hover:-translate-y-0.5"
              style={{ background:"#fff", color:colors.stoneDark, boxShadow:"0 4px 20px rgba(0,0,0,0.18)" }}>
              Solicitar consulta
            </a>
            <a href="#about"
              className="inline-block px-7 py-3 rounded-full text-sm font-medium tracking-wide uppercase no-underline transition-all duration-200"
              style={{ border:"1.5px solid rgba(255,255,255,0.6)", color:"#fff" }}>
              Conoce más
            </a>
          </div>
        </div>
        {/* photo */}
        <div className="flex justify-center items-center relative">
          <div
            className="pulse-slow flex items-center justify-center"
            style={{
              width:340, height:430,
              borderRadius:"60% 40% 55% 45% / 50% 45% 55% 50%",
              background:`linear-gradient(135deg, ${colors.sageLight}, ${colors.blushLight})`,
              boxShadow:"0 30px 80px rgba(0,0,0,0.25)", overflow:"hidden",
            }}
          >
            <span className="font-serif text-base text-center px-8 leading-relaxed" style={{ color:colors.stone }}>
              📸 Foto profesional<br />de Carlos Ariel
            </span>
          </div>
          <div
            className="absolute bottom-8 -right-2 flex items-center gap-3 rounded-2xl px-4 py-3"
            style={{ background:"#fff", boxShadow:"0 10px 40px rgba(0,0,0,0.15)" }}
          >
            <span className="text-2xl">🏢</span>
            <div>
              <p className="text-xs font-medium leading-tight" style={{ color:colors.stone }}>
                <strong className="block" style={{ color:colors.charcoal }}>SST & Riesgos</strong>
                Laborales · Bogotá
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── ABOUT ───────────────────────────────────────────────────────────────────
function About() {
  const imgRef = useFadeUp();
  const textRef = useFadeUp();
  return (
    <section id="about" className="py-24 px-6" style={{ background:colors.cream }}>
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div ref={imgRef} className="fade-up relative">
          <div
            className="w-full aspect-[3/4] flex items-center justify-center"
            style={{
              borderRadius:"40% 60% 50% 50% / 40% 40% 60% 60%",
              background:`linear-gradient(150deg, ${colors.sagePale}, ${colors.blushLight})`,
              boxShadow:"0 20px 60px rgba(0,0,0,0.09)", overflow:"hidden",
            }}
          >
            <p className="font-serif text-sm text-center px-10 leading-relaxed" style={{ color:colors.stone }}>
              📸 Foto de Carlos Ariel Carrillo
            </p>
          </div>
          <div
            className="absolute -bottom-4 -right-2 lg:-right-8 rounded-2xl px-5 py-4"
            style={{ background:colors.charcoal, boxShadow:"0 10px 40px rgba(0,0,0,0.2)" }}
          >
            <span className="font-serif text-5xl font-semibold leading-none block" style={{ color:colors.sageLight }}>+200</span>
            <p className="text-xs mt-1" style={{ color:"rgba(255,255,255,0.6)" }}>organizaciones asesoradas</p>
          </div>
        </div>
        <div ref={textRef} className="fade-up">
          <SectionLabel>Sobre mí</SectionLabel>
          <SectionTitle>Hola, soy Carlos.<br /><em>Psicólogo SST</em></SectionTitle>
          <Divider />
          <p className="text-sm leading-relaxed mb-4" style={{ color:colors.stone }}>
            Soy psicólogo especialista en Gerencia de Riesgos Laborales y Seguridad y Salud en el Trabajo (SST). Me apasiona construir entornos laborales donde las personas puedan desempeñarse con bienestar, seguridad y propósito.
          </p>
          <p className="text-sm leading-relaxed mb-6" style={{ color:colors.stone }}>
            Combino el conocimiento clínico con una visión organizacional estratégica para identificar, evaluar e intervenir los factores de riesgo psicosocial que afectan tanto a trabajadores como a empresas.
          </p>
          <div className="flex flex-col gap-3">
            {[
              "Psicólogo — Tarjeta profesional vigente",
              "Especialista en Gerencia de Riesgos Laborales",
              "Especialista en Seguridad y Salud en el Trabajo (SST)",
              "Consultor certificado en factores de riesgo psicosocial",
            ].map((c, i) => (
              <div key={i} className="flex items-start gap-3 text-sm" style={{ color:colors.stoneDark }}>
                <span className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0" style={{ background:colors.sage }} />
                {c}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SERVICES ────────────────────────────────────────────────────────────────
const services = [
  { icon:"🔍", title:"Evaluación de Riesgo Psicosocial", desc:"Diagnóstico integral de factores de riesgo psicosocial intralaboral y extralaboral, con batería oficial del Ministerio de Salud." },
  { icon:"🏗️", title:"Diseño de SG-SST", desc:"Estructuración, implementación y seguimiento del Sistema de Gestión de SST según normativa colombiana vigente." },
  { icon:"🧠", title:"Atención Psicológica Individual", desc:"Acompañamiento clínico para trabajadores con afectaciones por estrés laboral, burnout, acoso o accidentes de trabajo." },
  { icon:"👥", title:"Talleres y Capacitaciones", desc:"Formación a equipos en manejo del estrés, comunicación asertiva, prevención del acoso laboral y bienestar ocupacional." },
  { icon:"📋", title:"Investigación de Incidentes", desc:"Análisis causal de accidentes e incidentes laborales con enfoque en factores humanos y organizacionales." },
  { icon:"💻", title:"Asesoría Online", desc:"Consultoría y sesiones virtuales para empresas y profesionales de cualquier ciudad del país." },
];

function Services() {
  return (
    <section id="services" className="py-24 px-6" style={{ background:colors.charcoal }}>
      <div className="max-w-5xl mx-auto">
        <SectionLabel light>Lo que ofrezco</SectionLabel>
        <SectionTitle light>Servicios <em>especializados</em></SectionTitle>
        <Divider light />
        <p className="text-sm leading-relaxed max-w-lg mt-1 mb-12" style={{ color:"rgba(255,255,255,0.55)" }}>
          Intervenciones psicológicas y organizacionales basadas en evidencia, adaptadas tanto a trabajadores como a empresas de todos los sectores.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => {
            const ref = useFadeUp();
            return (
              <div
                key={i} ref={ref}
                className="fade-up rounded-2xl p-7 border transition-all duration-300 cursor-default group"
                style={{
                  background:"rgba(255,255,255,0.05)",
                  borderColor:"rgba(255,255,255,0.08)",
                  transitionDelay:`${i * 0.08}s`,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl mb-5"
                  style={{ background:colors.sage }}>
                  {s.icon}
                </div>
                <h3 className="font-serif text-xl font-normal text-white mb-3">{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color:"rgba(255,255,255,0.55)" }}>{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── APPROACH ────────────────────────────────────────────────────────────────
const steps = [
  { title:"Diagnóstico inicial", desc:"Levantamiento de información para entender la realidad de tu organización o situación personal: riesgos presentes, contexto y necesidades." },
  { title:"Plan de intervención a medida", desc:"Plan claro y normativo adaptado a tu sector, tamaño de empresa y objetivos, con indicadores medibles desde el primer momento." },
  { title:"Implementación y acompañamiento", desc:"Talleres, evaluaciones, consultas individuales — con seguimiento continuo para asegurar resultados reales." },
  { title:"Evaluación y mejora continua", desc:"Medimos el impacto de cada acción y entregamos reportes con recomendaciones para consolidar una cultura de seguridad sostenible." },
];

function Approach() {
  const visRef = useFadeUp();
  const stepsRef = useFadeUp();
  return (
    <section id="approach" className="py-24 px-6" style={{ background:colors.sagePale }}>
      <div className="max-w-5xl mx-auto">
        <SectionLabel>Mi metodología</SectionLabel>
        <SectionTitle>Cómo <em>trabajo contigo</em></SectionTitle>
        <Divider />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-8 items-center">
          {/* circles visual */}
          <div ref={visRef} className="fade-up relative h-80 lg:h-96">
            <div className="absolute top-0 left-0 w-64 h-64 rounded-full flex items-center justify-center text-center"
              style={{ background:colors.sage }}>
              <div className="text-white px-6">
                <span className="font-serif text-4xl font-semibold block leading-none">SST</span>
                <p className="text-xs mt-1 opacity-90">Seguridad y Salud<br />en el Trabajo</p>
              </div>
            </div>
            <div className="absolute bottom-4 right-4 w-44 h-44 rounded-full flex items-center justify-center text-center"
              style={{ background:colors.blush }}>
              <div className="text-white px-4">
                <span className="text-3xl block">🏢</span>
                <p className="text-xs mt-1 opacity-90">Psicología<br />organizacional</p>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full flex items-center justify-center text-center"
              style={{ background:colors.cream }}>
              <div className="px-2" style={{ color:colors.sage }}>
                <span className="font-serif text-2xl font-semibold block leading-none">GRL</span>
                <p className="text-xs mt-0.5">Gestión de riesgos</p>
              </div>
            </div>
          </div>
          {/* steps */}
          <div ref={stepsRef} className="fade-up flex flex-col gap-4">
            {steps.map((s, i) => (
              <div key={i} className="flex gap-4 items-start rounded-2xl p-5"
                style={{ background:"#fff", boxShadow:"0 4px 20px rgba(0,0,0,0.05)" }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium text-white flex-shrink-0"
                  style={{ background:colors.sage }}>{i + 1}</div>
                <div>
                  <h4 className="text-sm font-medium mb-1" style={{ color:colors.charcoal }}>{s.title}</h4>
                  <p className="text-xs leading-relaxed" style={{ color:colors.stone }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
const testimonials = [
  { text:"Carlos nos ayudó a estructurar nuestro SG-SST desde cero. Su manejo de la normativa colombiana y su enfoque práctico hicieron todo el proceso mucho más sencillo de lo que esperábamos.", name:"Ricardo M.", role:"Gerente RRHH — Empresa constructora", initial:"R" },
  { text:"Gracias al diagnóstico de riesgo psicosocial que realizó Carlos, entendimos por qué teníamos tanta rotación. Las intervenciones que propuso cambiaron el clima laboral radicalmente.", name:"Andrea S.", role:"Directora — Empresa de logística", initial:"A" },
  { text:"Asistí a la atención individual después de un accidente laboral. Carlos me dio herramientas reales para superar el miedo a volver al trabajo. Su apoyo fue fundamental en mi recuperación.", name:"Javier T.", role:"Trabajador — Sector manufactura", initial:"J" },
];

function Testimonials() {
  return (
    <section id="testimonials" className="py-24 px-6" style={{ background:colors.cream }}>
      <div className="max-w-5xl mx-auto">
        <SectionLabel>Voces de clientes</SectionLabel>
        <SectionTitle>Lo que <em>dicen</em> de su experiencia</SectionTitle>
        <Divider />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
          {testimonials.map((t, i) => {
            const ref = useFadeUp();
            return (
              <div
                key={i} ref={ref}
                className="fade-up relative rounded-2xl p-7 transition-all duration-300 cursor-default"
                style={{ background:colors.warmWhite, boxShadow:"0 4px 20px rgba(0,0,0,0.04)", transitionDelay:`${i*0.12}s` }}
                onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 12px 40px rgba(0,0,0,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,0.04)"; }}
              >
                <span className="font-serif text-7xl font-light absolute top-2 left-5 leading-none" style={{ color:colors.sageLight }}>&#8220;</span>
                <div className="text-xs tracking-wider mb-1 mt-8" style={{ color:"#c9a96e" }}>★★★★★</div>
                <p className="text-sm leading-relaxed mt-6" style={{ color:colors.stone }}>{t.text}</p>
                <div className="flex items-center gap-3 mt-5">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-serif text-lg font-semibold flex-shrink-0"
                    style={{ background:colors.sageLight, color:colors.stoneDark }}>
                    {t.initial}
                  </div>
                  <div>
                    <strong className="block text-sm font-medium" style={{ color:colors.charcoal }}>{t.name}</strong>
                    <span className="text-xs" style={{ color:colors.stone }}>{t.role}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const faqs = [
  { q:"¿Qué empresas se pueden beneficiar de estos servicios?", a:"Empresas de cualquier tamaño y sector: desde pymes hasta grandes corporaciones. La normativa SST colombiana aplica a toda organización con trabajadores, independientemente del sector o actividad económica." },
  { q:"¿Qué incluye el SG-SST que diseñas?", a:"Incluye política SST, matriz de peligros, plan anual de trabajo, indicadores, procedimientos de emergencia, programas de vigilancia epidemiológica y todo lo requerido por el Decreto 1072 de 2015 y la Resolución 0312 de 2019." },
  { q:"¿También atiende a trabajadores de forma individual?", a:"Sí. Ofrezco atención psicológica individual a trabajadores afectados por estrés laboral, burnout, acoso laboral o secuelas de accidentes de trabajo, presencial en Bogotá o en modalidad virtual." },
  { q:"¿Puedo contratar servicios de forma virtual desde otra ciudad?", a:"Absolutamente. Trabajo con empresas y personas en todo Colombia de manera virtual, sin pérdida de calidad. Las asesorías, capacitaciones y sesiones individuales se realizan con total efectividad por videollamada." },
  { q:"¿Cómo se cotiza el servicio para una empresa?", a:"Cada propuesta es personalizada según el tamaño de la empresa, el nivel de riesgo de la actividad y los servicios requeridos. Contáctame para una reunión diagnóstica gratuita y recibir una cotización sin compromiso." },
];

function FAQ() {
  const [open, setOpen] = useState(null);
  const introRef = useFadeUp();
  return (
    <section id="faq" className="py-24 px-6" style={{ background:colors.sagePale }}>
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div ref={introRef} className="fade-up">
          <SectionLabel>Preguntas frecuentes</SectionLabel>
          <SectionTitle>¿Tienes <em>dudas</em>?</SectionTitle>
          <Divider />
          <p className="text-sm leading-relaxed" style={{ color:colors.stone }}>
            Es normal tener dudas antes de contratar un servicio de consultoría o psicología laboral. Aquí respondo las más frecuentes. Si la tuya no está, escríbeme.
          </p>
          <a
            href="#contact"
            className="inline-block mt-6 px-6 py-3 rounded-full text-xs font-medium tracking-widest uppercase no-underline transition-all duration-200"
            style={{ background:colors.sage, color:"#fff" }}
          >
            Hacer una consulta
          </a>
        </div>
        <div className="flex flex-col gap-3">
          {faqs.map((f, i) => (
            <div key={i} className="rounded-xl overflow-hidden" style={{ background:"#fff", boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }}>
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left bg-transparent border-none cursor-pointer text-sm font-medium transition-colors duration-200"
                style={{ color: open === i ? colors.sage : colors.charcoal }}
                onClick={() => setOpen(open === i ? null : i)}
              >
                {f.q}
                <span className="text-lg ml-4 transition-transform duration-300 flex-shrink-0"
                  style={{ color:colors.sage, transform: open === i ? "rotate(45deg)" : "rotate(0deg)" }}>+</span>
              </button>
              <div
                className="overflow-hidden transition-all duration-400 text-xs leading-relaxed px-5"
                style={{
                  maxHeight: open === i ? 200 : 0,
                  paddingBottom: open === i ? "1rem" : 0,
                  color: colors.stone,
                }}
              >
                {f.a}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────
function Contact() {
  const infoRef = useFadeUp();
  const formRef = useFadeUp();
  return (
    <section id="contact" className="py-24 px-6" style={{ background:colors.charcoal }}>
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div ref={infoRef} className="fade-up">
          <SectionLabel light>Contacto</SectionLabel>
          <SectionTitle light>Hablemos de tu <em>necesidad</em></SectionTitle>
          <Divider light />
          <p className="text-sm leading-relaxed mb-8" style={{ color:"rgba(255,255,255,0.55)" }}>
            ¿Eres trabajador, empresa o profesional de SST? Cuéntame tu situación y te respondo en menos de 24 horas con una propuesta o una primera orientación gratuita.
          </p>
          {[
            { icon:"📱", label:"WhatsApp / Llamada", val:"+57 311 225 4009" },
            { icon:"✉️", label:"Correo electrónico", val:"carloscarrillopsi@gmail.com" },
            { icon:"📍", label:"Consulta presencial — Bogotá", val:"Calle 137 #49-45, Bogotá D.C." },
            { icon:"🕐", label:"Disponibilidad", val:"Lunes a viernes: 8:00 – 18:00 h" },
          ].map((d, i) => (
            <div key={i} className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-base flex-shrink-0"
                style={{ background:"rgba(255,255,255,0.07)" }}>{d.icon}</div>
              <div>
                <strong className="block text-xs tracking-widest uppercase mb-0.5" style={{ color:colors.sageLight }}>{d.label}</strong>
                <span className="text-sm" style={{ color:"rgba(255,255,255,0.75)" }}>{d.val}</span>
              </div>
            </div>
          ))}
        </div>
        <div ref={formRef} className="fade-up">
          <div className="grid grid-cols-2 gap-4 mb-4">
            {[["Nombre","text","Tu nombre completo"],["Correo electrónico","email","tu@email.com"]].map(([label,type,placeholder]) => (
              <div key={label}>
                <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color:"rgba(255,255,255,0.45)" }}>{label}</label>
                <input type={type} placeholder={placeholder}
                  className="w-full rounded-lg px-4 py-3 text-sm text-white outline-none transition-colors duration-200 border"
                  style={{ background:"rgba(255,255,255,0.07)", borderColor:"rgba(255,255,255,0.12)" }}
                  onFocus={e=>e.target.style.borderColor=colors.sage}
                  onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.12)"} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color:"rgba(255,255,255,0.45)" }}>Teléfono</label>
              <input type="tel" placeholder="+57 300 000 0000"
                className="w-full rounded-lg px-4 py-3 text-sm text-white outline-none border transition-colors duration-200"
                style={{ background:"rgba(255,255,255,0.07)", borderColor:"rgba(255,255,255,0.12)" }}
                onFocus={e=>e.target.style.borderColor=colors.sage}
                onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.12)"} />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color:"rgba(255,255,255,0.45)" }}>Modalidad</label>
              <select className="w-full rounded-lg px-4 py-3 text-sm outline-none border transition-colors duration-200"
                style={{ background:"rgba(255,255,255,0.07)", borderColor:"rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.7)" }}>
                <option value="">Selecciona...</option>
                {["Presencial","Online (videollamada)","Sin preferencia"].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color:"rgba(255,255,255,0.45)" }}>¿Cómo puedo ayudarte?</label>
            <select className="w-full rounded-lg px-4 py-3 text-sm outline-none border transition-colors duration-200"
              style={{ background:"rgba(255,255,255,0.07)", borderColor:"rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.7)" }}>
              <option value="">Selecciona un servicio...</option>
              {["Diseño o implementación de SG-SST","Evaluación de riesgo psicosocial","Atención psicológica individual","Investigación de accidentes laborales","Capacitación o talleres para equipo","Asesoría online","Otro"].map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="mb-5">
            <label className="block text-xs tracking-widest uppercase mb-1.5" style={{ color:"rgba(255,255,255,0.45)" }}>Mensaje (opcional)</label>
            <textarea rows={4} placeholder="Describe brevemente tu situación o la de tu empresa..."
              className="w-full rounded-lg px-4 py-3 text-sm text-white outline-none border transition-colors duration-200 resize-none"
              style={{ background:"rgba(255,255,255,0.07)", borderColor:"rgba(255,255,255,0.12)" }}
              onFocus={e=>e.target.style.borderColor=colors.sage}
              onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.12)"} />
          </div>
          <button
            className="w-full py-3.5 rounded-lg text-sm font-medium text-white transition-all duration-200"
            style={{ background:colors.sage }}
            onMouseEnter={e=>e.target.style.background=colors.sageLight}
            onMouseLeave={e=>e.target.style.background=colors.sage}
          >
            Enviar mensaje →
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-6"
      style={{ background:"#1e1b18" }}>
      <span className="font-serif text-lg" style={{ color:"rgba(255,255,255,0.4)" }}>
        Carlos Ariel Carrillo Mora · Psicólogo SST
      </span>
      <div className="flex gap-6">
        {[["#about","Sobre mí"],["#services","Servicios"],["#contact","Contacto"]].map(([href,label]) => (
          <a key={href} href={href} className="text-xs tracking-widest uppercase no-underline transition-colors duration-200"
            style={{ color:"rgba(255,255,255,0.35)" }}
            onMouseEnter={e=>e.target.style.color=colors.sageLight}
            onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.35)"}
          >{label}</a>
        ))}
      </div>
    </footer>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <GlobalStyles />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <Navbar onOpenMenu={() => setMenuOpen(true)} />
      <Hero />
      <About />
      <Services />
      <Approach />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
    </>
  );
}