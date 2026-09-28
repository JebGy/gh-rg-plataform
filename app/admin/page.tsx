import { getDb } from "@/lib/prisma";
import AdminCandidatesView from "@/components/AdminCandidatesView";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ positionId?: string; status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const { positionId, status, q } = params;

  const db = await getDb();

  const [rawPositions, rawCandidates] = await Promise.all([
    db.orm.public.Position.all(),
    db.orm.public.Candidate.all(),
  ]);

  const positionsMap = new Map(rawPositions.map((p) => [p.id, p.title]));

  // Build candidate list with positionTitle
  let candidates = rawCandidates.map((c) => ({
    id: c.id,
    fullName: c.fullName,
    dni: c.dni,
    phone: c.phone,
    email: c.email,
    licenseNumber: c.licenseNumber,
    residenceCity: c.residenceCity,
    availability: c.availability,
    status: c.status,
    recruiterNotes: c.recruiterNotes,
    positionId: c.positionId,
    positionTitle: positionsMap.get(c.positionId) || "Sin puesto",
    createdAt: String(c.createdAt),
    updatedAt: String(c.updatedAt),
  }));

  // Filter in memory for maximum speed & search flexibility
  if (positionId) {
    const pId = Number(positionId);
    candidates = candidates.filter((c) => c.positionId === pId);
  }

  if (status) {
    candidates = candidates.filter((c) => c.status === status);
  }

  if (q && q.trim()) {
    const query = q.toLowerCase().trim();
    candidates = candidates.filter(
      (c) =>
        c.fullName.toLowerCase().includes(query) ||
        c.dni.includes(query) ||
        c.phone.includes(query) ||
        (c.licenseNumber && c.licenseNumber.toLowerCase().includes(query)) ||
        c.residenceCity.toLowerCase().includes(query)
    );
  }

  // Sort descending by date
  candidates.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Metrics
  const total = rawCandidates.length;
  const inmediata = rawCandidates.filter((c) => c.availability === "Inmediata").length;
  const huaraz = rawCandidates.filter((c) =>
    c.residenceCity.toLowerCase().includes("huaraz")
  ).length;

  const byPosition: Record<number, number> = {};
  for (const c of rawCandidates) {
    byPosition[c.positionId] = (byPosition[c.positionId] || 0) + 1;
  }

  const positionsList = rawPositions
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((p) => ({ id: p.id, title: p.title }));

  return (
    <AdminCandidatesView
      candidates={candidates}
      positions={positionsList}
      metrics={{ total, inmediata, huaraz, byPosition }}
      filters={{ positionId, status, q }}
    />
  );
}
