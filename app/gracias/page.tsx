import Link from "next/link";
import { CheckCircle2, Phone, Share2 } from "lucide-react";

export default function GraciasPage() {
  const shareText =
    "Convocatoria de trabajo en Huaraz – Servicio de Izaje Antamina. Puestos: Supervisor Operativo, Supervisor de Seguridad, Operador de Camión Grúa y Rigger. Regístrate ahora.";
  const shareUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tu-app.vercel.app";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-5 py-12"
      style={{ backgroundColor: "var(--color-canvas-soft)" }}>
      <div className="card-light max-w-md w-full text-center">
        {/* Icon */}
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ backgroundColor: "rgba(83,58,253,0.1)" }}
        >
          <CheckCircle2 size={28} style={{ color: "var(--color-primary)" }} aria-hidden="true" />
        </div>

        <h1 className="text-display-md mb-2" style={{ color: "var(--color-ink)" }}>
          ¡Postulación enviada!
        </h1>
        <p className="text-body-md mb-6" style={{ color: "var(--color-ink-secondary)" }}>
          Gracias por registrarte. El equipo de reclutamiento revisará tu información y se comunicará contigo si tu perfil se ajusta a los requerimientos del servicio de Izaje Antamina.
        </p>

        {/* Divider */}
        <div className="border-t mb-6" style={{ borderColor: "var(--color-hairline)" }} />

        <div
          className="flex items-start gap-3 p-4 rounded-xl mb-6 text-left"
          style={{ backgroundColor: "var(--color-canvas-soft)", borderRadius: "var(--radius-lg)" }}
        >
          <Phone size={16} style={{ color: "var(--color-primary)", flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
          <p className="text-body-md" style={{ color: "var(--color-ink-secondary)" }}>
            Te contactaremos vía <strong>WhatsApp o llamada</strong> al número que registraste.
          </p>
        </div>

        {/* Share */}
        <a
          href={`https://wa.me/?text=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary w-full flex items-center justify-center gap-2 mb-3"
        >
          <Share2 size={15} aria-hidden="true" />
          Compartir convocatoria en WhatsApp
        </a>

        <Link
          href="/"
          className="text-body-md block text-center mt-2"
          style={{ color: "var(--color-primary)" }}
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
