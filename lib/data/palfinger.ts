import fs from "fs/promises";
import path from "path";

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

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "palfinger-registrations.json");

async function ensureDataFile(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf-8");
  }
}

export async function getPalfingerRegistrations(): Promise<PalfingerRegistration[]> {
  await ensureDataFile();
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error reading Palfinger registrations:", error);
    return [];
  }
}

export async function savePalfingerRegistration(
  record: PalfingerRegistration
): Promise<PalfingerRegistration> {
  await ensureDataFile();
  const list = await getPalfingerRegistrations();
  
  // Update if exists or prepend new
  const index = list.findIndex((item) => item.id === record.id || item.dni === record.dni);
  if (index >= 0) {
    list[index] = { ...list[index], ...record, updatedAt: new Date().toISOString() };
  } else {
    list.unshift(record);
  }

  await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), "utf-8");
  return record;
}

export async function findPalfingerRegistrationByDni(
  dni: string
): Promise<PalfingerRegistration | null> {
  const list = await getPalfingerRegistrations();
  return list.find((item) => item.dni.trim() === dni.trim()) || null;
}

export async function updatePalfingerStatus(
  id: string,
  status: PalfingerRegistration["status"],
  notes?: string
): Promise<PalfingerRegistration | null> {
  const list = await getPalfingerRegistrations();
  const item = list.find((r) => r.id === id);
  if (!item) return null;

  item.status = status;
  if (notes !== undefined) {
    item.recruiterNotes = notes;
  }
  item.updatedAt = new Date().toISOString();

  await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), "utf-8");
  return item;
}
