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
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl border border-zinc-200">
        <span className="badge-tag mb-1">
          Catálogo Operativo
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Gestión de Cargos y Convocatorias
        </h1>
        <p className="text-sm text-zinc-600 mt-0.5">
          Active o desactive puestos para la campaña en Huaraz, o cree nuevos perfiles según las necesidades del servicio de Izaje en Antamina.
        </p>
      </div>

      <PositionManager positions={positions} />
    </div>
  );
}
