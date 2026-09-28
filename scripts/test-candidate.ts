import "dotenv/config";
import { db } from "../prisma/db.js";
import crypto from "crypto";

async function main() {
  await db.connect({ url: process.env.DATABASE_URL! });

  const testCandidate = {
    id: crypto.randomUUID(),
    positionId: 4, // Rigger
    fullName: "Juan Perez Rigger Test",
    dni: "71234567",
    phone: "987654321",
    email: "juan.rigger@example.com",
    licenseNumber: "CERT-RIG-8891",
    residenceCity: "Huaraz",
    availability: "Inmediata",
    status: "nuevo",
    recruiterNotes: "Candidato de prueba",
  };

  const created = await db.orm.public.Candidate.create(testCandidate);
  console.log("Candidate created:", created);

  const candidates = await db.orm.public.Candidate.all();
  console.log("All candidates:", candidates);

  // Clean up test candidate
  await db.orm.public.Candidate.where({ id: created.id }).delete();
  console.log("Cleaned up test candidate.");
}

main().catch(console.error).finally(async () => {
  try { await db.close(); } catch {}
  process.exit(0);
});
