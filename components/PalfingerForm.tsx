"use client";

import { useActionState, useRef, useState } from "react";
import { registerPalfingerTraining, type PalfingerActionState } from "@/lib/actions/palfinger";
import {
  Loader2,
  CheckCircle2,
  UploadCloud,
  FileText,
  X,
  AlertTriangle,
  Share2,
  ArrowRight,
  ArrowLeft,
  Check,
  ChevronRight,
  ShieldCheck,
  FileCheck
} from "lucide-react";

const PROFILE_OPTIONS = [
  "Operador de grúa",
  "Rigger",
  "Operador / Rigger",
  "Otro"
];

const EXPERIENCE_YEARS_OPTIONS = [
  "Menos de 1 año",
  "1-3 años",
  "3-5 años",
  "5-10 años",
  "Más de 10 años"
];

const EQUIPMENT_OPTIONS = [
  "Camión grúa",
  "Grúa articulada",
  "Grúa telescópica",
  "Otro"
];

const SECTOR_OPTIONS = [
  "Minería",
  "Construcción",
  "Industria",
  "Puertos",
  "Energía",
  "Otros"
];

const CATEGORY_OPTIONS = [
  "Amarilla",
  "Roja",
  "Otra"
];

const AVAILABILITY_OPTIONS = [
  { value: "Sí", label: "Sí, estoy interesado" },
  { value: "No", label: "No por ahora" },
  { value: "Me gustaría recibir información", label: "Me gustaría recibir información" }
];

const CITY_CHIPS = ["Huaraz", "Lima", "Chimbote", "Trujillo", "Arequipa", "Cajamarca", "Otra ciudad"];

const initialState: PalfingerActionState = {};

