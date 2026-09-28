"use client";

import { useActionState } from "react";
import { useRef, useState } from "react";
import { registerCandidate, type RegisterState } from "@/lib/actions/register";
import { Loader2, CheckCircle2 } from "lucide-react";

type Position = { id: number; title: string; department: string; location: string };

const RESIDENCE_CHIPS = [
  "Huaraz", "Independencia", "Recuay", "Carhuaz", "San Marcos", "Otra zona"
];

const AVAILABILITY_OPTIONS = ["Inmediata", "7 días", "15 días", "30 días"];

const initialState: RegisterState = {};

export default function CandidateForm({ positions }: { positions: Position[] }) {
  const [state, formAction, pending] = useActionState(registerCandidate, initialState);
  const [selectedPosition, setSelectedPosition] = useState<number | "">("");
  const [selectedResidence, setSelectedResidence] = useState<string>("");
  const [customResidence, setCustomResidence] = useState<string>("");
  const residenceInputRef = useRef<HTMLInputElement>(null);

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
    <form action={formAction} className="flex flex-col gap-5">
      {/* — Puesto — */}
      <div>
        <label className="text-caption block mb-2" style={{ color: "var(--color-ink-mute)" }}>
          Puesto al que postulas *
        </label>
        <input type="hidden" name="positionId" value={selectedPosition} />
        <div className="flex flex-wrap gap-2">
          {positions.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedPosition(p.id)}
              className="text-button-sm px-4 py-2 rounded-full border transition-all"
              style={{
                backgroundColor: selectedPosition === p.id ? "var(--color-primary)" : "var(--color-canvas)",
                color: selectedPosition === p.id ? "var(--color-on-primary)" : "var(--color-ink-secondary)",
                borderColor: selectedPosition === p.id ? "var(--color-primary)" : "var(--color-hairline)",
                fontWeight: selectedPosition === p.id ? 400 : 300,
                fontSize: "14px",
              }}
            >
              {p.title}
            </button>
          ))}
        </div>
        {state.errors?.positionId && (
          <p className="text-micro mt-1" style={{ color: "var(--color-ruby)" }}>
            {state.errors.positionId[0]}
          </p>
        )}
      </div>

      {/* — Nombre — */}
      <div>
        <label htmlFor="fullName" className="text-caption block mb-1" style={{ color: "var(--color-ink-mute)" }}>
          Nombre completo *
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          placeholder="Ej. Juan Carlos Ramírez Morales"
          className="input-field"
          autoComplete="name"
          required
        />
        {state.errors?.fullName && (
          <p className="text-micro mt-1" style={{ color: "var(--color-ruby)" }}>
            {state.errors.fullName[0]}
          </p>
        )}
      </div>

      {/* — DNI + Teléfono row — */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="dni" className="text-caption block mb-1" style={{ color: "var(--color-ink-mute)" }}>
            DNI *
          </label>
          <input
            id="dni"
            name="dni"
            type="text"
            inputMode="numeric"
            maxLength={8}
            placeholder="12345678"
            className="input-field tnum"
            autoComplete="off"
            required
          />
          {state.errors?.dni && (
            <p className="text-micro mt-1" style={{ color: "var(--color-ruby)" }}>
              {state.errors.dni[0]}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="phone" className="text-caption block mb-1" style={{ color: "var(--color-ink-mute)" }}>
            Celular / WhatsApp *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            maxLength={9}
            placeholder="9XXXXXXXX"
            className="input-field tnum"
            autoComplete="tel"
            required
          />
          {state.errors?.phone && (
            <p className="text-micro mt-1" style={{ color: "var(--color-ruby)" }}>
              {state.errors.phone[0]}
            </p>
          )}
        </div>
      </div>

      {/* — Número de Licencia — */}
      <div>
        <label htmlFor="licenseNumber" className="text-caption block mb-1" style={{ color: "var(--color-ink-mute)" }}>
          N° de Licencia / Brevete / Certificación de Operador
        </label>
        <input
          id="licenseNumber"
          name="licenseNumber"
          type="text"
          placeholder="Ej. Q12345678 o Cert. Rigger N° 4510"
          className="input-field tnum"
          autoComplete="off"
        />
      </div>

      {/* — Residencia chips — */}
      <div>
        <label className="text-caption block mb-2" style={{ color: "var(--color-ink-mute)" }}>
          Lugar de residencia (Huaraz y alrededores preferente) *
        </label>
        <input type="hidden" name="residenceCity" value={residenceValue} />
        <div className="flex flex-wrap gap-2 mb-2">
          {RESIDENCE_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => handleResidenceChip(chip)}
              className="text-micro px-3 py-1.5 rounded-full border transition-all"
              style={{
                backgroundColor: selectedResidence === chip ? "var(--color-primary-bg-hover)" : "var(--color-canvas)",
                color: selectedResidence === chip ? "var(--color-primary-deep)" : "var(--color-ink-mute)",
                borderColor: selectedResidence === chip ? "var(--color-primary)" : "var(--color-hairline)",
                fontWeight: selectedResidence === chip ? 400 : 300,
                fontSize: "12px",
              }}
            >
              {chip}
            </button>
          ))}
        </div>
        {selectedResidence === "Otra zona" && (
          <input
            ref={residenceInputRef}
            type="text"
            value={customResidence}
            onChange={(e) => setCustomResidence(e.target.value)}
            placeholder="Escribe tu ciudad, distrito o localidad"
            className="input-field mt-1"
          />
        )}
        {state.errors?.residenceCity && (
          <p className="text-micro mt-1" style={{ color: "var(--color-ruby)" }}>
            {state.errors.residenceCity[0]}
          </p>
        )}
      </div>

      {/* — Disponibilidad — */}
      <div>
        <label className="text-caption block mb-2" style={{ color: "var(--color-ink-mute)" }}>
          Disponibilidad para incorporarse *
        </label>
        <div className="flex flex-wrap gap-2">
          {AVAILABILITY_OPTIONS.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border cursor-pointer transition-all text-micro"
              style={{
                borderColor: "var(--color-hairline)",
                color: "var(--color-ink-secondary)",
                fontSize: "13px",
              }}
            >
              <input
                type="radio"
                name="availability"
                value={opt}
                required
                className="accent-indigo-600"
              />
              {opt}
            </label>
          ))}
        </div>
        {state.errors?.availability && (
          <p className="text-micro mt-1" style={{ color: "var(--color-ruby)" }}>
            {state.errors.availability[0]}
          </p>
        )}
      </div>

      {/* — Email opcional — */}
      <div>
        <label htmlFor="email" className="text-caption block mb-1" style={{ color: "var(--color-ink-mute)" }}>
          Correo electrónico (opcional)
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="tu.correo@ejemplo.com"
          className="input-field"
          autoComplete="email"
        />
      </div>

      {/* — Error general — */}
      {state.message && (
        <div
          className="p-3 rounded-lg text-body-md"
          style={{ backgroundColor: "var(--color-ruby)", color: "#fff" }}
        >
          {state.message}
        </div>
      )}

      {/* — Submit — */}
      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2"
      >
        {pending ? (
          <>
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            Registrando postulación…
          </>
        ) : (
          <>
            <CheckCircle2 size={16} aria-hidden="true" />
            Enviar mi postulación
          </>
        )}
      </button>
    </form>
  );
}
