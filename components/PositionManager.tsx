"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPosition, togglePosition } from "@/lib/actions/positions";
import { Plus, Loader2, Users, ToggleLeft, ToggleRight, Briefcase } from "lucide-react";

type Position = {
  id: number;
  title: string;
  department: string;
  location: string;
  description?: string | null;
  isActive: boolean;
  sortOrder: number;
  candidateCount: number;
};

export default function PositionManager({ positions }: { positions: Position[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleCreate(formData: FormData) {
    setFormError(null);
    const result = await createPosition(formData);
    if (!result.ok) {
      const errs = result.errors as Record<string, string[]>;
      setFormError(Object.values(errs).flat()[0] || "Error al crear el puesto");
      return;
    }
    setShowForm(false);
    router.refresh();
  }

  function handleToggle(id: number, current: boolean) {
    startTransition(() => togglePosition(id, !current));
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Existing positions list */}
      {positions.map((p) => (
        <div
          key={p.id}
          className="rounded-xl p-4 flex items-center gap-4 transition-all"
          style={{
            backgroundColor: p.isActive ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)",
            border: `1px solid ${p.isActive ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.04)"}`,
          }}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-body-lg" style={{ color: p.isActive ? "#fff" : "var(--color-ink-mute)", fontWeight: 500 }}>
                {p.title}
              </p>
              {!p.isActive ? (
                <span className="text-micro-cap px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: "rgba(234,34,97,0.15)", color: "#ea2261" }}>
                  Inactivo
                </span>
              ) : (
                <span className="text-micro-cap px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: "rgba(37,211,102,0.15)", color: "#25d366" }}>
                  Activo
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-3 text-micro" style={{ color: "var(--color-ink-mute)" }}>
              <span>{p.department}</span>
              <span>·</span>
              <span>{p.location}</span>
              <span>·</span>
              <span className="flex items-center gap-1 font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>
                <Users size={12} aria-hidden="true" /> {p.candidateCount} postulante{p.candidateCount !== 1 ? "s" : ""}
              </span>
            </div>
            {p.description && (
              <p className="text-micro mt-1" style={{ color: "var(--color-ink-mute-2)" }}>
                {p.description}
              </p>
            )}
          </div>
          <button
            onClick={() => handleToggle(p.id, p.isActive)}
            disabled={isPending}
            className="flex items-center gap-1.5 text-micro rounded-full px-3.5 py-1.5 transition-all hover:opacity-90"
            style={{
              backgroundColor: p.isActive ? "rgba(37,211,102,0.15)" : "rgba(255,255,255,0.06)",
              color: p.isActive ? "#25d366" : "var(--color-ink-mute)",
              border: `1px solid ${p.isActive ? "#25d36640" : "rgba(255,255,255,0.1)"}`,
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            {p.isActive ? <ToggleRight size={16} aria-hidden="true" /> : <ToggleLeft size={16} aria-hidden="true" />}
            {p.isActive ? "Activo" : "Inactivo"}
          </button>
        </div>
      ))}

      {/* New position form */}
      {showForm ? (
        <form
          action={handleCreate}
          className="rounded-xl p-5 mt-2"
          style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Briefcase size={16} style={{ color: "var(--color-primary-soft)" }} aria-hidden="true" />
            <p className="text-body-lg" style={{ color: "#fff", fontWeight: 500 }}>Crear Nuevo Puesto / Convocatoria</p>
          </div>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-caption block mb-1" style={{ color: "rgba(255,255,255,0.7)" }}>Nombre del puesto *</label>
              <input name="title" placeholder="Ej. Operador de Manlift, Mecánico de Mantenimiento" required className="input-field"
                style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "#fff", borderColor: "rgba(255,255,255,0.18)" }} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-caption block mb-1" style={{ color: "rgba(255,255,255,0.7)" }}>Servicio / Proyecto</label>
                <input name="department" defaultValue="Izaje – Antamina" className="input-field"
                  style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "#fff", borderColor: "rgba(255,255,255,0.18)" }} />
              </div>
              <div>
                <label className="text-caption block mb-1" style={{ color: "rgba(255,255,255,0.7)" }}>Ubicación</label>
                <input name="location" defaultValue="Huaraz / Mina Antamina" className="input-field"
                  style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "#fff", borderColor: "rgba(255,255,255,0.18)" }} />
              </div>
            </div>
            <div>
              <label className="text-caption block mb-1" style={{ color: "rgba(255,255,255,0.7)" }}>Descripción / Requisitos clave</label>
              <textarea name="description" placeholder="Brevetes requeridos, certificaciones, experiencia en minería…" rows={2}
                className="input-field resize-none"
                style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "#fff", borderColor: "rgba(255,255,255,0.18)" }} />
            </div>
            {formError && (
              <p className="text-micro" style={{ color: "var(--color-ruby)" }}>{formError}</p>
            )}
            <div className="flex gap-2 justify-end mt-2">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary px-4 py-2"
                style={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)", fontSize: "13px" }}>
                Cancelar
              </button>
              <button type="submit" className="btn-primary px-5 py-2 flex items-center gap-1.5" style={{ fontSize: "13px" }}>
                {isPending ? <Loader2 size={13} className="animate-spin" aria-hidden="true" /> : <Plus size={14} aria-hidden="true" />}
                Guardar Puesto
              </button>
            </div>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2 self-start px-5 py-2.5 mt-2"
        >
          <Plus size={16} aria-hidden="true" />
          Añadir Nuevo Puesto
        </button>
      )}
    </div>
  );
}
