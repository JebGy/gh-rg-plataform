"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateCandidateStatus } from "@/lib/actions/positions";
import {
  Search, Phone, Download, Users, MapPin, Zap,
  ChevronDown, MessageCircle, Check
} from "lucide-react";
import * as XLSX from "xlsx";

type Candidate = {
  id: string;
  fullName: string;
  dni: string;
  phone: string;
  email?: string | null;
  licenseNumber?: string | null;
  residenceCity: string;
  availability: string;
  status: string;
  recruiterNotes?: string | null;
  positionTitle: string;
  createdAt: string;
};

type Position = { id: number; title: string };

type Props = {
  candidates: Candidate[];
  positions: Position[];
  metrics: { total: number; inmediata: number; huaraz: number; byPosition: Record<number, number> };
  filters: { positionId?: string; status?: string; q?: string };
};

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  nuevo:      { label: "Nuevo",        color: "#533afd", bg: "rgba(83,58,253,0.12)" },
  contactado: { label: "Contactado",   color: "#a8d8c4", bg: "rgba(168,216,196,0.15)" },
  evaluando:  { label: "Evaluando",    color: "#f4d35e", bg: "rgba(244,211,94,0.15)" },
  califica:   { label: "Califica",     color: "#25d366", bg: "rgba(37,211,102,0.15)" },
  descartado: { label: "Descartado",   color: "#ea2261", bg: "rgba(234,34,97,0.15)" },
};

