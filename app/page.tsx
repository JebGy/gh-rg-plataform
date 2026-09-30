import Link from "next/link";
import PalfingerForm from "@/components/PalfingerForm";
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
  ChevronRight
} from "lucide-react";

export const dynamic = "force-dynamic";

export default function PalfingerLandingPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#111215] text-white selection:bg-[#06BCA3] selection:text-black">
      {/* ── HEADER SUPERIOR (CO-BRANDED EXACTO) ────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-[#111215]/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo Ramirez Group (mantenido y ajustado con su rigor) */}
          <Link href="/" className="flex items-center gap-3">
            <img
              src="https://ramirezgroup.com.pe/wp-content/uploads/2023/06/logo-RAMIREZ-GROUP.png"
              alt="Ramirez Group"
              className="h-8 sm:h-9 w-auto object-contain brightness-0 invert"
            />
          </Link>

          {/* Logos Aliados a la Derecha (TBM, Zapler, Palfinger) */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* TBM Maquinarias */}
            <div className="flex items-center gap-1.5 bg-[#073628] border border-[#0d5943] text-white px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-black tracking-tight">
              <span className="w-2 h-2 rounded-full bg-[#06BCA3]" />
              <span>TBM</span>
              <span className="text-[10px] text-[#06BCA3] font-medium hidden sm:inline">maquinarias</span>
            </div>

            {/* ZAPLER */}
            <div className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-white text-zinc-950 font-black text-xs">
                Z
              </span>
              <span className="text-xs sm:text-sm font-black tracking-wider text-white uppercase hidden sm:inline">
                ZAPLER
              </span>
            </div>

            {/* PALFINGER (Insignia Amarilla Icónica) */}
            <div className="bg-[#FFCC00] text-black border border-black/80 font-black text-[11px] sm:text-xs tracking-wider px-2.5 py-0.5 rounded-full uppercase shadow-xs">
              PALFINGER
            </div>

            {/* Acceso Bolsa Antamina & Admin */}
            <div className="hidden lg:flex items-center gap-3 pl-3 border-l border-zinc-800 text-xs font-semibold text-zinc-400">
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
        {/* ── 1. HERO SECTION & FORMULARIO FLOTANTE ─────────────────── */}
        <section className="relative overflow-hidden bg-[#0d0f12] text-white border-b border-zinc-800">
          {/* Fondo Fotográfico Real con Gradiente Oscuro Adaptativo */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-45 pointer-events-none"
            style={{ backgroundImage: `url('/images/palfinger-hero.jpg')` }}
          />
          {/* Gradiente cinemático: negro sólido a la izquierda, desvanece a la derecha */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0f12] via-[#0d0f12]/90 to-[#0d0f12]/30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f12] via-transparent to-transparent pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-start">
              {/* Columna Izquierda: Textos del Hero */}
              <div className="lg:col-span-7 space-y-6 pt-2">
                {/* Subtítulo Turquesa / Teal #06BCA3 */}
                <p className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#06BCA3]">
                  CAPACITACIÓN TÉCNICA PRÁCTICA
                </p>

                {/* Título Principal Exacto */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[1.05] text-white">
                  OPERACIÓN<br />
                  DE GRÚAS<br />
                  <span className="text-[#06BCA3]">
                    PALFINGER
                  </span>
                </h1>

                {/* Descripción Exacta */}
                <p className="text-sm sm:text-base md:text-lg text-zinc-300 leading-relaxed max-w-xl">
                  Una experiencia técnica para operadores y riggers que buscan fortalecer sus competencias y ampliar sus oportunidades profesionales.
                </p>

                {/* En Alianza con: Ramirez Group × Zapler x PALFINGER */}
                <div className="pt-1">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 mb-2">
                    En alianza con:
                  </p>
                  <div className="inline-flex flex-wrap items-center gap-2.5 bg-zinc-900/80 border border-zinc-800 rounded-xl px-4 py-2.5 backdrop-blur-sm">
                    <span className="text-xs sm:text-sm font-bold text-white">
                      Ramirez Group
                    </span>
                    <span className="text-zinc-600 font-bold">×</span>
                    <span className="text-xs sm:text-sm font-bold text-[#06BCA3]">
                      Zapler
                    </span>
                    <span className="text-zinc-600 font-bold">×</span>
                    <div className="bg-[#FFCC00] text-black font-black text-[10px] tracking-wider px-2 py-0.5 rounded-full uppercase">
                      PALFINGER
                    </div>
                  </div>
                </div>

                {/* 5 Íconos Inferiores de Beneficios Rápidos (con #06BCA3) */}
                <div className="pt-6 grid grid-cols-2 sm:grid-cols-5 gap-3 border-t border-zinc-800/80 max-w-2xl">
                  <div className="text-center p-2 rounded-xl bg-zinc-950/40 border border-zinc-800/60">
                    <div className="w-8 h-8 rounded-lg text-[#06BCA3] flex items-center justify-center mx-auto mb-1">
                      <Truck size={18} />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-tight text-zinc-200">
                      Capacitación Práctica
                    </p>
                  </div>

                  <div className="text-center p-2 rounded-xl bg-zinc-950/40 border border-zinc-800/60">
                    <div className="w-8 h-8 rounded-lg text-[#06BCA3] flex items-center justify-center mx-auto mb-1">
                      <Wrench size={18} />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-tight text-zinc-200">
                      Especialistas del Sector
                    </p>
                  </div>

                  <div className="text-center p-2 rounded-xl bg-zinc-950/40 border border-zinc-800/60">
                    <div className="w-8 h-8 rounded-lg text-[#06BCA3] flex items-center justify-center mx-auto mb-1">
                      <Award size={18} />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-tight text-zinc-200">
                      Certificación Asistencia
                    </p>
                  </div>

                  <div className="text-center p-2 rounded-xl bg-zinc-950/40 border border-zinc-800/60">
                    <div className="w-8 h-8 rounded-lg text-[#06BCA3] flex items-center justify-center mx-auto mb-1">
                      <Coffee size={18} />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-tight text-zinc-200">
                      Refrigerio
                    </p>
                  </div>

                  <div className="text-center p-2 rounded-xl bg-zinc-950/40 border border-zinc-800/60 col-span-2 sm:col-span-1">
                    <div className="w-8 h-8 rounded-lg text-[#06BCA3] flex items-center justify-center mx-auto mb-1">
                      <Gift size={18} />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-tight text-zinc-200">
                      Premios y Sorpresas
                    </p>
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

                {/* Logos de Alianza */}
                <div className="pt-2 flex items-center gap-4">
                  {/* ZAPLER */}
                  <div className="flex items-center gap-1.5 border border-zinc-300 rounded-xl px-4 py-2 bg-zinc-50">
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-red-600 text-white font-black text-xs">
                      Z
                    </span>
                    <span className="text-sm font-black tracking-wider text-zinc-900 uppercase">
                      ZAPLER
                    </span>
                  </div>

                  {/* PALFINGER */}
                  <div className="bg-[#FFCC00] text-black border-2 border-black font-black text-xs tracking-wider px-4 py-2 rounded-full uppercase shadow-xs">
                    PALFINGER
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
                  desc: "Durante la jornada.",
                  icon: Coffee,
                },
                {
                  title: "PREMIOS",
                  desc: "Sorpresas y premios para los participantes.",
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
                    "Operadores de grúa",
                    "Riggers",
                    "Profesionales con experiencia en izaje",
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

                {/* Caja Destacada (Frase Exacta del Mockup con #06BCA3) */}
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
                  <span>Inscríbete a la capacitación</span>
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

        {/* ── 5. PROCESO DE PARTICIPACIÓN ───────────────────────────── */}
        <section className="bg-[#121418] text-white py-16 sm:py-20 border-b border-zinc-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mb-12 text-center md:text-left">
              PROCESO DE PARTICIPACIÓN
            </h2>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {[
                {
                  step: "1",
                  title: "REGÍSTRATE",
                  desc: "Completa el formulario en esta página.",
                  icon: ClipboardList,
                },
                {
                  step: "2",
                  title: "EVALUACIÓN DE PERFILES",
                  desc: "Revisaremos la información para seleccionar a los participantes.",
                  icon: Users2,
                },
                {
                  step: "3",
                  title: "RECIBE TU INVITACIÓN",
                  desc: "Si tu perfil cumple con los criterios, te enviaremos la invitación con los detalles del evento.",
                  icon: Mail,
                },
              ].map((s, idx) => {
                const IconComp = s.icon;
                return (
                  <div key={idx} className="flex items-start gap-4">
                    {/* Número Circular #06BCA3 */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#06BCA3] text-zinc-950 font-black text-sm flex-shrink-0 shadow-sm">
                      {s.step}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <IconComp size={16} className="text-[#06BCA3]" />
                        <h3 className="text-sm font-black uppercase tracking-wide text-white">
                          {s.title}
                        </h3>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
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

      {/* ── FOOTER INSTITUCIONAL (EXACTO DEL MOCKUP) ───────────────── */}
      <footer className="bg-[#0c0d0f] text-white py-12 border-t border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-zinc-800/80">
            {/* Logo Ramirez con su lema */}
            <div className="flex items-center gap-4">
              <img
                src="https://ramirezgroup.com.pe/wp-content/uploads/2023/06/logo-RAMIREZ-GROUP.png"
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
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-[#073628] border border-[#0d5943] text-white px-2 py-0.5 rounded text-[11px] font-black">
                <span>TBM</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="flex h-4 w-4 items-center justify-center rounded bg-white text-zinc-950 font-black text-[10px]">
                  Z
                </span>
                <span className="text-xs font-black tracking-wider text-white uppercase">
                  ZAPLER
                </span>
              </div>
              <div className="bg-[#FFCC00] text-black font-black text-[10px] tracking-wider px-2 py-0.5 rounded-full uppercase">
                PALFINGER
              </div>
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
    </div>
  );
}