export default function PalfingerForm() {
  const [state, formAction, pending] = useActionState(registerPalfingerTraining, initialState);

  // Stepper State: Step 1 (Personal data) -> Step 2 (Technical profile & experience)
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Step 1 Fields
  const [fullName, setFullName] = useState("");
  const [dni, setDni] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [residenceCity, setResidenceCity] = useState("Huaraz");
  const [customCity, setCustomCity] = useState("");

  // Step 1 Validation error hints
  const [step1Error, setStep1Error] = useState<string | null>(null);

  // Step 2 Fields
  const [selectedProfile, setSelectedProfile] = useState<string>("Operador de grúa");
  const [customProfile, setCustomProfile] = useState<string>("");

  const [selectedExpYears, setSelectedExpYears] = useState<string>("1-3 años");

  const [selectedEquipments, setSelectedEquipments] = useState<string[]>(["Camión grúa", "Grúa articulada"]);
  const [customEquipment, setCustomEquipment] = useState<string>("");

  const [selectedSectors, setSelectedSectors] = useState<string[]>(["Minería"]);
  const [customSector, setCustomSector] = useState<string>("");

  const [miningExp, setMiningExp] = useState<"Sí" | "No">("Sí");
  const [palfingerExp, setPalfingerExp] = useState<"Sí" | "No">("Sí");

  const [selectedCategory, setSelectedCategory] = useState<string>("Amarilla");
  const [customCategory, setCustomCategory] = useState<string>("");

  const [selectedFutureOpportunities, setSelectedFutureOpportunities] = useState<string>("Sí");
  const [termsAccepted, setTermsAccepted] = useState<boolean>(true);

  // CV File Upload state
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function toggleEquipment(item: string) {
    setSelectedEquipments((prev) =>
      prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item]
    );
  }

  function toggleSector(item: string) {
    setSelectedSectors((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
    );
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setCvFile(file);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setCvFile(file);
    }
  }

  function removeCvFile() {
    setCvFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleNextStep() {
    setStep1Error(null);
    if (!fullName.trim() || fullName.trim().length < 3) {
      setStep1Error("Ingresa tu nombre y apellidos completos.");
      return;
    }
    if (!/^\d{8}$/.test(dni.trim())) {
      setStep1Error("El DNI debe contener exactamente 8 dígitos numéricos.");
      return;
    }
    if (!/^9\d{8}$/.test(phone.trim())) {
      setStep1Error("Ingresa un celular válido de 9 dígitos (9XXXXXXXX).");
      return;
    }
    if (residenceCity === "Otra ciudad" && !customCity.trim()) {
      setStep1Error("Por favor especifica tu ciudad de residencia.");
      return;
    }

    setCurrentStep(2);
  }

  // ── 7. PANTALLA DESPUÉS DEL REGISTRO ──────────────────────────────
  if (state.success) {
    const shareMessage =
      "¡Certifícate gratis en Operación de Grúas PALFINGER! Capacitación técnica práctica con Ramirez Group y Zapler. Regístrate aquí:";
    const currentUrl = typeof window !== "undefined" ? window.location.origin : "https://ramirezgroup.com.pe";

    return (
      <div className="text-center p-2 sm:p-4 animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 text-[#06BCA3] flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={36} className="stroke-[2.2]" />
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 border border-teal-200 px-3 py-0.5 text-xs font-bold text-[#048674] uppercase tracking-wider mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#06BCA3] animate-pulse" />
          Proceso de Inscripción
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 mb-2">
          ¡REGISTRO RECIBIDO!
        </h3>

        <p className="text-sm text-zinc-700 leading-relaxed mb-3">
          Gracias por tu interés en participar en la{" "}
          <strong className="text-zinc-900">Capacitación Técnica Práctica de Grúas PALFINGER</strong>.
        </p>

        <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-5">
          Estamos revisando los perfiles registrados. Si tu perfil cumple con los criterios de participación, recibirás una invitación con los detalles de la capacitación.
        </p>

        {/* Tarjeta de Importante */}
        <div className="rounded-xl border border-teal-200 bg-teal-50/80 p-3.5 text-left mb-6 flex items-start gap-2.5">
          <AlertTriangle size={18} className="text-[#048674] flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-teal-950 uppercase tracking-wide">
              Importante
            </h4>
            <p className="text-xs font-medium text-teal-900 mt-0.5 leading-normal">
              Tu registro no confirma automáticamente tu participación.
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareMessage + "\n\n" + currentUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 bg-[#25d366] hover:bg-[#20ba59] text-white font-bold py-3 px-4 rounded-xl transition-all shadow-xs text-xs sm:text-sm"
          >
            <Share2 size={15} />
            <span>Compartir por WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={() => {
              setCurrentStep(1);
              window.location.reload();
            }}
            className="w-full inline-flex items-center justify-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors"
          >
            Registrar a otro operador
          </button>
        </div>
      </div>
    );
  }

  // ── FORMULARIO STEPPED ─────────────────────────────────────────────
  return (
    <form action={formAction} className="space-y-4">
      {/* Encabezado del Formulario (según diseño) */}
      <div className="border-b border-zinc-100 pb-3">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg sm:text-xl font-black text-zinc-950 uppercase tracking-tight">
            REGÍSTRATE PARA RECIBIR LA INVITACIÓN
          </h3>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-[#048674] border border-[#06BCA3]/30">
            {currentStep}/2
          </span>
        </div>
        <p className="text-xs text-zinc-600 leading-snug">
          {currentStep === 1
            ? "Completa tus datos personales para ser parte del proceso de selección técnica."
            : "Indica tu experiencia en equipos y franja para validar los criterios de participación."}
        </p>

        {/* Barra de Progreso */}
        <div className="w-full h-1.5 bg-zinc-100 rounded-full mt-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#06BCA3] to-[#049480] transition-all duration-300"
            style={{ width: currentStep === 1 ? "50%" : "100%" }}
          />
        </div>
      </div>

      {/* ── PASO 1: DATOS PERSONALES ─────────────────────────────────── */}
      {currentStep === 1 && (
        <div className="space-y-3.5 animate-in fade-in duration-200">
          <div>
            <label htmlFor="fullName" className="text-xs font-bold text-zinc-800 block mb-1">
              Nombres y apellidos <span className="text-red-500">*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ej. Juan Carlos Ramírez"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[#06BCA3] focus:bg-white transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label htmlFor="dni" className="text-xs font-bold text-zinc-800 block mb-1">
                DNI <span className="text-red-500">*</span>
              </label>
              <input
                id="dni"
                name="dni"
                type="text"
                inputMode="numeric"
                maxLength={8}
                value={dni}
                onChange={(e) => setDni(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="8 dígitos"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[#06BCA3] focus:bg-white transition-colors font-mono"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="text-xs font-bold text-zinc-800 block mb-1">
                Celular / WhatsApp <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                maxLength={9}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="9XXXXXXXX"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[#06BCA3] focus:bg-white transition-colors font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="text-xs font-bold text-zinc-800 block mb-1">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[#06BCA3] focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-800 block mb-1">
              Ciudad / lugar de residencia <span className="text-red-500">*</span>
            </label>
            <input
              type="hidden"
              name="residenceCity"
              value={residenceCity === "Otra ciudad" ? customCity : residenceCity}
            />
            <div className="flex flex-wrap gap-1.5 mb-2">
              {CITY_CHIPS.map((chip) => {
                const active = residenceCity === chip;
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setResidenceCity(chip)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                      active
                        ? "bg-[#06BCA3] text-zinc-950 font-bold shadow-xs"
                        : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                    }`}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>

            {residenceCity === "Otra ciudad" && (
              <input
                type="text"
                value={customCity}
                onChange={(e) => setCustomCity(e.target.value)}
                placeholder="Indica tu provincia o distrito"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[#06BCA3] focus:bg-white"
                required
              />
            )}
          </div>

          {step1Error && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-center gap-2">
              <AlertTriangle size={14} className="text-red-600 flex-shrink-0" />
              <span>{step1Error}</span>
            </div>
          )}

          {/* Botón Siguiente Paso con color #06BCA3 */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleNextStep}
              className="w-full py-3.5 px-5 rounded-xl font-extrabold text-sm uppercase tracking-wide text-zinc-950 bg-gradient-to-r from-[#06BCA3] to-[#049480] hover:from-[#05a992] hover:to-[#038371] active:scale-98 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>CONTINUAR REGISTRO</span>
              <ChevronRight size={16} />
            </button>

            <p className="text-[11px] text-zinc-500 text-center mt-2.5 leading-snug">
              Tu registro no confirma automáticamente tu participación. Los perfiles serán evaluados previamente.
            </p>
          </div>
        </div>
      )}

      {/* ── PASO 2: PERFIL PROFESIONAL, EXPERIENCIA, CV Y AUTORIZACIÓN ── */}
      {currentStep === 2 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Hidden inputs from Step 1 */}
          <input type="hidden" name="fullName" value={fullName} />
          <input type="hidden" name="dni" value={dni} />
          <input type="hidden" name="phone" value={phone} />
          <input type="hidden" name="email" value={email} />
          <input
            type="hidden"
            name="residenceCity"
            value={residenceCity === "Otra ciudad" ? customCity : residenceCity}
          />

          {/* ¿Cuál es tu perfil? */}
          <div>
            <label className="text-xs font-bold text-zinc-800 block mb-1.5">
              ¿Cuál es tu perfil? <span className="text-red-500">*</span>
            </label>
            <input type="hidden" name="profile" value={selectedProfile} />
            <div className="grid grid-cols-2 gap-1.5">
              {PROFILE_OPTIONS.map((opt) => {
                const active = selectedProfile === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSelectedProfile(opt)}
                    className={`py-2 px-2.5 rounded-lg border text-xs font-bold text-left transition-all flex items-center justify-between ${
                      active
                        ? "border-[#06BCA3] bg-teal-50/70 text-teal-950 shadow-2xs"
                        : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    <span>{opt}</span>
                    {active && <Check size={13} className="text-[#048674]" />}
                  </button>
                );
              })}
            </div>
            {selectedProfile === "Otro" && (
              <input
                type="text"
                name="customProfile"
                value={customProfile}
                onChange={(e) => setCustomProfile(e.target.value)}
                placeholder="Especifique su perfil..."
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5 text-xs text-zinc-900 mt-1.5"
                required
              />
            )}
          </div>

          {/* Años de experiencia */}
          <div>
            <label className="text-xs font-bold text-zinc-800 block mb-1">
              Años de experiencia <span className="text-red-500">*</span>
            </label>
            <input type="hidden" name="experienceYears" value={selectedExpYears} />
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1">
              {EXPERIENCE_YEARS_OPTIONS.map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setSelectedExpYears(yr)}
                  className={`py-1.5 px-1 rounded-md text-[11px] font-bold text-center transition-all ${
                    selectedExpYears === yr
                      ? "bg-[#06BCA3] text-zinc-950"
                      : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>

          {/* Equipos operados */}
          <div>
            <label className="text-xs font-bold text-zinc-800 block mb-1">
              Equipos que has operado <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {EQUIPMENT_OPTIONS.map((eq) => {
                const checked = selectedEquipments.includes(eq);
                return (
                  <label
                    key={eq}
                    onClick={() => toggleEquipment(eq)}
                    className={`flex items-center justify-between p-2 rounded-lg border text-xs font-semibold cursor-pointer select-none transition-all ${
                      checked
                        ? "border-[#06BCA3] bg-teal-50/60 text-teal-950"
                        : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    <span>{eq}</span>
                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                      checked ? "bg-[#06BCA3] border-[#06BCA3] text-zinc-950" : "border-zinc-300 bg-white"
                    }`}>
                      {checked && <Check size={10} className="stroke-[3]" />}
                    </div>
                    {checked && <input type="hidden" name="equipmentExperience" value={eq} />}
                  </label>
                );
              })}
            </div>
            {selectedEquipments.includes("Otro") && (
              <input
                type="text"
                name="customEquipment"
                value={customEquipment}
                onChange={(e) => setCustomEquipment(e.target.value)}
                placeholder="Otros equipos..."
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5 text-xs text-zinc-900 mt-1.5"
              />
            )}
          </div>

          {/* Sectores */}
          <div>
            <label className="text-xs font-bold text-zinc-800 block mb-1">
              Sectores en los que has trabajado <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-1">
              {SECTOR_OPTIONS.map((sec) => {
                const checked = selectedSectors.includes(sec);
                return (
                  <label
                    key={sec}
                    onClick={() => toggleSector(sec)}
                    className={`flex items-center justify-between p-1.5 rounded-md border text-[11px] font-semibold cursor-pointer select-none transition-all ${
                      checked
                        ? "border-[#06BCA3] bg-[#06BCA3] text-zinc-950 font-bold"
                        : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    <span className="truncate">{sec}</span>
                    {checked && <input type="hidden" name="sectors" value={sec} />}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Minería & PALFINGER Sí/No */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-200">
              <p className="text-[11px] font-bold text-zinc-800 mb-1 leading-tight">
                ¿Izaje en minería?
              </p>
              <input type="hidden" name="miningExperience" value={miningExp} />
              <div className="flex gap-1.5">
                {(["Sí", "No"] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setMiningExp(opt)}
                    className={`flex-1 py-1 rounded text-xs font-bold transition-all ${
                      miningExp === opt
                        ? "bg-[#06BCA3] text-zinc-950"
                        : "bg-white border border-zinc-200 text-zinc-700"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-200">
              <p className="text-[11px] font-bold text-zinc-800 mb-1 leading-tight">
                ¿Equipos PALFINGER?
              </p>
              <input type="hidden" name="palfingerExperience" value={palfingerExp} />
              <div className="flex gap-1.5">
                {(["Sí", "No"] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setPalfingerExp(opt)}
                    className={`flex-1 py-1 rounded text-xs font-bold transition-all ${
                      palfingerExp === opt
                        ? "bg-[#06BCA3] text-zinc-950"
                        : "bg-white border border-zinc-200 text-zinc-700"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Franja / Categoría */}
          <div>
            <label className="text-xs font-bold text-zinc-800 block mb-1">
              Franja / Categoría de Operador <span className="text-red-500">*</span>
            </label>
            <input type="hidden" name="categoryBadge" value={selectedCategory} />
            <div className="grid grid-cols-3 gap-1.5">
              {CATEGORY_OPTIONS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`py-1.5 px-2 rounded-lg border text-xs font-bold text-center transition-all ${
                    selectedCategory === cat
                      ? cat === "Amarilla"
                        ? "border-amber-400 bg-amber-100 text-amber-950 font-black"
                        : cat === "Roja"
                        ? "border-red-400 bg-red-100 text-red-950 font-black"
                        : "border-[#06BCA3] bg-[#06BCA3] text-zinc-950 font-black"
                      : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {selectedCategory === "Otra" && (
              <input
                type="text"
                name="customCategoryBadge"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Especifica categoría..."
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5 text-xs text-zinc-900 mt-1.5"
              />
            )}
          </div>

          {/* Sube tu CV (Opcional) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-zinc-800">
                Sube tu CV <span className="text-zinc-400 font-normal">(Opcional)</span>
              </label>
              <span className="text-[10px] text-zinc-500">PDF o Word</span>
            </div>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-zinc-300 hover:border-[#06BCA3] bg-zinc-50/70 rounded-xl p-2.5 text-center cursor-pointer transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                name="cvFile"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              {cvFile ? (
                <div className="flex items-center justify-between text-left">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileText size={16} className="text-[#048674] flex-shrink-0" />
                    <span className="text-xs font-bold text-zinc-900 truncate">{cvFile.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCvFile();
                    }}
                    className="text-zinc-400 hover:text-red-600 p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-600">
                  <UploadCloud size={16} className="text-[#048674]" />
                  <span>Adjuntar CV actualizado (PDF / Word)</span>
                </div>
              )}
            </div>
          </div>

          {/* Disponibilidad */}
          <div>
            <label className="text-xs font-bold text-zinc-800 block mb-1">
              ¿Interesado en futuras oportunidades laborales? <span className="text-red-500">*</span>
            </label>
            <input type="hidden" name="futureOpportunities" value={selectedFutureOpportunities} />
            <div className="grid grid-cols-3 gap-1">
              {AVAILABILITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedFutureOpportunities(opt.value)}
                  className={`py-1.5 px-1 rounded-md text-[10px] font-bold text-center leading-tight transition-all ${
                    selectedFutureOpportunities === opt.value
                      ? "bg-[#06BCA3] text-zinc-950 font-black"
                      : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                  }`}
                >
                  {opt.value}
                </button>
              ))}
            </div>
          </div>

          {/* Autorización */}
          <div className="rounded-lg bg-zinc-50 border border-zinc-200 p-2.5">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-[#06BCA3] focus:ring-[#06BCA3] accent-[#06BCA3] cursor-pointer"
                required
              />
              <span className="text-[11px] text-zinc-600 leading-tight select-none">
                Autorizo el uso de los datos proporcionados para fines de la capacitación y futuras oportunidades profesionales de Ramírez Group / TBM Maquinarias.
              </span>
            </label>
          </div>

          {state.message && !state.success && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertTriangle size={14} className="text-red-600 flex-shrink-0" />
              <span>{state.message}</span>
            </div>
          )}

          {/* Botones de Acción */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="py-3 px-3 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-700 text-xs font-bold transition-all flex items-center justify-center gap-1"
            >
              <ArrowLeft size={14} />
              <span>Atrás</span>
            </button>

            <button
              type="submit"
              disabled={pending}
              className="flex-1 py-3.5 px-4 rounded-xl font-black text-sm uppercase tracking-wide text-zinc-950 bg-gradient-to-r from-[#06BCA3] to-[#049480] hover:from-[#05a992] hover:to-[#038371] active:scale-98 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {pending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <span>REGISTRARME &gt;</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[10px] text-zinc-400 text-center leading-tight">
            Tu registro no confirma automáticamente tu participación. Los perfiles serán evaluados previamente.
          </p>
        </div>
      )}
    </form>
  );
}