export default function AdminCandidatesView({ candidates, positions, metrics, filters }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(filters.q || "");
  const [activeStatus, setActiveStatus] = useState<Record<string, string>>({});
  const [activeNotes, setActiveNotes] = useState<Record<string, string>>({});
  const [openNotes, setOpenNotes] = useState<string | null>(null);

  function applyFilter(key: string, value: string) {
    const params = new URLSearchParams(window.location.search);
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/admin?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    applyFilter("q", search);
  }

  async function handleStatusChange(id: string, status: string) {
    setActiveStatus((prev) => ({ ...prev, [id]: status }));
    startTransition(() => updateCandidateStatus(id, status));
  }

  async function handleNotesSave(id: string) {
    const notes = activeNotes[id] ?? "";
    const status = activeStatus[id] ?? candidates.find((c) => c.id === id)?.status ?? "nuevo";
    startTransition(() => updateCandidateStatus(id, status, notes));
    setOpenNotes(null);
  }

  function exportToExcel() {
    const rows = candidates.map((c) => ({
      Puesto: c.positionTitle,
      "Nombre Completo": c.fullName,
      DNI: c.dni,
      Celular: c.phone,
      Email: c.email || "",
      "N° Licencia / Brevete": c.licenseNumber || "",
      "Lugar de Residencia": c.residenceCity,
      Disponibilidad: c.availability,
      Estado: STATUS_LABELS[c.status]?.label || c.status,
      "Notas Reclutador": c.recruiterNotes || "",
      "Fecha de Registro": new Date(c.createdAt).toLocaleString("es-PE"),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Base de Candidatos");
    XLSX.writeFile(wb, `candidatos-izaje-antamina-${Date.now()}.xlsx`);
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* ── Header ───────────────────────────────── */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-display-md" style={{ color: "#fff", fontSize: "28px" }}>
            Base de Datos de Candidatos
          </h1>
          <p className="text-body-md mt-1" style={{ color: "var(--color-ink-mute)" }}>
            Campaña de Reclutamiento Huaraz · Servicio de Izaje Antamina
          </p>
        </div>
        <button
          onClick={exportToExcel}
          className="btn-primary flex items-center gap-2 px-5 py-2.5"
          style={{ fontSize: "14px" }}
        >
          <Download size={15} aria-hidden="true" />
          Descargar Excel Completo
        </button>
      </div>

      {/* ── Metrics Cards ────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Registrados", value: metrics.total, icon: <Users size={20} aria-hidden="true" style={{ color: "var(--color-primary-soft)" }} /> },
          { label: "Disponibilidad Inmediata", value: metrics.inmediata, icon: <Zap size={20} aria-hidden="true" style={{ color: "#f96bee" }} /> },
          { label: "Residentes en Huaraz", value: metrics.huaraz, icon: <MapPin size={20} aria-hidden="true" style={{ color: "#a8d8c4" }} /> },
          { label: "Puestos Convocados", value: positions.length, icon: <Phone size={20} aria-hidden="true" style={{ color: "var(--color-primary-bg-hover)" }} /> },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded-xl p-5 flex items-center gap-4"
            style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex-shrink-0">{m.icon}</div>
            <div>
              <p className="text-display-md" style={{ color: "#fff", fontSize: "28px", fontWeight: 300 }}>{m.value}</p>
              <p className="text-micro" style={{ color: "var(--color-ink-mute)" }}>{m.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters & Search ─────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-48">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-ink-mute)" }} aria-hidden="true" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, DNI, celular o residencia…"
              className="w-full pl-8 pr-3 py-2 rounded-full text-body-md"
              style={{
                backgroundColor: "rgba(255,255,255,0.07)", color: "#fff",
                border: "1px solid rgba(255,255,255,0.1)",
                outline: "none", fontSize: "14px",
              }}
            />
          </div>
          <button type="submit" className="btn-primary px-4 py-2" style={{ fontSize: "13px" }}>Buscar</button>
        </form>

        <select
          defaultValue={filters.positionId || ""}
          onChange={(e) => applyFilter("positionId", e.target.value)}
          className="rounded-full px-4 py-2 text-body-md"
          style={{
            backgroundColor: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.9)",
            border: "1px solid rgba(255,255,255,0.15)", fontSize: "14px", outline: "none",
          }}
        >
          <option value="" style={{ backgroundColor: "var(--color-brand-dark)" }}>Todos los puestos</option>
          {positions.map((p) => (
            <option key={p.id} value={p.id} style={{ backgroundColor: "var(--color-brand-dark)" }}>{p.title}</option>
          ))}
        </select>

        <select
          defaultValue={filters.status || ""}
          onChange={(e) => applyFilter("status", e.target.value)}
          className="rounded-full px-4 py-2 text-body-md"
          style={{
            backgroundColor: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.9)",
            border: "1px solid rgba(255,255,255,0.15)", fontSize: "14px", outline: "none",
          }}
        >
          <option value="" style={{ backgroundColor: "var(--color-brand-dark)" }}>Todos los estados</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k} style={{ backgroundColor: "var(--color-brand-dark)" }}>{v.label}</option>
          ))}
        </select>
      </div>

      {/* ── Candidate Cards ───────────────────────── */}
      {candidates.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border" style={{ backgroundColor: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)", color: "var(--color-ink-mute)" }}>
          <Users size={44} className="mx-auto mb-3 opacity-30" aria-hidden="true" />
          <p className="text-body-lg" style={{ color: "rgba(255,255,255,0.7)" }}>No hay candidatos registrados con los filtros actuales</p>
          <p className="text-caption mt-1" style={{ color: "var(--color-ink-mute)" }}>Los registros enviados desde el formulario público aparecerán aquí automáticamente.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {candidates.map((c) => {
            const currentStatus = activeStatus[c.id] ?? c.status;
            const badge = STATUS_LABELS[currentStatus] ?? STATUS_LABELS.nuevo;

            return (
              <div
                key={c.id}
                className="rounded-xl p-4 flex flex-wrap items-start gap-4 transition-all"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {/* Left info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <p className="text-body-lg" style={{ color: "#fff", fontWeight: 500 }}>{c.fullName}</p>
                    <span
                      className="text-micro-cap px-2.5 py-0.5 rounded-full uppercase"
                      style={{ backgroundColor: badge.bg, color: badge.color, fontWeight: 500 }}
                    >
                      {badge.label}
                    </span>
                    <span className="text-micro-cap px-2.5 py-0.5 rounded-full"
                      style={{ backgroundColor: "rgba(83,58,253,0.15)", color: "var(--color-primary-soft)" }}>
                      {c.positionTitle}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2">
                    <span className="text-tabular" style={{ color: "rgba(255,255,255,0.75)" }}>DNI: <strong>{c.dni}</strong></span>
                    <span className="text-tabular" style={{ color: "rgba(255,255,255,0.75)" }}>Cel: <strong>{c.phone}</strong></span>
                    {c.licenseNumber && (
                      <span className="text-tabular" style={{ color: "rgba(255,255,255,0.75)" }}>Lic: <strong>{c.licenseNumber}</strong></span>
                    )}
                    <span className="text-micro flex items-center gap-1" style={{ color: "var(--color-ink-mute)" }}>
                      <MapPin size={11} aria-hidden="true" /> {c.residenceCity}
                    </span>
                    <span className="text-micro" style={{ color: "var(--color-ink-mute)" }}>
                      Disp: <strong>{c.availability}</strong>
                    </span>
                    <span className="text-micro" style={{ color: "var(--color-ink-mute-2)" }}>
                      Reg: {new Date(c.createdAt).toLocaleDateString("es-PE")}
                    </span>
                  </div>
                  {c.recruiterNotes && openNotes !== c.id && (
                    <p className="text-micro italic p-2 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.7)" }}>
                      Nota: {c.recruiterNotes}
                    </p>
                  )}
                  {openNotes === c.id && (
                    <div className="mt-2 flex gap-2">
                      <textarea
                        rows={2}
                        defaultValue={c.recruiterNotes || ""}
                        onChange={(e) => setActiveNotes((p) => ({ ...p, [c.id]: e.target.value }))}
                        placeholder="Observaciones de Sheila / Geovanna / Favio sobre el candidato…"
                        className="flex-1 rounded-lg px-3 py-2 text-micro resize-none"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.07)", color: "#fff",
                          border: "1px solid rgba(255,255,255,0.15)", fontSize: "13px", outline: "none",
                        }}
                      />
                      <button onClick={() => handleNotesSave(c.id)} className="btn-primary px-4 py-1 self-end" style={{ fontSize: "12px" }}>
                        Guardar
                      </button>
                    </div>
                  )}
                </div>

                {/* Right actions */}
                <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                  {/* Status dropdown */}
                  <div className="relative">
                    <select
                      value={currentStatus}
                      onChange={(e) => handleStatusChange(c.id, e.target.value)}
                      className="rounded-full pl-3 pr-7 py-1.5 text-micro appearance-none cursor-pointer font-medium"
                      style={{
                        backgroundColor: badge.bg, color: badge.color,
                        border: `1px solid ${badge.color}60`, fontSize: "12px", outline: "none",
                      }}
                    >
                      {Object.entries(STATUS_LABELS).map(([k, v]) => (
                        <option key={k} value={k} style={{ backgroundColor: "var(--color-brand-dark)", color: "#fff" }}>{v.label}</option>
                      ))}
                    </select>
                    <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: badge.color }} aria-hidden="true" />
                  </div>

                  {/* Notes toggle button */}
                  <button
                    onClick={() => setOpenNotes(openNotes === c.id ? null : c.id)}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
                    style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                    title="Agregar notas de reclutador"
                  >
                    <MessageCircle size={14} style={{ color: "rgba(255,255,255,0.8)" }} aria-hidden="true" />
                  </button>

                  {/* WhatsApp 1-click Contact Button */}
                  <a
                    href={`https://wa.me/51${c.phone}?text=${encodeURIComponent(
                      `Hola ${c.fullName.split(" ")[0]}, te saluda el equipo de Reclutamiento para el servicio de Izaje – Antamina en Huaraz. Hemos revisado tu registro para el puesto de ${c.positionTitle} y queremos coordinar una breve entrevista. ¿Tienes disponibilidad para conversar?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-opacity hover:opacity-85"
                    style={{ backgroundColor: "#25d366", color: "#fff", fontSize: "12px", fontWeight: 500 }}
                    title="Contactar vía WhatsApp"
                  >
                    <Phone size={12} aria-hidden="true" />
                    WhatsApp
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
