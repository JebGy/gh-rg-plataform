"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPosition, togglePosition } from "@/lib/actions/positions";
import { Plus, Loader2, Users, ToggleLeft, ToggleRight, Briefcase, Check } from "lucide-react";

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
    <div className="space-y-4">
      {/* ── Lista de Puestos en Cards Modulares ───────────────────── */}
      {positions.map((p, i) => (
        <div
          key={p.id}
          className={`rounded-xl border p-4 sm:p-5 flex items-center justify-between gap-4 transition-all bg-white ${
            p.isActive ? "border-zinc-200 shadow-2xs" : "border-zinc-200 bg-zinc-50/60 opacity-75"
          }`}
        >
          <div className="flex items-start gap-3.5 min-w-0 flex-1">
            {/* Número de índice destacado visualmente en la parte superior */}
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold flex-shrink-0 mt-0.5 ${
                p.isActive
                  ? "bg-[rgba(43,160,122,0.12)] text-[var(--brand-primary)]"
                  : "bg-zinc-200 text-zinc-500"
              }`}
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-base font-bold text-zinc-900">{p.title}</span>
                {!p.isActive ? (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200">
                    Inactivo en Formulario
                  </span>
                ) : (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Activo para Postulación
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                <span>{p.department}</span>
                <span>·</span>
                <span>{p.location}</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1 font-semibold text-zinc-700">
                  <Users size={12} aria-hidden="true" />
                  {p.candidateCount} postulante{p.candidateCount !== 1 ? "s" : ""}
                </span>
              </div>

              {p.description && (
                <p className="text-xs text-zinc-600 mt-1.5 leading-normal">
                  {p.description}
                </p>
              )}
            </div>
          </div>

          {/* Switch de Activación */}
          <button
            onClick={() => handleToggle(p.id, p.isActive)}
            disabled={isPending}
            className={`flex items-center gap-1.5 text-xs font-semibold rounded-md px-3 py-1.5 border transition-all ${
              p.isActive
                ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                : "bg-zinc-100 text-zinc-600 border-zinc-300 hover:bg-zinc-200"
            }`}
          >
            {p.isActive ? <ToggleRight size={16} aria-hidden="true" /> : <ToggleLeft size={16} aria-hidden="true" />}
            <span>{p.isActive ? "Activo" : "Inactivo"}</span>
          </button>
        </div>
      ))}

      {/* ── Formulario de Nuevo Puesto ────────────────────────────── */}
      {showForm ? (
        <form
          action={handleCreate}
          className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs"
        >
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-100">
            <Briefcase size={18} className="text-[var(--brand-primary)]" aria-hidden="true" />
            <h3 className="text-base font-bold text-zinc-900">Crear Nuevo Cargo Convocado</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="form-label">Nombre del puesto *</label>
              <input
                name="title"
                placeholder="Ej. Operador de Manlift, Mecánico de Mantenimiento..."
                required
                className="form-input"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Servicio / Proyecto</label>
                <input
                  name="department"
                  defaultValue="Izaje – Antamina"
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Ubicación de Operación</label>
                <input
                  name="location"
                  defaultValue="Huaraz / Mina Antamina"
                  className="form-input"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Descripción y Requisitos (opcional)</label>
              <textarea
                name="description"
                rows={2}
                placeholder="Brevete requerido, experiencia en minería, certificaciones técnicas..."
                className="form-input resize-none"
              />
            </div>

            {formError && (
              <p className="text-xs font-semibold text-red-600">{formError}</p>
            )}

            <div className="flex gap-2.5 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary text-xs py-2 px-3.5"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
              >
                {isPending ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : <Plus size={14} aria-hidden="true" />}
                <span>Guardar Cargo</span>
              </button>
            </div>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary text-sm py-2.5 px-4 flex items-center gap-2"
        >
          <Plus size={16} aria-hidden="true" />
          <span>Añadir Nuevo Cargo</span>
        </button>
      )}
    </div>
  );
}
