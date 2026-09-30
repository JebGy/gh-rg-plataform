"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateCandidateStatus } from "@/lib/actions/positions";
import { updatePalfingerStatusAction } from "@/lib/actions/palfinger";
import type { PalfingerRegistration } from "@/lib/data/palfinger";
import {
  Search, Phone, Download, Users, MapPin, Zap,
  ChevronDown, MessageCircle, Briefcase, FileSpreadsheet,
  Award, FileText, CheckCircle2, AlertTriangle, ExternalLink,
  Layers, HardHat, Check
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
  filters: { positionId?: string; status?: string; q?: string; tab?: string };
  palfingerRegistrations?: PalfingerRegistration[];
};

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  nuevo:      { label: "Nuevo",        bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200" },
  contactado: { label: "Contactado",   bg: "bg-amber-50",  text: "text-amber-800",  border: "border-amber-200" },
  evaluando:  { label: "Evaluando",    bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  califica:   { label: "Califica",     bg: "bg-emerald-50",text: "text-emerald-700",border: "border-emerald-200" },
  confirmado: { label: "Confirmado",   bg: "bg-emerald-50",text: "text-emerald-700",border: "border-emerald-200" },
  descartado: { label: "Descartado",   bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200" },
};

export default function AdminCandidatesView({
  candidates,
  positions,
  metrics,
  filters,
  palfingerRegistrations = [],
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Active Tab: default to "palfinger" if present or from query param
  const [activeTab, setActiveTab] = useState<"palfinger" | "recruitment">(
    (filters.tab === "recruitment" ? "recruitment" : "palfinger")
  );

  const [search, setSearch] = useState(filters.q || "");
  const [activeStatus, setActiveStatus] = useState<Record<string, string>>({});
  const [activeNotes, setActiveNotes] = useState<Record<string, string>>({});
  const [openNotes, setOpenNotes] = useState<string | null>(null);

  // Palfinger specific filters
  const [palfingerFilterProfile, setPalfingerFilterProfile] = useState<string>("");
  const [palfingerFilterStatus, setPalfingerFilterStatus] = useState<string>("");

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

  async function handleStatusChange(id: string, status: string, isPalfinger = false) {
    setActiveStatus((prev) => ({ ...prev, [id]: status }));
    startTransition(async () => {
      if (isPalfinger) {
        await updatePalfingerStatusAction(id, status as any);
      } else {
        await updateCandidateStatus(id, status);
      }
    });
  }

  async function handleNotesSave(id: string, isPalfinger = false) {
    const notes = activeNotes[id] ?? "";
    const status = activeStatus[id] ?? (isPalfinger
      ? palfingerRegistrations.find(r => r.id === id)?.status ?? "nuevo"
      : candidates.find((c) => c.id === id)?.status ?? "nuevo");

    startTransition(async () => {
      if (isPalfinger) {
        await updatePalfingerStatusAction(id, status as any, notes);
      } else {
        await updateCandidateStatus(id, status, notes);
      }
    });
    setOpenNotes(null);
  }

  // Export Palfinger registrants to Excel
  function exportPalfingerToExcel() {
    const rows = filteredPalfinger.map((r) => ({
      "Nombre Completo": r.fullName,
      DNI: r.dni,
      Celular: r.phone,
      Email: r.email || "",
      "Ciudad / Residencia": r.residenceCity,
      "Perfil Profesional": r.profile,
      "Años de Experiencia": r.experienceYears,
      "Equipos Operados": Array.isArray(r.equipmentExperience) ? r.equipmentExperience.join(", ") : r.equipmentExperience,
      Sectores: Array.isArray(r.sectors) ? r.sectors.join(", ") : r.sectors,
      "Exp. Izaje Minería": r.miningExperience,
      "Exp. PALFINGER": r.palfingerExperience,
      "Franja / Categoría": r.categoryBadge,
      "Tiene CV": r.cvFileName ? `Sí (${r.cvFileName})` : "No",
      "Interés Oportunidades": r.futureOpportunities,
      Estado: STATUS_CONFIG[r.status]?.label || r.status,
      "Notas Coordinador": r.recruiterNotes || "",
      "Fecha Registro": new Date(r.createdAt).toLocaleString("es-PE"),
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inscritos PALFINGER");
    XLSX.writeFile(wb, `capacitacion-palfinger-registros-${Date.now()}.xlsx`);
  }

  // Export Antamina candidates to Excel
  function exportRecruitmentToExcel() {
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

  // Filter Palfinger registrants
  const filteredPalfinger = palfingerRegistrations.filter((r) => {
    if (palfingerFilterProfile && !r.profile.toLowerCase().includes(palfingerFilterProfile.toLowerCase())) {
      return false;
    }
    if (palfingerFilterStatus && r.status !== palfingerFilterStatus) {
      return false;
    }
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      const match =
        r.fullName.toLowerCase().includes(q) ||
        r.dni.includes(q) ||
        r.phone.includes(q) ||
        r.residenceCity.toLowerCase().includes(q) ||
        r.profile.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Palfinger Metrics
  const palfingerTotal = palfingerRegistrations.length;
  const palfingerMineria = palfingerRegistrations.filter((r) => r.miningExperience === "Sí").length;
  const palfingerPalfingerExp = palfingerRegistrations.filter((r) => r.palfingerExperience === "Sí").length;
  const palfingerWithCv = palfingerRegistrations.filter((r) => Boolean(r.cvFileName)).length;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* ── Header de Gestión ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="badge-tag">
              Panel Administrativo Central
            </span>
            <span className="text-xs font-semibold text-zinc-400">
              Ramirez Group × Zapler × PALFINGER
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
            Base Operativa de Participantes & Postulantes
          </h1>
          <p className="text-sm text-zinc-600 mt-1">
            Gestión en tiempo real de registros para Capacitación Técnica PALFINGER y Convocatoria Mina Antamina.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {activeTab === "palfinger" ? (
            <button
              onClick={exportPalfingerToExcel}
              className="btn-primary py-2.5 px-4 text-xs sm:text-sm flex items-center gap-2 bg-[#E30613] hover:bg-[#c40510]"
            >
              <FileSpreadsheet size={16} aria-hidden="true" />
              <span>Exportar PALFINGER (.xlsx)</span>
            </button>
          ) : (
            <button
              onClick={exportRecruitmentToExcel}
              className="btn-primary py-2.5 px-4 text-xs sm:text-sm flex items-center gap-2"
            >
              <FileSpreadsheet size={16} aria-hidden="true" />
              <span>Exportar Antamina (.xlsx)</span>
            </button>
          )}

          <Link
            href={activeTab === "palfinger" ? "/" : "/recruitment"}
            target="_blank"
            className="btn-secondary py-2.5 px-3 text-xs sm:text-sm flex items-center gap-1.5"
            title="Ver landing pública"
          >
            <span>Ver Landing</span>
            <ExternalLink size={14} />
          </Link>
        </div>
      </div>

      {/* ── Selector de Pestañas / Tabs ───────────────────────────── */}
      <div className="flex items-center gap-3 border-b border-zinc-200 pb-1">
        <button
          onClick={() => {
            setActiveTab("palfinger");
            applyFilter("tab", "palfinger");
          }}
          className={`flex items-center gap-2 py-3 px-5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
            activeTab === "palfinger"
              ? "bg-[#E30613] text-white shadow-sm"
              : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
          }`}
        >
          <Award size={18} />
          <span>Capacitación PALFINGER</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            activeTab === "palfinger" ? "bg-white/20 text-white" : "bg-zinc-200 text-zinc-700"
          }`}>
            {palfingerTotal}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab("recruitment");
            applyFilter("tab", "recruitment");
          }}
          className={`flex items-center gap-2 py-3 px-5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
            activeTab === "recruitment"
              ? "bg-[var(--brand-primary)] text-white shadow-sm"
              : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
          }`}
        >
          <Briefcase size={18} />
          <span>Convocatoria Antamina (Bolsa)</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            activeTab === "recruitment" ? "bg-white/20 text-white" : "bg-zinc-200 text-zinc-700"
          }`}>
            {candidates.length}
          </span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* ── TAB 1: CAPACITACIÓN PALFINGER ─────────────────────────── */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {activeTab === "palfinger" && (
        <div className="space-y-6">
          {/* Métricas PALFINGER */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                idx: "01",
                label: "Inscritos PALFINGER",
                value: palfingerTotal,
                desc: "Postulantes a capacitación",
                color: "#E30613",
              },
              {
                idx: "02",
                label: "Exp. en Izaje Minero",
                value: palfingerMineria,
                desc: "Han operado en minería",
                color: "#d97706",
              },
              {
                idx: "03",
                label: "Exp. Previa PALFINGER",
                value: palfingerPalfingerExp,
                desc: "Conocen la tecnología",
                color: "#2563eb",
              },
              {
                idx: "04",
                label: "CVs Adjuntos",
                value: palfingerWithCv,
                desc: "Documentación lista",
                color: "var(--brand-accent)",
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
                    PALFINGER
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

          {/* Barra de Filtros PALFINGER */}
          <div className="bg-white p-4 rounded-xl border border-zinc-200 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre, DNI, celular, ciudad o perfil..."
                className="form-input pl-10 text-sm py-2"
              />
            </div>

            <div className="flex flex-wrap gap-2.5">
              <select
                value={palfingerFilterProfile}
                onChange={(e) => setPalfingerFilterProfile(e.target.value)}
                className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 outline-none focus:border-[#E30613]"
              >
                <option value="">Todos los perfiles</option>
                <option value="Operador de grúa">Operador de grúa</option>
                <option value="Rigger">Rigger</option>
                <option value="Operador / Rigger">Operador / Rigger</option>
                <option value="Otro">Otro</option>
              </select>

              <select
                value={palfingerFilterStatus}
                onChange={(e) => setPalfingerFilterStatus(e.target.value)}
                className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 outline-none focus:border-[#E30613]"
              >
                <option value="">Todos los estados</option>
                <option value="nuevo">Nuevo</option>
                <option value="contactado">Contactado</option>
                <option value="evaluando">Evaluando</option>
                <option value="confirmado">Confirmado</option>
                <option value="descartado">Descartado</option>
              </select>
            </div>
          </div>

          {/* Lista de Registrados PALFINGER */}
          {filteredPalfinger.length === 0 ? (
            <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#E30613] flex items-center justify-center mx-auto mb-3">
                <Award size={28} />
              </div>
              <h3 className="text-base font-bold text-zinc-900">
                Aún no hay inscritos en la Capacitación PALFINGER
              </h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                Los registros completados desde el formulario oficial aparecerán aquí con todos sus datos técnicos y CV.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPalfinger.map((reg) => {
                const currentStatus = activeStatus[reg.id] ?? reg.status;
                const statusStyle = STATUS_CONFIG[currentStatus] ?? STATUS_CONFIG.nuevo;

                return (
                  <div
                    key={reg.id}
                    className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-xs hover:border-zinc-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                  >
                    {/* Datos Principales */}
                    <div className="space-y-3 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="text-base sm:text-lg font-bold text-zinc-900">
                          {reg.fullName}
                        </span>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                          {statusStyle.label}
                        </span>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-red-50 text-[#E30613] border border-red-200">
                          {reg.profile}
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700">
                          Exp: {reg.experienceYears}
                        </span>
                      </div>

                      {/* Detalles técnicos */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-zinc-600 bg-zinc-50/70 p-3 rounded-xl border border-zinc-100">
                        <div>
                          <strong className="text-zinc-900 block font-semibold">DNI:</strong>
                          <span className="text-tabular">{reg.dni}</span>
                        </div>
                        <div>
                          <strong className="text-zinc-900 block font-semibold">Celular:</strong>
                          <span className="text-tabular">{reg.phone}</span>
                        </div>
                        <div>
                          <strong className="text-zinc-900 block font-semibold">Residencia:</strong>
                          <span>{reg.residenceCity}</span>
                        </div>
                        <div>
                          <strong className="text-zinc-900 block font-semibold">Franja / Cat:</strong>
                          <span className="font-semibold text-zinc-900">{reg.categoryBadge}</span>
                        </div>
                      </div>

                      {/* Equipos, Sectores, Minería & Palfinger */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-600 pt-1">
                        <div>
                          <strong className="text-zinc-800">Equipos:</strong>{" "}
                          <span>{Array.isArray(reg.equipmentExperience) ? reg.equipmentExperience.join(", ") : reg.equipmentExperience}</span>
                        </div>
                        <div>
                          <strong className="text-zinc-800">Sectores:</strong>{" "}
                          <span>{Array.isArray(reg.sectors) ? reg.sectors.join(", ") : reg.sectors}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            reg.miningExperience === "Sí" ? "bg-emerald-100 text-emerald-800" : "bg-zinc-100 text-zinc-600"
                          }`}>
                            Minería: {reg.miningExperience}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            reg.palfingerExperience === "Sí" ? "bg-red-100 text-[#E30613]" : "bg-zinc-100 text-zinc-600"
                          }`}>
                            Exp. PALFINGER: {reg.palfingerExperience}
                          </span>
                        </div>
                        {reg.cvFilePath && (
                          <a
                            href={reg.cvFilePath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 underline"
                          >
                            <FileText size={13} />
                            <span>Descargar CV ({reg.cvFileName})</span>
                          </a>
                        )}
                      </div>

                      {reg.recruiterNotes && openNotes !== reg.id && (
                        <div className="text-xs text-zinc-700 bg-amber-50/60 border border-amber-200 rounded-lg p-2.5 mt-2">
                          <strong className="text-amber-950 font-bold block mb-0.5">Observación Coordinador:</strong>
                          {reg.recruiterNotes}
                        </div>
                      )}

                      {openNotes === reg.id && (
                        <div className="mt-2 flex gap-2 pt-2 border-t border-zinc-100">
                          <textarea
                            rows={2}
                            defaultValue={reg.recruiterNotes || ""}
                            onChange={(e) => setActiveNotes((p) => ({ ...p, [reg.id]: e.target.value }))}
                            placeholder="Añadir notas sobre la evaluación técnica o llamada..."
                            className="form-input text-xs flex-1 resize-none"
                          />
                          <button
                            onClick={() => handleNotesSave(reg.id, true)}
                            className="btn-primary text-xs py-1 px-3 self-end bg-[#E30613]"
                          >
                            Guardar
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Acciones Rápidas */}
                    <div className="flex lg:flex-col items-center lg:items-end gap-2.5 flex-shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-zinc-100">
                      {/* Selector de Estado */}
                      <select
                        value={currentStatus}
                        onChange={(e) => handleStatusChange(reg.id, e.target.value, true)}
                        className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-800 outline-none cursor-pointer hover:bg-zinc-50 focus:border-[#E30613]"
                      >
                        <option value="nuevo">Nuevo</option>
                        <option value="contactado">Contactado</option>
                        <option value="evaluando">Evaluando</option>
                        <option value="confirmado">Confirmado</option>
                        <option value="descartado">Descartado</option>
                      </select>

                      <div className="flex items-center gap-2">
                        {/* Botón de Notas */}
                        <button
                          onClick={() => setOpenNotes(openNotes === reg.id ? null : reg.id)}
                          className="p-2 rounded-lg border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
                          title="Añadir observación"
                        >
                          <MessageCircle size={15} />
                        </button>

                        {/* WhatsApp PALFINGER 1-Clic */}
                        <a
                          href={`https://wa.me/51${reg.phone}?text=${encodeURIComponent(
                            `Hola ${reg.fullName.split(" ")[0]}, te saludamos del equipo de Capacitación Técnica de Grúas PALFINGER (Ramirez Group × Zapler). Hemos recibido tu postulación con perfil de ${reg.profile}. Nos gustaría coordinar los detalles de tu participación. ¿Podemos conversar?`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#25d366] text-white px-3 py-1.5 text-xs font-bold hover:bg-[#20ba59] transition-colors shadow-2xs"
                        >
                          <Phone size={13} />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* ── TAB 2: CONVOCATORIA ANTAMINA (BOLSA ORIGINAL) ──────────── */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {activeTab === "recruitment" && (
        <div className="space-y-6">
          {/* 4.2. Tarjetas Modulares con Enumeración (Métricas) */}
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

          {/* Barra de Búsqueda y Filtros Utilitarios */}
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

          {/* Lista de Postulantes Antamina */}
          {candidates.length === 0 ? (
            <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-3 text-zinc-400">
                <Users size={24} aria-hidden="true" />
              </div>
              <p className="text-base font-bold text-zinc-800">No se encontraron postulantes registrados</p>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                Los registros ingresados desde la convocatoria aparecerán aquí.
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
                            placeholder="Escriba las observaciones del postulante..."
                            className="form-input text-xs flex-1 resize-none"
                          />
                          <button
                            onClick={() => handleNotesSave(c.id, false)}
                            className="btn-primary text-xs py-1 px-3 self-end"
                          >
                            Guardar
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center gap-2 flex-shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-zinc-100">
                      <select
                        value={currentStatus}
                        onChange={(e) => handleStatusChange(c.id, e.target.value, false)}
                        className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 outline-none cursor-pointer hover:bg-zinc-50 focus:border-[var(--brand-primary)]"
                      >
                        {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                          <option key={k} value={k}>{v.label}</option>
                        ))}
                      </select>

                      <button
                        onClick={() => setOpenNotes(openNotes === c.id ? null : c.id)}
                        className="p-2 rounded-md border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
                        title="Añadir nota"
                      >
                        <MessageCircle size={15} />
                      </button>

                      <a
                        href={`https://wa.me/51${c.phone}?text=${encodeURIComponent(
                          `Hola ${c.fullName.split(" ")[0]}, te saluda el equipo de Reclutamiento de Ramirez Group. Hemos recibido tu postulación para el puesto de ${c.positionTitle} en el servicio de Izaje - Antamina (Huaraz). Nos gustaría coordinar una breve entrevista. ¿Tienes disponibilidad para conversar?`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-md bg-[#25d366] text-white px-3.5 py-1.5 text-xs font-semibold hover:bg-[#20ba59] transition-colors shadow-2xs"
                      >
                        <Phone size={13} />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
