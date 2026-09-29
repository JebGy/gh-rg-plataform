"use client";

import { useActionState } from "react";
import { loginAdmin, type LoginState } from "@/lib/actions/auth";
import { Lock, ShieldAlert, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

const initialState: LoginState = {};

export default function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(loginAdmin, initialState);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-zinc-100 p-6">
      <div className="w-full max-w-md">
        {/* Card de Login */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-8 shadow-xs">
          {/* Logo y Encabezado */}
          <div className="text-center mb-6">
            <img
              src="https://ramirezgroup.com.pe/wp-content/uploads/2023/06/logo-RAMIREZ-GROUP.png"
              alt="Ramirez Group"
              className="h-9 w-auto mx-auto mb-4 object-contain"
            />
            <span className="badge-tag mb-1.5 inline-block">
              Área Restringida
            </span>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900">
              Acceso Administrativo
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Solo el usuario <strong>root</strong> tiene autorización para acceder al panel de Talento Humano y gestión de candidatos.
            </p>
          </div>

          {/* Formulario */}
          <form action={formAction} className="space-y-4">
            <div>
              <label htmlFor="username" className="form-label">
                Usuario
              </label>
              <input
                id="username"
                name="username"
                type="text"
                defaultValue="root"
                placeholder="root"
                required
                className="form-input"
                autoComplete="username"
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="form-input"
                autoComplete="current-password"
              />
            </div>

            {state.error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                <ShieldAlert size={16} className="text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>{state.error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={pending}
              className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2 mt-2"
            >
              {pending ? (
                <>
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                  <span>Verificando credenciales...</span>
                </>
              ) : (
                <>
                  <Lock size={15} aria-hidden="true" />
                  <span>Iniciar Sesión como root</span>
                </>
              )}
            </button>
          </form>

          {/* Volver */}
          <div className="mt-6 pt-4 border-t border-zinc-100 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              <ArrowLeft size={13} aria-hidden="true" />
              <span>Volver a la convocatoria pública</span>
            </Link>
          </div>
        </div>

        <p className="text-center text-[11px] text-zinc-400 mt-6">
          © {new Date().getFullYear()} Ramirez Group. Sistema de Selección Izaje Antamina.
        </p>
      </div>
    </div>
  );
}
