import { getDb } from "@/lib/prisma";
import PositionManager from "@/components/PositionManager";

export const dynamic = "force-dynamic";

export default async function PuestosPage() {
  const db = await getDb();

  const [rawPositions, rawCandidates] = await Promise.all([
    db.orm.public.Position.all(),
    db.orm.public.Candidate.all(),
  ]);

  const candidateCountMap: Record<number, number> = {};
  for (const c of rawCandidates) {
    candidateCountMap[c.positionId] = (candidateCountMap[c.positionId] || 0) + 1;
  }

  const positions = rawPositions
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      department: p.department,
      location: p.location,
      description: p.description,
      isActive: p.isActive,
      sortOrder: p.sortOrder,
      candidateCount: candidateCountMap[p.id] || 0,
    }));

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-heading-lg" style={{ color: "#fff" }}>Gestión de Puestos y Convocatorias</h1>
        <p className="text-body-md mt-1" style={{ color: "var(--color-ink-mute)" }}>
          Crea nuevos puestos para futuras campañas o activa/desactiva los existentes. Los inactivos se ocultan de inmediato en el formulario público.
        </p>
      </div>
      <PositionManager positions={positions} />
    </div>
  );
}
