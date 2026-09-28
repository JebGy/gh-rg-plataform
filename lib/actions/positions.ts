"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/prisma";
import { positionSchema } from "@/lib/validations";

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function createPosition(formData: FormData) {
  const raw = {
    title: formData.get("title"),
    department: formData.get("department"),
    location: formData.get("location"),
    description: formData.get("description"),
    sortOrder: formData.get("sortOrder"),
  };

  const parsed = positionSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;
  let slug = slugify(data.title);
  const db = await getDb();

  // Handle duplicate slugs
  const existing = await db.orm.public.Position.where({ slug }).first();
  if (existing) slug = `${slug}-${Date.now()}`;

  await db.orm.public.Position.create({
    title: data.title,
    slug,
    department: data.department || "Izaje – Antamina",
    location: data.location || "Huaraz",
    description: data.description || null,
    isActive: true,
    sortOrder: data.sortOrder || 0,
  });

  revalidatePath("/admin/puestos");
  revalidatePath("/");
  return { ok: true };
}

export async function togglePosition(id: number, isActive: boolean) {
  const db = await getDb();
  await db.orm.public.Position.where({ id }).update({ isActive });
  revalidatePath("/admin/puestos");
  revalidatePath("/");
}

export async function updateCandidateStatus(
  id: string,
  status: string,
  recruiterNotes?: string
) {
  const db = await getDb();
  const updateData: { status: string; recruiterNotes?: string | null } = { status };
  if (recruiterNotes !== undefined) {
    updateData.recruiterNotes = recruiterNotes;
  }
  await db.orm.public.Candidate.where({ id }).update(updateData);
  revalidatePath("/admin");
}
