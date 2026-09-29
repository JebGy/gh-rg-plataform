import Link from "next/link";
import { getDb } from "@/lib/prisma";
import CandidateForm from "@/components/CandidateForm";
import {
  MapPin,
  Calendar,
  ShieldCheck,
  ArrowRight,
  Briefcase,
  Users,
  CheckCircle,
  FileCheck
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const db = await getDb();
  const rawPositions = await db.orm.public.Position.where({ isActive: true }).all();

  const positions = rawPositions
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((p) => ({
      id: p.id,
      title: p.title,
      department: p.department,
      location: p.location,
    }));

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white">
      {/* ── 4.1. Navegación Superior (Header) ───────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* Logo Ramirez Group */}
          <div className="flex items-center gap-3">
            <img
              src="https://ramirezgroup.com.pe/wp-content/uploads/2023/06/logo-RAMIREZ-GROUP.png"
              alt="Ramirez Group"
              className="h-9 w-auto object-contain"
            />
            <div className="hidden sm:block border-l border-zinc-200 pl-3">
              <p className="text-xs font-semibold tracking-wide text-zinc-800 uppercase">
                Operaciones Mineras
              </p>
              <p className="text-[11px] text-zinc-500">
                Servicio de Izaje · Antamina
              </p>
            </div>
          </div>

          {/* Acciones Header */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="text-xs sm:text-sm font-medium text-zinc-600 hover:text-zinc-900 px-3 py-2 rounded-md hover:bg-zinc-100 transition-colors"
            >
              Acceso Administrativo
            </Link>
            <a
              href="#registro"
              className="btn-primary text-xs sm:text-sm py-2 px-4"
            >
              Postular Ahora
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ── 5.1. Hero Section ─────────────────────────────────────── */}
        <section className="border-b border-zinc-200 bg-zinc-950 text-white relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 py-20 md:py-28 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-md bg-[rgba(43,160,122,0.18)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--brand-accent)] mb-6 border border-[rgba(43,160,122,0.3)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-accent)]" />
                Campaña de Reclutamiento · Huaraz
              </div>

              <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl leading-[1.15] text-white">
                Convocatoria de Personal Operativo para{" "}
                <span className="text-[var(--brand-primary)]">Ramirez Group</span>.
              </h1>

              <p className="mt-6 max-w-2xl text-base md:text-lg text-zinc-300 leading-relaxed">
                Plataforma oficial de captación y registro de candidatos para el servicio de{" "}
                <strong>Izaje en Mina Antamina</strong>. Priorizamos la incorporación de personal calificado de Huaraz y zonas de influencia.
              </p>

              {/* Botones Paralelos */}
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#registro"
                  className="btn-primary text-base py-3 px-6 shadow-md"
                >
                  Registrarse en la Convocatoria
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
                <a
                  href="#perfiles"
                  className="btn-secondary text-base py-3 px-6 bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800"
                >
                  Ver Perfiles Requeridos
                </a>
              </div>

              {/* Stats en Hero */}
              <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-zinc-800 pt-8">
                <div>
                  <p className="text-2xl font-bold text-white tracking-tight">4 Puestos</p>
                  <p className="text-xs text-zinc-400 mt-1">Convocatoria abierta</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white tracking-tight">Huaraz</p>
                  <p className="text-xs text-zinc-400 mt-1">Personal de la zona</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white tracking-tight">Antamina</p>
                  <p className="text-xs text-zinc-400 mt-1">Servicio de Izaje</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white tracking-tight">100% Digital</p>
                  <p className="text-xs text-zinc-400 mt-1">Registro sin papeleo</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5.2 & 4.2. Feature Grid (Perfiles Requeridos con Enumeración) ── */}
        <section id="perfiles" className="bg-zinc-50 py-20 md:py-24 border-b border-zinc-200">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-14">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--brand-primary)] mb-2">
                Perfiles Solicitados
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
                Cargos operativos disponibles para el servicio.
              </h2>
              <p className="mt-3 text-base text-zinc-600 max-w-2xl">
                Seleccione el perfil al que desea postular para cargar automáticamente los requisitos en el formulario.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  idx: "01",
                  title: "Supervisor Operativo",
                  desc: "Liderazgo técnico en maniobras de izaje, supervisión de equipos y cumplimiento de planes operativos en mina.",
                  badge: "Ingeniería / Operaciones",
                },
                {
                  idx: "02",
                  title: "Supervisor de Seguridad",
                  desc: "Supervisión SSOMA en operaciones de izaje, control de permisos de trabajo crítico y estándares Antamina.",
                  badge: "SSOMA / Prevención",
                },
                {
                  idx: "03",
                  title: "Operadores de Camión Grúa",
                  desc: "Operación de camiones grúa articulados y telescópicos. Requiere brevete profesional y certificación vigente.",
                  badge: "Brevete A-IIIb o superior",
                },
                {
                  idx: "04",
                  title: "Rigger",
                  desc: "Aparejamiento de cargas, cálculo de peso, inspección de accesorios de izaje y señalización de maniobras.",
                  badge: "Certificación Rigger",
                },
              ].map((item) => (
                <div
                  key={item.idx}
                  className="rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    {/* Número de índice destacado visualmente en la parte superior */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[rgba(43,160,122,0.12)] text-base font-bold text-[var(--brand-primary)]">
                        {item.idx}
                      </span>
                      <span className="text-[11px] font-semibold text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-zinc-900 leading-snug">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <a
                    href="#registro"
                    className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] transition-colors pt-3 border-t border-zinc-100"
                  >
                    <span>Postular a este cargo</span>
                    <ArrowRight size={13} aria-hidden="true" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5.3. Step-by-Step (Proceso de Selección) ───────────────── */}
        <section className="py-20 md:py-24 border-b border-zinc-200 bg-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--brand-primary)] mb-2">
                Proceso
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
                Cómo funciona la postulación.
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-base text-zinc-600">
                Flujo simplificado de selección para la activación de la campaña en Huaraz.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  num: "01",
                  title: "Registro de Información",
                  desc: "Complete sus datos personales, número de licencia/certificación, lugar de residencia y disponibilidad en el formulario.",
                },
                {
                  num: "02",
                  title: "Evaluación de Perfil",
                  desc: "El equipo de selección de Ramirez Group valida su información técnica y confirma la idoneidad para el servicio de Izaje.",
                },
                {
                  num: "03",
                  title: "Contacto & Entrevista",
                  desc: "Sheila / Geovanna se comunicarán directamente vía WhatsApp o llamada para coordinar la entrevista y acreditación.",
                },
              ].map((step) => (
                <div key={step.num} className="text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-900 text-lg font-bold text-white mx-auto mb-5 shadow-sm">
                    {step.num}
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900">{step.title}</h3>
                  <p className="mt-2 text-sm text-zinc-600 leading-relaxed max-w-xs mx-auto">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5.4. Formulario de Registro Utilitario ─────────────────── */}
        <section id="registro" className="py-20 md:py-28 bg-zinc-50">
          <div className="mx-auto max-w-3xl px-6">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 rounded-md bg-white border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-700 mb-3 shadow-xs">
                <FileCheck size={14} className="text-[var(--brand-primary)]" aria-hidden="true" />
                Formulario Oficial de Captación
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
                Registro Rápido de Candidato
              </h2>
              <p className="mt-2 text-sm text-zinc-600 max-w-lg mx-auto">
                Deje sus datos más importantes. Esta información quedará registrada en nuestra base de datos de talento para la presente campaña y futuros procesos.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 md:p-10 shadow-xs">
              <CandidateForm positions={positions} />
            </div>
          </div>
        </section>
      </main>

      {/* ── 5.4. Footer Institucional ──────────────────────────────── */}
      <footer className="border-t border-zinc-200 bg-white py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img
                src="https://ramirezgroup.com.pe/wp-content/uploads/2023/06/logo-RAMIREZ-GROUP.png"
                alt="Ramirez Group"
                className="h-7 w-auto object-contain"
              />
              <span className="text-xs font-medium text-zinc-500 border-l border-zinc-200 pl-3">
                Servicio de Izaje · Antamina
              </span>
            </div>
            <p className="text-xs text-zinc-500 text-center md:text-right">
              © {new Date().getFullYear()} Ramirez Group. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
