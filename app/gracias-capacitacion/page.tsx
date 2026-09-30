import Link from "next/link";
import { CheckCircle2, AlertTriangle, Share2, ArrowRight, ShieldCheck, Home } from "lucide-react";

export default function GraciasCapacitacionPage() {
  const shareMessage =
    "¡Certifícate gratis en Operación de Grúas PALFINGER! Capacitación técnica práctica con Ramirez Group y Zapler. Regístrate aquí:";
  const shareUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ramirezgroup.com.pe";

  return (
    <div className="flex min-h-[100dvh] flex-col bg-zinc-50">
      {/* Header Institucional */}
      <header className="border-b border-zinc-200 bg-white sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="https://ramirezgroup.com.pe/wp-content/uploads/2023/06/logo-RAMIREZ-GROUP.png"
              alt="Ramirez Group"
              className="h-8 w-auto object-contain"
            />
            <span className="text-xs font-semibold text-zinc-400 border-l border-zinc-200 pl-3 hidden sm:inline">
              Ramirez Group × Zapler × PALFINGER
            </span>
          </Link>
          <Link
            href="/"
            className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 flex items-center gap-1.5"
          >
            <Home size={14} />
            <span>Volver al Inicio</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 py-16">
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 md:p-12 max-w-xl w-full text-center shadow-xl">
          {/* Badge Ícono de Éxito */}
          <div className="w-20 h-20 rounded-3xl bg-teal-50 border border-teal-200 text-[#06BCA3] flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle2 size={44} className="stroke-[2.2]" aria-hidden="true" />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 border border-teal-200 px-3.5 py-1 text-xs font-bold text-[#048674] uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-[#06BCA3] animate-pulse" />
            Capacitación Técnica Práctica
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 mb-4">
            ¡REGISTRO RECIBIDO!
          </h1>

          <p className="text-base text-zinc-700 leading-relaxed mb-3">
            Gracias por tu interés en participar en la{" "}
            <strong className="text-zinc-900">Capacitación Técnica Práctica de Grúas PALFINGER</strong>.
          </p>

          <p className="text-sm md:text-base text-zinc-600 leading-relaxed mb-6">
            Estamos revisando los perfiles registrados. Si tu perfil cumple con los criterios de participación, recibirás una invitación con los detalles de la capacitación.
          </p>

          {/* Bloque Informativo Importante */}
          <div className="rounded-2xl border border-teal-200 bg-teal-50/70 p-5 text-left mb-8 flex items-start gap-3.5 shadow-xs">
            <div className="p-2 rounded-xl bg-[#06BCA3]/15 text-[#048674] flex-shrink-0 mt-0.5">
              <AlertTriangle size={20} aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-teal-950 uppercase tracking-wide">
                Importante
              </h2>
              <p className="text-sm font-medium text-teal-900 mt-1 leading-normal">
                Tu registro no confirma automáticamente tu participación.
              </p>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="space-y-3">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(shareMessage + "\n\n" + shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#25d366] hover:bg-[#20ba59] text-white font-semibold py-3.5 px-6 rounded-xl transition-all shadow-sm text-sm"
            >
              <Share2 size={16} aria-hidden="true" />
              <span>Compartir con otros operadores por WhatsApp</span>
            </a>

            <div className="pt-2 flex items-center justify-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                <span>Volver al portal</span>
                <ArrowRight size={13} aria-hidden="true" />
              </Link>
              <span className="text-zinc-300">·</span>
              <Link
                href="/recruitment"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#06BCA3] hover:text-[#049480] transition-colors"
              >
                <span>Ver Convocatoria Antamina</span>
                <ArrowRight size={13} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-200 bg-white py-6 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} Ramirez Group × Zapler × PALFINGER. Todos los derechos reservados.
      </footer>
    </div>
  );
}
