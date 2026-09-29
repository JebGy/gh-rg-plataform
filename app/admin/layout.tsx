import Link from "next/link";
import { Users, Briefcase, ExternalLink, LogOut, ShieldCheck } from "lucide-react";
import { isAuthenticated } from "@/lib/auth";
import AdminLoginForm from "@/components/AdminLoginForm";
import { logoutAdmin } from "@/lib/actions/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAuth = await isAuthenticated();

  // Si no está autenticado como root, muestra ÚNICAMENTE el login
  if (!isAuth) {
    return <AdminLoginForm />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-100 text-zinc-900">
      {/* Header Corporativo Ramirez Group para root */}
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white shadow-2xs">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-3">
              <img
                src="https://ramirezgroup.com.pe/wp-content/uploads/2023/06/logo-RAMIREZ-GROUP.png"
                alt="Ramirez Group"
                className="h-8 w-auto object-contain"
              />
              <div className="border-l border-zinc-200 pl-3">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                    Gestión de Talento Humano
                  </p>
                  <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.2 rounded bg-zinc-900 text-white">
                    <ShieldCheck size={10} aria-hidden="true" />
                    root
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500">
                  Campaña Izaje Antamina · Huaraz
                </p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-zinc-700 hover:text-zinc-950 px-3 py-2 rounded-md hover:bg-zinc-100 transition-colors"
            >
              <Users size={16} aria-hidden="true" />
              <span>Base de Candidatos</span>
            </Link>
            <Link
              href="/admin/puestos"
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-zinc-700 hover:text-zinc-950 px-3 py-2 rounded-md hover:bg-zinc-100 transition-colors"
            >
              <Briefcase size={16} aria-hidden="true" />
              <span>Puestos</span>
            </Link>
            <Link
              href="/"
              target="_blank"
              className="btn-secondary text-xs sm:text-sm py-1.5 px-3 flex items-center gap-1.5"
            >
              <span>Ver Convocatoria</span>
              <ExternalLink size={13} aria-hidden="true" />
            </Link>

            {/* Botón Cerrar Sesión */}
            <form action={logoutAdmin}>
              <button
                type="submit"
                className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors flex items-center gap-1 font-semibold"
                title="Cerrar sesión root"
              >
                <LogOut size={15} aria-hidden="true" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
