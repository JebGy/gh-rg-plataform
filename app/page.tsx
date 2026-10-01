import Link from "next/link";
import PalfingerForm from "@/components/PalfingerForm";
import FloatingFormButton from "@/components/FloatingFormButton";
import type { Metadata } from "next";
import {
  Wrench,
  Truck,
  Users2,
  FileCheck2,
  Coffee,
  Gift,
  HardHat,
  Award,
  Check,
  Mail,
  ClipboardList,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Convocatoria Abierta | Capacitación Técnico-Práctica en Operación de Grúas PALFINGER",
  description:
    "Capacitación técnico-práctica en operación de grúas PALFINGER dirigida a operadores y riggers con experiencia. Organizan: Ramirez Group, Zapler y PALFINGER.",
};

export default function PalfingerLandingPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#111215] text-white selection:bg-[#06BCA3] selection:text-black">
      {/* ── HEADER SUPERIOR (CO-BRANDED OFICIAL CON LOGOS REALES) ────── */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-[#111215]/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo Ramirez Group */}
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/images/logos/ramirez-group.png"
              alt="Ramirez Group"
              className="h-8 sm:h-9 w-auto object-contain brightness-0 invert"
            />
          </Link>

          {/* Logos Aliados a la Derecha (Zapler, PALFINGER) */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* ZAPLER Logo Oficial */}
            <div className="flex items-center">
              <img
                src="/images/logos/zapler-white.svg"
                alt="ZAPLER"
                className="h-6 sm:h-7 w-auto object-contain"
              />
            </div>

            {/* PALFINGER Logo Oficial */}
            <div className="flex items-center">
              <img
                src="/images/logos/palfinger.svg"
                alt="PALFINGER"
                className="h-7 sm:h-8 w-auto object-contain"
              />
            </div>

            {/* Acceso Bolsa Antamina & Admin */}
            <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-zinc-800 text-xs font-semibold text-zinc-400">
              <Link
                href="/recruitment"
                className="hover:text-[#06BCA3] transition-colors flex items-center gap-1"
                title="Convocatoria Operativa Antamina"
              >
                <span>Bolsa Antamina</span>
              </Link>
              <Link
                href="/admin"
                className="hover:text-white transition-colors"
                title="Acceso administrativo"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ── 1. HERO SECTION & FORMULARIO (TÍTULO Y DISEÑO EXACTO DEL FLYER) ── */}
        <section className="relative overflow-hidden bg-[#0d0f12] text-white border-b border-zinc-800">
          {/* Fondo Fotográfico Real con Gradiente Oscuro Adaptativo */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 pointer-events-none"
            style={{ backgroundImage: `url('/images/palfinger-hero.jpg')` }}
          />
          {/* Gradientes cinemáticos */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0f12] via-[#0d0f12]/92 to-[#0d0f12]/40 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f12] via-transparent to-transparent pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-start">
              {/* Columna Izquierda: Textos del Flyer Exacto */}
              <div className="lg:col-span-7 space-y-6 pt-2">
                {/* 1. Eyebrow Exacto: CONVOCATORIA ABIERTA */}
                <div className="inline-flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#06BCA3]">
                    CONVOCATORIA ABIERTA
                  </span>
                </div>

                {/* 2. Título Principal Exacto del Flyer */}
                <div className="space-y-3">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black uppercase tracking-tight leading-[1.08] text-white">
                    CAPACITACIÓN<br />
                    TÉCNICO-PRÁCTICA<br />
                    EN OPERACIÓN DE GRÚAS
                  </h1>

                  {/* Logo / Insignia Oficial PALFINGER */}
                  <div className="pt-1 flex items-center">
                    <img
                      src="/images/logos/palfinger.svg"
                      alt="PALFINGER"
                      className="h-10 sm:h-12 md:h-14 w-auto object-contain drop-shadow-md"
                    />
                  </div>
                </div>

                {/* 3. Dirigida a: Operadores y Riggers con experiencia */}
                <div className="space-y-1">
                  <p className="text-sm sm:text-base text-zinc-300 font-medium">
                    Dirigida a:
                  </p>
                  <p className="text-base sm:text-lg md:text-xl font-black text-white">
                    Operadores y Riggers con experiencia
                  </p>
                </div>

                {/* 4. ¡NO PIERDAS ESTA OPORTUNIDAD! */}
                <div className="space-y-1.5 pt-1">
                  <p className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight uppercase">
                    ¡NO PIERDAS{" "}
                    <span className="text-[#06BCA3]">ESTA OPORTUNIDAD!</span>
                  </p>
                  <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-xl">
                    Regístrate y da el siguiente paso para impulsar tu carrera profesional.
                  </p>
                  <p className="text-xs text-zinc-400 font-medium">
                    *Cupos sujetos a evaluación y aforo del local.
                  </p>
                </div>

                {/* 5. Co-Branding Bar "Organizan:" (Exacto del Flyer) */}
                <div className="pt-2">
                  <p className="text-[11px] font-black uppercase tracking-widest text-zinc-400 mb-2.5">
                    Organizan:
                  </p>
                  <div className="inline-flex flex-wrap items-center gap-4 sm:gap-6 bg-zinc-900/90 border border-zinc-800 rounded-2xl px-5 py-3.5 backdrop-blur-md shadow-lg">
                    {/* Ramirez Group */}
                    <div className="flex items-center">
                      <img
                        src="/images/logos/ramirez-group.png"
                        alt="Ramirez Group"
                        className="h-6 sm:h-7 w-auto object-contain brightness-0 invert"
                      />
                    </div>

                    <span className="text-zinc-600 font-bold hidden sm:inline">|</span>

                    {/* Zapler */}
                    <div className="flex items-center">
                      <img
                        src="/images/logos/zapler-white.svg"
                        alt="Zapler"
                        className="h-5 sm:h-6 w-auto object-contain"
                      />
                    </div>

                    <span className="text-zinc-600 font-bold hidden sm:inline">|</span>

                    {/* Palfinger */}
                    <div className="flex items-center">
                      <img
                        src="/images/logos/palfinger.svg"
                        alt="PALFINGER"
                        className="h-6 sm:h-7 w-auto object-contain"
                      />
                    </div>
                  </div>
                </div>

                {/* 6. Beneficios Rápidos con Badge "CUPOS LIMITADOS ↗" */}
                <div className="pt-6 border-t border-zinc-800/80 max-w-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-black uppercase tracking-widest text-zinc-400">
                      Beneficios incluidos:
                    </p>
                    {/* Badge Cupos Limitados del Flyer */}
                    <div className="inline-flex items-center gap-1.5 bg-[#FED100] text-black font-black text-xs uppercase px-3 py-1 rounded-lg tracking-wider shadow-sm">
                      <ArrowUpRight size={16} className="stroke-[3]" />
                      <span>Cupos Limitados</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="text-center p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800/70">
                      <div className="w-8 h-8 rounded-lg text-[#06BCA3] flex items-center justify-center mx-auto mb-1">
                        <HardHat size={18} />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-tight text-zinc-200">
                        Capacitación Práctica
                      </p>
                    </div>

                    <div className="text-center p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800/70">
                      <div className="w-8 h-8 rounded-lg text-[#06BCA3] flex items-center justify-center mx-auto mb-1">
                        <Wrench size={18} />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-tight text-zinc-200">
                        Especialistas del Sector
                      </p>
                    </div>

                    <div className="text-center p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800/70">
                      <div className="w-8 h-8 rounded-lg text-[#06BCA3] flex items-center justify-center mx-auto mb-1">
                        <Award size={18} />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-tight text-zinc-200">
                        Certificación de Asistencia
                      </p>
                    </div>

                    <div className="text-center p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800/70">
                      <div className="w-8 h-8 rounded-lg text-[#06BCA3] flex items-center justify-center mx-auto mb-1">
                        <Coffee size={18} />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-tight text-zinc-200">
                        Refrigerio
                      </p>
                    </div>

                    <div className="text-center p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800/70 col-span-2 sm:col-span-1">
                      <div className="w-8 h-8 rounded-lg text-[#06BCA3] flex items-center justify-center mx-auto mb-1">
                        <Gift size={18} />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-tight text-zinc-200">
                        Premios y Sorpresas
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Tarjeta Blanca Flotante con Formulario */}
              <div id="formulario" className="lg:col-span-5 w-full">
                <div className="rounded-3xl border border-zinc-200 bg-white p-5 sm:p-7 shadow-2xl text-zinc-900">
                  <PalfingerForm />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECCIÓN PROCESO DE PARTICIPACIÓN (JUSTO DEBAJO DEL HERO) ──────── */}
        <section
          id="proceso-participacion"
          className="border-b border-zinc-800 bg-[#0c0e12] relative z-20 py-12 sm:py-16"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            {/* Título de la sección y Aviso Claro de que NO es inscripción automática */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 pb-6 border-b border-zinc-800/80">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#06BCA3]/10 border border-[#06BCA3]/30 text-[#06BCA3] text-xs font-bold uppercase tracking-wider mb-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#06BCA3]" />
                  <span>FLUJO DE ADMISIÓN TÉCNICA · CUPOS LIMITADOS</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white">
                  PROCESO DE PARTICIPACIÓN
                </h2>
              </div>

              {/* Banner de Aviso de Evaluación */}
              <div className="flex items-center gap-3.5 rounded-2xl border border-amber-500/50 bg-amber-500/10 px-5 py-3.5 text-amber-200 max-w-xl shadow-md">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={22} className="stroke-[2.5]" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-extrabold text-amber-300 uppercase tracking-wide">
                    NO ES UNA INSCRIPCIÓN AUTOMÁTICA
                  </p>
                  <p className="text-xs text-amber-200/90 leading-tight mt-0.5">
                    Los cupos son limitados. Cada perfil registrado entra en evaluación técnica según aforo del local.
                  </p>
                </div>
              </div>
            </div>

            {/* 3 Pasos Grandes y Visibles */}
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
              {/* Paso 1 */}
              <div className="rounded-2xl border border-zinc-800 bg-[#14171d] p-6 sm:p-7 flex flex-col justify-between hover:border-zinc-700 transition-all shadow-lg group">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#06BCA3] text-zinc-950 font-black text-xl shadow-md group-hover:scale-105 transition-transform">
                      1
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-zinc-800/80 text-[#06BCA3] flex items-center justify-center">
                      <ClipboardList size={18} />
                    </div>
                  </div>
                  <div className="text-[11px] font-black uppercase tracking-widest text-[#06BCA3] mb-1">
                    PASO 01
                  </div>
                  <h3 className="text-lg sm:text-xl font-black uppercase tracking-wide text-white mb-2">
                    REGÍSTRATE
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    Completa el formulario en esta página con tus datos de contacto y experiencia como operador o rigger.
                  </p>
                </div>
              </div>

              {/* Paso 2: EVALUACIÓN DE PERFILES (Filtro Técnico Destacado con Etapa de Selección) */}
              <div className="rounded-2xl border-2 border-[#06BCA3] bg-[#14171d] p-6 sm:p-7 flex flex-col justify-between relative shadow-[0_0_30px_rgba(6,188,163,0.12)]">
                <div className="absolute -top-3 right-6 bg-[#06BCA3] text-zinc-950 text-[10px] font-black uppercase tracking-wider px-3.5 py-0.5 rounded-full shadow-md">
                  ETAPA DE SELECCIÓN
                </div>
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#06BCA3] text-zinc-950 font-black text-xl shadow-md">
                      2
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-zinc-800/80 text-[#06BCA3] flex items-center justify-center">
                      <Users2 size={18} />
                    </div>
                  </div>
                  <div className="text-[11px] font-black uppercase tracking-widest text-[#06BCA3] mb-1">
                    PASO 02 - EVALUACIÓN
                  </div>
                  <h3 className="text-lg sm:text-xl font-black uppercase tracking-wide text-white mb-2">
                    EVALUACIÓN DE PERFILES
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    Revisaremos la información técnica de los postulantes para seleccionar a los participantes calificados.{" "}
                    <span className="text-white font-bold underline decoration-[#06BCA3]">
                      No es registro automático.
                    </span>
                  </p>
                </div>
              </div>

              {/* Paso 3 */}
              <div className="rounded-2xl border border-zinc-800 bg-[#14171d] p-6 sm:p-7 flex flex-col justify-between hover:border-zinc-700 transition-all shadow-lg group">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#06BCA3] text-zinc-950 font-black text-xl shadow-md group-hover:scale-105 transition-transform">
                      3
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-zinc-800/80 text-[#06BCA3] flex items-center justify-center">
                      <Mail size={18} />
                    </div>
                  </div>
                  <div className="text-[11px] font-black uppercase tracking-widest text-[#06BCA3] mb-1">
                    PASO 03
                  </div>
                  <h3 className="text-lg sm:text-xl font-black uppercase tracking-wide text-white mb-2">
                    RECIBE TU INVITACIÓN
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    Si tu perfil cumple con los criterios técnicos y aforo disponible, te enviaremos la confirmación formal con los detalles del evento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. EN ALIANZA CON ESPECIALISTAS DE LA INDUSTRIA ────────── */}
        <section className="bg-white text-zinc-900 py-16 sm:py-20 border-b border-zinc-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid md:grid-cols-12 gap-10 items-center">
              {/* Texto y Logos */}
              <div className="md:col-span-6 space-y-5">
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-950">
                  EN ALIANZA CON<br />
                  ESPECIALISTAS DE LA INDUSTRIA
                </h2>

                <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
                  Esta capacitación se realiza en alianza con Zapler y PALFINGER, marcas líderes en soluciones de izaje, para compartir conocimientos técnicos, experiencia en campo y las mejores prácticas de operación.
                </p>

                {/* Logos de Alianza con Logos Oficiales */}
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  {/* Ramirez Group */}
                  <div className="flex items-center border border-zinc-200 rounded-xl px-4 py-2 bg-zinc-50 shadow-2xs">
                    <img
                      src="/images/logos/ramirez-group-color.png"
                      alt="Ramirez Group"
                      className="h-7 w-auto object-contain"
                    />
                  </div>

                  {/* ZAPLER */}
                  <div className="flex items-center border border-zinc-200 rounded-xl px-4 py-2 bg-zinc-50 shadow-2xs">
                    <img
                      src="/images/logos/zapler-dark.svg"
                      alt="Zapler"
                      className="h-6 w-auto object-contain"
                    />
                  </div>

                  {/* PALFINGER */}
                  <div className="flex items-center">
                    <img
                      src="/images/logos/palfinger.svg"
                      alt="PALFINGER"
                      className="h-8 w-auto object-contain shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Imagen Fotográfica del Brazo Hidráulico Palfinger */}
              <div className="md:col-span-6">
                <div className="rounded-3xl overflow-hidden border border-zinc-200 shadow-xl bg-zinc-100 group">
                  <img
                    src="/images/palfinger-boom.jpg"
                    alt="Brazo de Grúa Articulada PALFINGER PK"
                    className="w-full h-72 sm:h-80 object-cover object-center group-hover:scale-102 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. SECCIÓN “¿QUÉ ENCONTRARÁS?” ────────────────────────── */}
        <section id="que-encontraras" className="bg-[#14161a] text-white py-20 sm:py-24 border-b border-zinc-800 relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
                ¿QUÉ ENCONTRARÁS?
              </h2>
              <p className="text-sm sm:text-base text-zinc-400 mt-1">
                Una capacitación pensada para quienes trabajan en campo.
              </p>
            </div>

            {/* Grid 6 Tarjetas Modulares Oscuras */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
              {[
                {
                  title: "CAPACITACIÓN TÉCNICA",
                  desc: "Contenidos orientados a la operación de grúas PALFINGER.",
                  icon: Wrench,
                },
                {
                  title: "EXPERIENCIA PRÁCTICA",
                  desc: "Acercamiento a equipos y situaciones reales de operación.",
                  icon: Truck,
                },
                {
                  title: "ESPECIALISTAS",
                  desc: "Participación de profesionales vinculados a la tecnología PALFINGER.",
                  icon: Users2,
                },
                {
                  title: "CERTIFICACIÓN",
                  desc: "Constancia/certificación de capacitación y asistencia.",
                  icon: Award,
                },
                {
                  title: "REFRIGERIO",
                  desc: "Durante la jornada del evento.",
                  icon: Coffee,
                },
                {
                  title: "PREMIOS",
                  desc: "Sorpresas y premios para los participantes destacados.",
                  icon: Gift,
                },
              ].map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 flex flex-col justify-between hover:border-zinc-700 transition-colors"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-zinc-800/80 text-[#06BCA3] flex items-center justify-center mb-4">
                        <IconComponent size={20} />
                      </div>
                      <h3 className="text-xs font-black uppercase tracking-wide text-white mb-2 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 4. ¿A QUIÉN ESTÁ DIRIGIDO? ────────────────────────────── */}
        <section id="dirigido" className="bg-[#f8f8f9] text-zinc-900 py-20 sm:py-24 border-b border-zinc-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid md:grid-cols-12 gap-10 items-center">
              {/* Columna Izquierda: Información */}
              <div className="md:col-span-6 space-y-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-zinc-950">
                    ¿A QUIÉN ESTÁ<br />
                    DIRIGIDO?
                  </h2>
                  <p className="text-sm sm:text-base text-zinc-600 mt-3 leading-relaxed">
                    Buscamos operadores de grúa y riggers con experiencia en operaciones de izaje, interesados en fortalecer sus conocimientos y seguir desarrollándose profesionalmente.
                  </p>
                </div>

                {/* Bullets con Checkmarks #06BCA3 */}
                <ul className="space-y-3">
                  {[
                    "Operadores de grúa articulada y telescópica",
                    "Riggers certificados",
                    "Profesionales con experiencia comprobada en izaje",
                    "Experiencia en minería, construcción, industria, puertos u otros sectores",
                  ].map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-md bg-[#06BCA3] text-zinc-950 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                        <Check size={13} className="stroke-[3]" />
                      </div>
                      <span className="text-sm font-bold text-zinc-800">
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Caja Destacada */}
                <div className="rounded-2xl border border-teal-200 bg-teal-50/80 p-4 sm:p-5 flex items-start gap-4 shadow-xs">
                  <div className="w-12 h-12 rounded-xl bg-[#06BCA3]/15 text-[#048674] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <HardHat size={26} />
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-bold text-teal-950 leading-snug">
                      Si ya tienes experiencia en campo y quieres seguir desarrollándote, queremos conocerte.
                    </p>
                  </div>
                </div>

                <a
                  href="#formulario"
                  className="inline-flex items-center gap-2 text-sm font-bold text-zinc-900 hover:text-[#06BCA3] transition-colors"
                >
                  <span>Inscríbete para la evaluación técnica</span>
                  <ArrowRight size={16} />
                </a>
              </div>

              {/* Columna Derecha: Foto de Rigger en Maniobra Real */}
              <div className="md:col-span-6">
                <div className="rounded-3xl overflow-hidden border border-zinc-200 shadow-xl bg-zinc-100 group">
                  <img
                    src="/images/rigger-operation.jpg"
                    alt="Rigger y Operador asegurando maniobra de izaje con grúa"
                    className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-102 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. LLAMADO A LA ACCIÓN (CUPOS LIMITADOS) ──────────────── */}
        <section className="bg-[#121418] text-white py-14 sm:py-16 border-b border-zinc-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="rounded-3xl border border-zinc-800 bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#06BCA3]/15 text-[#06BCA3] text-xs font-extrabold uppercase tracking-wider">
                  <ShieldCheck size={14} />
                  <span>Proceso de Selección Activo</span>
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
                  ¿Listo para potenciar tu carrera profesional?
                </h3>
                <p className="text-sm text-zinc-400 max-w-xl">
                  Registra tus datos y experiencia. Recuerda que los cupos son limitados y se asignan mediante evaluación técnica.
                </p>
              </div>

              <div className="flex-shrink-0">
                <a
                  href="#formulario"
                  className="inline-flex items-center gap-2.5 rounded-xl bg-[#06BCA3] px-6 py-3.5 text-sm font-black uppercase tracking-wide text-zinc-950 hover:bg-[#05a791] transition-colors shadow-lg"
                >
                  <span>Ir al Formulario</span>
                  <ArrowRight size={18} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. FORMA PARTE DE NUESTRA BASE DE TALENTO ─────────────── */}
        <section className="bg-[#eaecf0] text-zinc-900 py-16 sm:py-20 border-b border-zinc-300/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="rounded-3xl bg-white border border-zinc-200/80 p-6 sm:p-10 shadow-lg">
              <div className="grid md:grid-cols-12 gap-8 items-center">
                {/* Lado Izquierdo */}
                <div className="md:col-span-7 space-y-4">
                  <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-950">
                    FORMA PARTE DE NUESTRA<br />
                    BASE DE TALENTO
                  </h2>
                  <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
                    Esta iniciativa forma parte de nuestro compromiso por impulsar el desarrollo de profesionales del sector y generar una base de datos de operadores y riggers para futuras oportunidades en proyectos de TBM Maquinarias y Ramírez Group.
                  </p>

                  <div className="pt-2">
                    <Link
                      href="/recruitment"
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#06BCA3] hover:text-[#049480] transition-colors"
                    >
                      <span>Ver Convocatoria Activa Mina Antamina (/recruitment)</span>
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>

                {/* Lado Derecho con Círculo y Bullets */}
                <div className="md:col-span-5 bg-zinc-50 border border-zinc-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
                  {/* Círculo con Icono y Checkmark */}
                  <div className="relative w-20 h-20 rounded-full border-2 border-zinc-300 bg-white flex items-center justify-center flex-shrink-0 text-zinc-700 shadow-xs">
                    <Users2 size={32} />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#06BCA3] text-zinc-950 flex items-center justify-center shadow-xs">
                      <Check size={14} className="stroke-[3]" />
                    </div>
                  </div>

                  {/* Lista de beneficios */}
                  <ul className="space-y-2 text-xs text-zinc-700">
                    <li className="flex items-center gap-2">
                      <span className="text-[#06BCA3] font-bold">✦</span>
                      <span>Conecta con nuevas oportunidades</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#06BCA3] font-bold">✦</span>
                      <span>Forma parte de futuros proyectos</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#06BCA3] font-bold">✦</span>
                      <span>Mantente informado sobre próximas capacitaciones</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#06BCA3] font-bold">✦</span>
                      <span>Sé parte de una comunidad de profesionales del sector</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER INSTITUCIONAL (CON LOGOS OFICIALES) ───────────────── */}
      <footer className="bg-[#0c0d0f] text-white py-12 border-t border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-zinc-800/80">
            {/* Logo Ramirez con su lema */}
            <div className="flex items-center gap-4">
              <img
                src="/images/logos/ramirez-group.png"
                alt="Ramirez Group"
                className="h-8 w-auto object-contain brightness-0 invert"
              />
              <div className="border-l border-zinc-700 pl-4 hidden sm:block">
                <p className="text-xs text-zinc-400 font-medium">
                  Rigor en la ejecución.
                </p>
                <p className="text-xs text-zinc-400 font-medium">
                  Valor que trasciende.
                </p>
              </div>
            </div>

            {/* Logos de Alianza Footer */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <span className="text-xs font-semibold text-zinc-400">Organizan:</span>
              <img
                src="/images/logos/ramirez-group.png"
                alt="Ramirez Group"
                className="h-6 w-auto object-contain brightness-0 invert"
              />
              <img
                src="/images/logos/zapler-white.svg"
                alt="ZAPLER"
                className="h-5 w-auto object-contain"
              />
              <img
                src="/images/logos/palfinger.svg"
                alt="PALFINGER"
                className="h-6 w-auto object-contain"
              />
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <p>
              © {new Date().getFullYear()} Ramirez Group. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/recruitment" className="hover:text-zinc-300 transition-colors">
                Convocatoria Antamina
              </Link>
              <span>·</span>
              <Link href="/admin" className="hover:text-zinc-300 transition-colors">
                Panel Admin
              </Link>
              <span>·</span>
              <a href="#" className="hover:text-zinc-300 transition-colors">
                Política de privacidad
              </a>
              <span>·</span>
              <a href="#" className="hover:text-zinc-300 transition-colors">
                Términos y condiciones
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Botón Flotante para ir al Formulario */}
      <FloatingFormButton />
    </div>
  );
}
