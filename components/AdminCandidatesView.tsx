"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateCandidateStatus } from "@/lib/actions/positions";
import {
  Search, Phone, Download, Users, MapPin, Zap,
  ChevronDown, MessageCircle, Briefcase, FileSpreadsheet
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

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  nuevo:      { label: "Nuevo",        bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200" },
  contactado: { label: "Contactado",   bg: "bg-amber-50",  text: "text-amber-800",  border: "border-amber-200" },
  evaluando:  { label: "Evaluando",    bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  califica:   { label: "Califica",     bg: "bg-emerald-50",text: "text-emerald-700",border: "border-emerald-200" },
  descartado: { label: "Descartado",   bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200" },
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
      "N° Licencia / Certificación": c.licenseNumber || "",
      "Lugar de Residencia": c.residenceCity,
      Disponibilidad: c.availability,
      Estado: STATUS_CONFIG[c.status]?.label || c.status,
      "Notas Reclutador": c.recruiterNotes || "",
      "Fecha de Registro": new Date(c.createdAt).toLocaleString("es-PE"),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Candidatos Ramirez Group");
    XLSX.writeFile(wb, `candidatos-izaje-ramirez-group-${Date.now()}.xlsx`);
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* ── Header de Gestión ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-zinc-200">
        <div>
          <span className="badge-tag mb-1">
            Plataforma de Selección
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Base Centralizada de Candidatos
          </h1>
          <p className="text-sm text-zinc-600 mt-0.5">
            Campaña Huaraz · Servicio de Izaje – Mina Antamina
          </p>
        </div>

        <button
          onClick={exportToExcel}
          className="btn-primary py-2.5 px-4 text-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <FileSpreadsheet size={16} aria-hidden="true" />
          <span>Exportar a Excel (.xlsx)</span>
        </button>
      </div>

      {/* ── 4.2. Tarjetas Modulares con Enumeración (Métricas) ──────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            idx: "01",
            label: "Total Postulantes",
            value: metrics.total,
            desc: "Registrados en sistema",
            color: "var(--brand-primary)",
          },
          {
            idx: "02",
            label: "Disponibilidad Inmediata",
            value: metrics.inmediata,
            desc: "Listos para inducción",
            color: "var(--brand-accent)",
          },
          {
            idx: "03",
            label: "Zona Huaraz / Áncash",
            value: metrics.huaraz,
            desc: "Residencia local",
            color: "#2563eb",
          },
          {
            idx: "04",
            label: "Puestos Convocados",
            value: positions.length,
            desc: "Perfiles activos",
            color: "#8b5cf6",
          },
        ].map((m) => (
          <div
            key={m.idx}
            className="rounded-xl border border-zinc-200 bg-white p-5 transition-shadow hover:shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-md text-xs font-bold"
                style={{ backgroundColor: `${m.color}15`, color: m.color }}
              >
                {m.idx}
              </span>
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Métrica
              </span>
            </div>
            <div>
              <p className="text-3xl font-bold text-zinc-900 text-tabular">{m.value}</p>
              <p className="text-xs font-semibold text-zinc-800 mt-1">{m.label}</p>
              <p className="text-[11px] text-zinc-500">{m.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Barra de Búsqueda y Filtros Utilitarios ───────────────── */}
      <div className="bg-white p-4 rounded-xl border border-zinc-200 flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[240px]">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, DNI, celular, licencia o ciudad..."
              className="form-input pl-10 text-sm py-2"
            />
          </div>
          <button type="submit" className="btn-secondary text-xs font-semibold py-2 px-3.5">
            Filtrar
          </button>
        </form>

        <div className="flex flex-wrap gap-2.5">
          <select
            defaultValue={filters.positionId || ""}
            onChange={(e) => applyFilter("positionId", e.target.value)}
            className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 outline-none focus:border-[var(--brand-primary)]"
          >
            <option value="">Todos los puestos</option>
            {positions.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>

          <select
            defaultValue={filters.status || ""}
            onChange={(e) => applyFilter("status", e.target.value)}
            className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 outline-none focus:border-[var(--brand-primary)]"
          >
            <option value="">Todos los estados</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Lista de Postulantes en Cards Modulares ───────────────── */}
      {candidates.length === 0 ? (
        <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-3 text-zinc-400">
            <Users size={24} aria-hidden="true" />
          </div>
          <p className="text-base font-bold text-zinc-800">No se encontraron postulantes registrados</p>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Los registros ingresados desde el formulario público aparecerán aquí automáticamente.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {candidates.map((c) => {
            const currentStatus = activeStatus[c.id] ?? c.status;
            const statusStyle = STATUS_CONFIG[currentStatus] ?? STATUS_CONFIG.nuevo;

            return (
              <div
                key={c.id}
                className="bg-white rounded-xl border border-zinc-200 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-zinc-300 transition-colors"
              >
                {/* Datos del Candidato */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-bold text-zinc-900">{c.fullName}</span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                      {statusStyle.label}
                    </span>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-zinc-100 text-zinc-700 border border-zinc-200">
                      {c.positionTitle}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-zinc-600">
                    <span className="text-tabular">
                      <strong className="text-zinc-900 font-semibold">DNI:</strong> {c.dni}
                    </span>
                    <span className="text-tabular">
                      <strong className="text-zinc-900 font-semibold">Celular:</strong> {c.phone}
                    </span>
                    {c.licenseNumber && (
                      <span className="text-tabular">
                        <strong className="text-zinc-900 font-semibold">Licencia:</strong> {c.licenseNumber}
                      </span>
                    )}
                    <span>
                      <strong className="text-zinc-900 font-semibold">Residencia:</strong> {c.residenceCity}
                    </span>
                    <span>
                      <strong className="text-zinc-900 font-semibold">Disp:</strong> {c.availability}
                    </span>
                    <span className="text-zinc-400">
                      Reg: {new Date(c.createdAt).toLocaleDateString("es-PE")}
                    </span>
                  </div>

                  {c.recruiterNotes && openNotes !== c.id && (
                    <div className="text-xs text-zinc-700 bg-zinc-50 border border-zinc-200 rounded-md p-2 mt-1 italic">
                      <strong className="not-italic text-zinc-900 font-semibold">Nota Sheila / Geovanna:</strong> {c.recruiterNotes}
                    </div>
                  )}

                  {openNotes === c.id && (
                    <div className="mt-2 flex gap-2 pt-2 border-t border-zinc-100">
                      <textarea
                        rows={2}
                        defaultValue={c.recruiterNotes || ""}
                        onChange={(e) => setActiveNotes((p) => ({ ...p, [c.id]: e.target.value }))}
                        placeholder="Escriba las observaciones del postulante (entrevista, documentos, etc.)..."
                        className="form-input text-xs flex-1 resize-none"
                      />
                      <button
                        onClick={() => handleNotesSave(c.id)}
                        className="btn-primary text-xs py-1 px-3 self-end"
                      >
                        Guardar
                      </button>
                    </div>
                  )}
                </div>

                {/* Acciones de Contacto y Estado */}
                <div className="flex items-center gap-2 flex-shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-zinc-100">
                  {/* Selector de Estado */}
                  <select
                    value={currentStatus}
                    onChange={(e) => handleStatusChange(c.id, e.target.value)}
                    className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 outline-none cursor-pointer hover:bg-zinc-50 focus:border-[var(--brand-primary)]"
                  >
                    {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>

                  {/* Notas del Reclutador */}
                  <button
                    onClick={() => setOpenNotes(openNotes === c.id ? null : c.id)}
                    className="p-2 rounded-md border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
                    title="Añadir nota de reclutamiento"
                  >
                    <MessageCircle size={15} aria-hidden="true" />
                  </button>

                  {/* WhatsApp 1-Clic para Sheila / Geovanna */}
                  <a
                    href={`https://wa.me/51${c.phone}?text=${encodeURIComponent(
                      `Hola ${c.fullName.split(" ")[0]}, te saluda el equipo de Reclutamiento de Ramirez Group. Hemos recibido tu postulación para el puesto de ${c.positionTitle} en el servicio de Izaje – Antamina (Huaraz). Nos gustaría coordinar una breve entrevista. ¿Tienes disponibilidad para conversar?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md bg-[#25d366] text-white px-3.5 py-1.5 text-xs font-semibold hover:bg-[#20ba59] transition-colors shadow-2xs"
                  >
                    <Phone size={13} aria-hidden="true" />
                    <span>WhatsApp</span>
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
