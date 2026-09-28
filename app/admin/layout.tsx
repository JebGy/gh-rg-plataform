import Link from "next/link";
import { Users, Briefcase } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--color-brand-dark)" }}>
      {/* Nav */}
      <nav
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <span className="text-micro-cap" style={{ color: "#fff", fontWeight: 600, fontSize: "10px" }}>IZ</span>
          </div>
          <div>
            <p className="text-caption" style={{ color: "rgba(255,255,255,0.9)", fontWeight: 400 }}>
              Panel de Reclutamiento
            </p>
            <p className="text-micro" style={{ color: "var(--color-ink-mute)" }}>
              Izaje · Antamina · Huaraz
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-caption transition-opacity hover:opacity-80"
            style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px" }}
          >
            <Users size={14} aria-hidden="true" />
            Postulantes
          </Link>
          <Link
            href="/admin/puestos"
            className="flex items-center gap-1.5 text-caption transition-opacity hover:opacity-80"
            style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px" }}
          >
            <Briefcase size={14} aria-hidden="true" />
            Puestos
          </Link>
          <Link
            href="/"
            target="_blank"
            className="btn-primary py-1.5 px-4 text-caption"
            style={{ fontSize: "13px" }}
          >
            Ver formulario
          </Link>
        </div>
      </nav>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
