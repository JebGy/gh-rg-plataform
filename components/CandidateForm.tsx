"use client";

import { useActionState, useRef, useState, useEffect } from "react";
import { registerCandidate, type RegisterState } from "@/lib/actions/register";
import { Loader2, CheckCircle2, ChevronRight } from "lucide-react";

type Position = { id: number; title: string; department: string; location: string };

const RESIDENCE_CHIPS = [
  "Huaraz", "Independencia", "Recuay", "Carhuaz", "San Marcos", "Otra zona"
];

const AVAILABILITY_OPTIONS = ["Inmediata", "7 días", "15 días", "30 días"];

const initialState: RegisterState = {};

export default function CandidateForm({
  positions,
  selectedPositionId,
}: {
  positions: Position[];
  selectedPositionId?: number;
}) {
  const [state, formAction, pending] = useActionState(registerCandidate, initialState);
  const [selectedPosition, setSelectedPosition] = useState<number | "">(selectedPositionId || "");
  const [selectedResidence, setSelectedResidence] = useState<string>("");
  const [customResidence, setCustomResidence] = useState<string>("");
  const residenceInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedPositionId) {
      setSelectedPosition(selectedPositionId);
    }
  }, [selectedPositionId]);

  function handleResidenceChip(chip: string) {
    if (chip === "Otra zona") {
      setSelectedResidence("Otra zona");
      setTimeout(() => residenceInputRef.current?.focus(), 50);
    } else {
      setSelectedResidence(chip);
      setCustomResidence("");
    }
  }

  const residenceValue = selectedResidence === "Otra zona" ? customResidence : selectedResidence;

  return (
    <form action={formAction} className="space-y-6">
      {/* — Puesto Seleccionado — */}
      <div>
        <label className="form-label">
          Puesto al que postula <span className="text-red-500">*</span>
        </label>
        <input type="hidden" name="positionId" value={selectedPosition} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {positions.map((p) => {
            const isSelected = selectedPosition === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPosition(p.id)}
                className={`text-left p-3.5 rounded-lg border text-sm font-medium transition-all flex items-center justify-between ${
                  isSelected
                    ? "border-[var(--brand-primary)] bg-[rgba(43,160,122,0.08)] text-[var(--brand-primary)] shadow-sm"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
                }`}
              >
                <div>
                  <span className="block font-semibold">{p.title}</span>
                  <span className="block text-xs text-zinc-500 mt-0.5">{p.location}</span>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected
                      ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]"
                      : "border-zinc-300 bg-white"
                  }`}
                >
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>
        {state.errors?.positionId && (
          <p className="text-xs font-medium text-red-600 mt-1.5">
            {state.errors.positionId[0]}
          </p>
        )}
      </div>

      {/* — Nombre Completo — */}
      <div>
        <label htmlFor="fullName" className="form-label">
          Nombre completo del postulante <span className="text-red-500">*</span>
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          placeholder="Ej. Juan Carlos Ramírez Morales"
          className="form-input"
          autoComplete="name"
          required
        />
        {state.errors?.fullName && (
          <p className="text-xs font-medium text-red-600 mt-1.5">
            {state.errors.fullName[0]}
          </p>
        )}
      </div>

      {/* — DNI + Celular en 2 Columnas — */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="dni" className="form-label">
            Número de DNI <span className="text-red-500">*</span>
          </label>
          <input
            id="dni"
            name="dni"
            type="text"
            inputMode="numeric"
            maxLength={8}
            placeholder="8 dígitos numéricos"
            className="form-input text-tabular"
            autoComplete="off"
            required
          />
          {state.errors?.dni && (
            <p className="text-xs font-medium text-red-600 mt-1.5">
              {state.errors.dni[0]}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="phone" className="form-label">
            Celular / WhatsApp de contacto <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            maxLength={9}
            placeholder="9XXXXXXXX"
            className="form-input text-tabular"
            autoComplete="tel"
            required
          />
          {state.errors?.phone && (
            <p className="text-xs font-medium text-red-600 mt-1.5">
              {state.errors.phone[0]}
            </p>
          )}
        </div>
      </div>

      {/* — Número de Licencia / Brevete / Certificación — */}
      <div>
        <label htmlFor="licenseNumber" className="form-label">
          N° de Licencia de Conducir / Brevete / Certificación de Operador
        </label>
        <input
          id="licenseNumber"
          name="licenseNumber"
          type="text"
          placeholder="Ej. Q12345678 (Cat. A-IIIb o superior) o Certificado Rigger"
          className="form-input text-tabular"
          autoComplete="off"
        />
        <p className="text-xs text-zinc-500 mt-1">
          Indique su categoría de brevete o acreditación técnica vigente si postula a Camión Grúa o Rigger.
        </p>
      </div>

      {/* — Lugar de Residencia con Chips — */}
      <div>
        <label className="form-label">
          Lugar de residencia habitual <span className="text-red-500">*</span>
        </label>
        <input type="hidden" name="residenceCity" value={residenceValue} />
        <div className="flex flex-wrap gap-2 mb-2.5">
          {RESIDENCE_CHIPS.map((chip) => {
            const isSelected = selectedResidence === chip;
            return (
              <button
                key={chip}
                type="button"
                onClick={() => handleResidenceChip(chip)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>
        {selectedResidence === "Otra zona" && (
          <input
            ref={residenceInputRef}
            type="text"
            value={customResidence}
            onChange={(e) => setCustomResidence(e.target.value)}
            placeholder="Especifique su distrito, provincia o localidad"
            className="form-input mt-2"
            required
          />
        )}
        {state.errors?.residenceCity && (
          <p className="text-xs font-medium text-red-600 mt-1.5">
            {state.errors.residenceCity[0]}
          </p>
        )}
      </div>

      {/* — Disponibilidad — */}
      <div>
        <label className="form-label">
          Disponibilidad para incorporación <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {AVAILABILITY_OPTIONS.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 p-2.5 rounded-lg border border-zinc-200 bg-white text-xs font-medium text-zinc-700 cursor-pointer hover:bg-zinc-50 transition-colors"
            >
              <input
                type="radio"
                name="availability"
                value={opt}
                required
                className="text-[var(--brand-primary)] focus:ring-[var(--brand-primary)] accent-[#2ba07a]"
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
        {state.errors?.availability && (
          <p className="text-xs font-medium text-red-600 mt-1.5">
            {state.errors.availability[0]}
          </p>
        )}
      </div>

      {/* — Correo Electrónico Opcional — */}
      <div>
        <label htmlFor="email" className="form-label">
          Correo electrónico (opcional)
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="ejemplo@correo.com"
          className="form-input"
          autoComplete="email"
        />
      </div>

      {/* — Mensaje de Error General — */}
      {state.message && (
        <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {state.message}
        </div>
      )}

      {/* — Botón de Envío Primario — */}
      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2"
      >
        {pending ? (
          <>
            <Loader2 size={18} className="animate-spin" aria-hidden="true" />
            <span>Procesando registro...</span>
          </>
        ) : (
          <>
            <CheckCircle2 size={18} aria-hidden="true" />
            <span>Registrar Postulación</span>
          </>
        )}
      </button>

      <p className="text-xs text-center text-zinc-500 leading-normal">
        Al enviar su postulación, autoriza a Ramirez Group al tratamiento de sus datos para fines del proceso de selección del servicio de Izaje en Mina Antamina.
      </p>
    </form>
  );
}
