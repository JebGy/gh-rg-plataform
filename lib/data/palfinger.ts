import { getDb } from "@/lib/prisma";
import os from "os";
import path from "path";
import fs from "fs/promises";

export interface PalfingerRegistration {
  id: string;
  fullName: string;
  dni: string;
  phone: string;
  email?: string | null;
  residenceCity: string;
  profile: string; // Operador de grúa | Rigger | Operador / Rigger | Otro
  experienceYears: string; // Menos de 1 año | 1-3 años | 3-5 años | 5-10 años | Más de 10 años
  equipmentExperience: string[]; // Camión grúa, Grúa articulada, Grúa telescópica, Otro
  sectors: string[]; // Minería, Construcción, Industria, Puertos, Energía, Otros
  miningExperience: "Sí" | "No";
  palfingerExperience: "Sí" | "No";
  categoryBadge: string; // Amarilla | Roja | Otra
  cvFileName?: string | null;
  cvFilePath?: string | null;
  futureOpportunities: "Sí" | "No" | "Me gustaría recibir información";
  termsAccepted: boolean;
  status: "nuevo" | "contactado" | "evaluando" | "confirmado" | "descartado";
  recruiterNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

// In-memory cache for fast response and serverless fallback
const memoryCache = new Map<string, PalfingerRegistration>();

// Safe temporary cache file in writable system tmpdir (never /var/task)
const TMP_DATA_FILE = path.join(os.tmpdir(), "ghapp-palfinger-cache.json");

async function safeReadTmpFile(): Promise<PalfingerRegistration[]> {
  try {
    const raw = await fs.readFile(TMP_DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function safeWriteTmpFile(list: PalfingerRegistration[]): Promise<void> {
  try {
    await fs.writeFile(TMP_DATA_FILE, JSON.stringify(list), "utf-8");
  } catch {
    // Non-blocking in serverless if disk is restricted
  }
}

function parseCandidateToPalfinger(c: any): PalfingerRegistration {
  let extra: any = {};
  try {
    if (c.recruiterNotes) {
      extra = typeof c.recruiterNotes === "string" ? JSON.parse(c.recruiterNotes) : c.recruiterNotes;
    }
  } catch {
    extra = {};
  }

  const categoryFromLicense = c.licenseNumber?.replace("[PALFINGER]", "").split("|")[0]?.trim();
  const profileFromLicense = c.licenseNumber?.replace("[PALFINGER]", "").split("|")[1]?.trim();

  return {
    id: c.id,
    fullName: c.fullName,
    dni: c.dni,
    phone: c.phone,
    email: c.email || null,
    residenceCity: c.residenceCity,
    profile: extra.profile || profileFromLicense || "Operador de grúa",
    experienceYears: extra.experienceYears || "1-3 años",
    equipmentExperience: Array.isArray(extra.equipmentExperience) ? extra.equipmentExperience : ["Camión grúa"],
    sectors: Array.isArray(extra.sectors) ? extra.sectors : ["Minería"],
    miningExperience: extra.miningExperience === "No" ? "No" : "Sí",
    palfingerExperience: extra.palfingerExperience === "No" ? "No" : "Sí",
    categoryBadge: extra.categoryBadge || categoryFromLicense || "Amarilla",
    cvFileName: extra.cvFileName || null,
    cvFilePath: extra.cvFilePath || null,
    futureOpportunities: extra.futureOpportunities || "Sí",
    termsAccepted: true,
    status: (c.status as PalfingerRegistration["status"]) || "nuevo",
    recruiterNotes: extra.recruiterComment || null,
    createdAt: String(c.createdAt),
    updatedAt: String(c.updatedAt),
  };
}

export async function getPalfingerRegistrations(): Promise<PalfingerRegistration[]> {
  try {
    const db = await getDb();
    const allCandidates = await db.orm.public.Candidate.all();

    const palfingerCandidates = allCandidates.filter((c) => {
      const notes = c.recruiterNotes || "";
      const license = c.licenseNumber || "";
      const avail = c.availability || "";
      return (
        notes.includes('"source":"capacitacion_palfinger"') ||
        license.includes("[PALFINGER]") ||
        avail.includes("PALFINGER")
      );
    });

    const parsed = palfingerCandidates.map(parseCandidateToPalfinger);

    // Sync memory cache
    parsed.forEach((item) => memoryCache.set(item.id, item));
    safeWriteTmpFile(Array.from(memoryCache.values()));

    return parsed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.warn("Could not query DB for Palfinger candidates, using cache fallback:", error);
    if (memoryCache.size > 0) {
      return Array.from(memoryCache.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    const fromTmp = await safeReadTmpFile();
    return fromTmp;
  }
}

export async function savePalfingerRegistration(
  record: PalfingerRegistration
): Promise<PalfingerRegistration> {
  // 1. Guardar en memoria inmediatamente
  memoryCache.set(record.id, record);

  // 2. Persistir en la base de datos PostgreSQL oficial
  try {
    const db = await getDb();
    const allPositions = await db.orm.public.Position.all();
    let posId = allPositions[0]?.id || 1;
    const lowerProfile = record.profile.toLowerCase();
    if (lowerProfile.includes("rigger")) {
      const riggerPos = allPositions.find((p) => p.title.toLowerCase().includes("rigger"));
      if (riggerPos) posId = riggerPos.id;
    } else if (lowerProfile.includes("grúa") || lowerProfile.includes("operador")) {
      const cranePos = allPositions.find(
        (p) => p.title.toLowerCase().includes("grúa") || p.title.toLowerCase().includes("operador")
      );
      if (cranePos) posId = cranePos.id;
    }

    const payloadNotes = JSON.stringify({
      source: "capacitacion_palfinger",
      profile: record.profile,
      experienceYears: record.experienceYears,
      equipmentExperience: record.equipmentExperience,
      sectors: record.sectors,
      miningExperience: record.miningExperience,
      palfingerExperience: record.palfingerExperience,
      categoryBadge: record.categoryBadge,
      cvFileName: record.cvFileName || null,
      cvFilePath: record.cvFilePath || null,
      futureOpportunities: record.futureOpportunities,
      recruiterComment: record.recruiterNotes || null,
    });

    // Check if candidate already exists
    const existing = await db.orm.public.Candidate.where({ id: record.id }).first();

    if (existing) {
      await db.orm.public.Candidate.where({ id: record.id }).update({
        fullName: record.fullName,
        phone: record.phone,
        email: record.email || null,
        residenceCity: record.residenceCity,
        licenseNumber: `[PALFINGER] ${record.categoryBadge} | ${record.profile}`,
        availability: `Capacitación PALFINGER (Futuras Oportunidades: ${record.futureOpportunities})`,
        status: record.status,
        recruiterNotes: payloadNotes,
      });
    } else {
      await db.orm.public.Candidate.create({
        id: record.id,
        positionId: posId,
        fullName: record.fullName,
        dni: record.dni,
        phone: record.phone,
        email: record.email || null,
        licenseNumber: `[PALFINGER] ${record.categoryBadge} | ${record.profile}`,
        residenceCity: record.residenceCity,
        availability: `Capacitación PALFINGER (Futuras Oportunidades: ${record.futureOpportunities})`,
        status: record.status,
        recruiterNotes: payloadNotes,
      });
    }
  } catch (dbErr) {
    console.warn("Notice: DB write encountered issue, cached in memory/tmp:", dbErr);
  }

  // 3. Escribir caché seguro en tmp
  safeWriteTmpFile(Array.from(memoryCache.values()));

  return record;
}

export async function findPalfingerRegistrationByDni(
  dni: string
): Promise<PalfingerRegistration | null> {
  const cleanDni = dni.trim();

  // 1. Check DB first
  try {
    const db = await getDb();
    const candidate = await db.orm.public.Candidate.where({ dni: cleanDni }).first();
    if (candidate) {
      const notes = candidate.recruiterNotes || "";
      const license = candidate.licenseNumber || "";
      const avail = candidate.availability || "";
      if (
        notes.includes('"source":"capacitacion_palfinger"') ||
        license.includes("[PALFINGER]") ||
        avail.includes("PALFINGER")
      ) {
        return parseCandidateToPalfinger(candidate);
      }
    }
  } catch (dbErr) {
    console.warn("DB check error in findPalfingerRegistrationByDni, checking cache:", dbErr);
  }

  // 2. Check memory cache
  for (const item of memoryCache.values()) {
    if (item.dni.trim() === cleanDni) return item;
  }

  // 3. Check tmpfile
  const fromTmp = await safeReadTmpFile();
  return fromTmp.find((r) => r.dni.trim() === cleanDni) || null;
}

export async function updatePalfingerStatus(
  id: string,
  status: PalfingerRegistration["status"],
  notes?: string
): Promise<PalfingerRegistration | null> {
  let existingItem = memoryCache.get(id);

  try {
    const db = await getDb();
    const candidate = await db.orm.public.Candidate.where({ id }).first();
    if (candidate) {
      let currentNotes: any = {};
      try {
        if (candidate.recruiterNotes) currentNotes = JSON.parse(candidate.recruiterNotes);
      } catch {
        currentNotes = {};
      }

      if (notes !== undefined) {
        currentNotes.recruiterComment = notes;
      }

      await db.orm.public.Candidate.where({ id }).update({
        status,
        recruiterNotes: JSON.stringify(currentNotes),
      });

      const updated = parseCandidateToPalfinger({
        ...candidate,
        status,
        recruiterNotes: JSON.stringify(currentNotes),
        updatedAt: new Date().toISOString(),
      });
      memoryCache.set(id, updated);
      return updated;
    }
  } catch (err) {
    console.warn("Could not update candidate in DB, updating memory cache:", err);
  }

  if (existingItem) {
    existingItem.status = status;
    if (notes !== undefined) {
      existingItem.recruiterNotes = notes;
    }
    existingItem.updatedAt = new Date().toISOString();
    memoryCache.set(id, existingItem);
    safeWriteTmpFile(Array.from(memoryCache.values()));
    return existingItem;
  }

  return null;
}

export async function updatePalfingerCv(
  id: string,
  cvFileName: string,
  cvFilePath: string
): Promise<PalfingerRegistration | null> {
  let existingItem = memoryCache.get(id);

  try {
    const db = await getDb();
    const candidate = await db.orm.public.Candidate.where({ id }).first();
    if (candidate) {
      let currentNotes: any = {};
      try {
        if (candidate.recruiterNotes) currentNotes = JSON.parse(candidate.recruiterNotes);
      } catch {
        currentNotes = {};
      }

      currentNotes.cvFileName = cvFileName;
      currentNotes.cvFilePath = cvFilePath;

      await db.orm.public.Candidate.where({ id }).update({
        recruiterNotes: JSON.stringify(currentNotes),
      });

      const updated = parseCandidateToPalfinger({
        ...candidate,
        recruiterNotes: JSON.stringify(currentNotes),
        updatedAt: new Date().toISOString(),
      });
      memoryCache.set(id, updated);
      safeWriteTmpFile(Array.from(memoryCache.values()));
      return updated;
    }
  } catch (err) {
    console.warn("Could not update candidate CV in DB:", err);
  }

  if (existingItem) {
    existingItem.cvFileName = cvFileName;
    existingItem.cvFilePath = cvFilePath;
    existingItem.updatedAt = new Date().toISOString();
    memoryCache.set(id, existingItem);
    safeWriteTmpFile(Array.from(memoryCache.values()));
    return existingItem;
  }

  return null;
}

