import { getDb } from "@/lib/prisma";
import CandidateForm from "@/components/CandidateForm";
import { MapPin, Calendar, Shield } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const db = await getDb();
  const rawPositions = await db.orm.public.Position.where({ isActive: true }).all();

  // Sort by sortOrder asc
  const positions = rawPositions
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((p) => ({
      id: p.id,
      title: p.title,
      department: p.department,
      location: p.location,
    }));

  return (
    <main className="min-h-screen flex flex-col">
      {/* ── Atmospheric Mesh Hero ─────────────────────── */}
      <section className="atmospheric-mesh pt-12 pb-16 px-5">
        <div className="max-w-xl mx-auto">
          {/* Badge */}
          <div className="mb-6 flex items-center gap-2">
            <span className="pill-tag">
              <span
                className="block w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: "var(--color-primary)" }}
              />
              Convocatoria Activa · Huaraz
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-display-lg mb-4"
            style={{ color: "var(--color-ink)" }}
          >
            Únete al equipo de{" "}
            <span style={{ color: "var(--color-primary)" }}>
              Izaje Antamina
            </span>
          </h1>
          <p className="text-body-lg mb-2" style={{ color: "var(--color-ink-secondary)" }}>
            Operaciones en Huaraz y Áncash. Convocatoria para personal operativo
            de la zona para integrarse a nuestro equipo de trabajo.
          </p>

          {/* Puestos chips preview */}
          <div className="flex flex-wrap gap-2 mt-5 mb-2">
            {positions.map((p) => (
              <span
                key={p.id}
                className="text-micro-cap px-3 py-1 rounded-full border"
                style={{
                  borderColor: "var(--color-hairline)",
                  color: "var(--color-ink-mute)",
                  backgroundColor: "var(--color-canvas)",
                }}
              >
                {p.title}
              </span>
            ))}
          </div>

          {/* Info row */}
          <div
            className="flex flex-wrap gap-4 mt-5 text-caption"
            style={{ color: "var(--color-ink-mute)" }}
          >
            <span className="flex items-center gap-1">
              <MapPin size={13} aria-hidden="true" />
              Huaraz / Mina Antamina
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={13} aria-hidden="true" />
              Disponibilidad inmediata / programada
            </span>
            <span className="flex items-center gap-1">
              <Shield size={13} aria-hidden="true" />
              Base de datos para procesos futuros
            </span>
          </div>
        </div>
      </section>

      {/* ── Registration Form Card ─────────────────────── */}
      <section
        className="flex-1 px-5 py-8"
        style={{ backgroundColor: "var(--color-canvas-soft)" }}
      >
        <div className="max-w-xl mx-auto">
          <div className="card-light">
            <div className="mb-6">
              <h2
                className="text-heading-md mb-1"
                style={{ color: "var(--color-ink)" }}
              >
                Registro Rápido de Candidato
              </h2>
              <p className="text-body-md" style={{ color: "var(--color-ink-mute)" }}>
                Completa tus datos — nuestro equipo de selección se contactará contigo.
              </p>
            </div>
            <CandidateForm positions={positions} />
          </div>

          {/* Footer note */}
          <p
            className="text-micro text-center mt-6"
            style={{ color: "var(--color-ink-mute-2)" }}
          >
            Tus datos quedan registrados en nuestra base de datos de talento para la presente campaña y futuros procesos.
          </p>
        </div>
      </section>
    </main>
  );
}
