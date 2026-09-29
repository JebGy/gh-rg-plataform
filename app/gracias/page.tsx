import Link from "next/link";
import { CheckCircle2, Phone, Share2, ArrowRight } from "lucide-react";

export default function GraciasPage() {
  const shareText =
    "Convocatoria de personal para Ramirez Group — Servicio de Izaje en Mina Antamina (Huaraz). Puestos: Supervisor Operativo, Supervisor de Seguridad, Operador de Camión Grúa y Rigger. Regístrate aquí:";
  const shareUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tu-app.vercel.app";

  return (
    <div className="flex min-h-[100dvh] flex-col bg-zinc-50">
      {/* Header Institucional */}
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="https://ramirezgroup.com.pe/wp-content/uploads/2023/06/logo-RAMIREZ-GROUP.png"
              alt="Ramirez Group"
              className="h-8 w-auto object-contain"
            />
            <span className="text-xs font-semibold text-zinc-500 border-l border-zinc-200 pl-3">
              Convocatoria Operativa
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 py-16">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 md:p-12 max-w-lg w-full text-center shadow-xs">
          {/* Badge Ícono de Éxito */}
          <div className="w-16 h-16 rounded-2xl bg-[rgba(43,160,122,0.1)] text-[var(--brand-primary)] flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={36} aria-hidden="true" />
          </div>

          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--brand-primary)] mb-1">
            Registro Completado
          </p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 mb-3">
            ¡Postulación enviada exitosamente!
          </h1>
          <p className="text-sm text-zinc-600 leading-relaxed mb-8">
            Sus datos han sido incorporados a la base de candidatos de <strong>Ramirez Group</strong> para el servicio de Izaje en Mina Antamina.
          </p>

          {/* Bloque Informativo */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-left mb-6 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-white border border-zinc-200 text-[var(--brand-primary)] flex-shrink-0 mt-0.5">
              <Phone size={18} aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-900">Siguiente Paso</p>
              <p className="text-xs text-zinc-600 mt-0.5 leading-normal">
                El equipo de Recursos Humanos (Sheila / Geovanna) se comunicará por llamada o WhatsApp al número indicado si su perfil califica.
              </p>
            </div>
          </div>

          {/* Botón WhatsApp Compartir */}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2 mb-3 shadow-xs"
          >
            <Share2 size={16} aria-hidden="true" />
            Compartir convocatoria por WhatsApp
          </a>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 mt-3 transition-colors"
          >
            <span>Volver al portal principal</span>
            <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </div>
      </main>

      <footer className="border-t border-zinc-200 bg-white py-6 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} Ramirez Group. Todos los derechos reservados.
      </footer>
    </div>
  );
}
