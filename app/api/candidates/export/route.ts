import { NextResponse } from "next/server";
import { getDb } from "@/lib/prisma";
import * as XLSX from "xlsx";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = await getDb();
  const [candidates, positions] = await Promise.all([
    db.orm.public.Candidate.all(),
    db.orm.public.Position.all(),
  ]);

  const positionsMap = new Map(positions.map((p) => [p.id, p.title]));

  const rows = candidates.map((c) => ({
    Puesto: positionsMap.get(c.positionId) || "Sin puesto",
    "Nombre Completo": c.fullName,
    DNI: c.dni,
    Celular: c.phone,
    Email: c.email || "",
    "N° Licencia / Brevete": c.licenseNumber || "",
    "Lugar de Residencia": c.residenceCity,
    Disponibilidad: c.availability,
    Estado: c.status,
    "Notas Reclutador": c.recruiterNotes || "",
    "Fecha de Registro": new Date(c.createdAt).toLocaleString("es-PE"),
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Candidatos");
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="candidatos-izaje-antamina-${Date.now()}.xlsx"`,
    },
  });
}
