"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/prisma";
import { candidateSchema } from "@/lib/validations";
import crypto from "crypto";

export type RegisterState = {
  errors?: Record<string, string[]>;
  message?: string;
};

export async function registerCandidate(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const raw = {
    positionId: formData.get("positionId"),
    fullName: formData.get("fullName"),
    dni: formData.get("dni"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    licenseNumber: formData.get("licenseNumber"),
    residenceCity: formData.get("residenceCity"),
    availability: formData.get("availability"),
  };

  const parsed = candidateSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors as Record<string, string[]>;
    return { errors: fieldErrors };
  }

  const data = parsed.data;
  const db = await getDb();

  // Check for duplicate DNI for the same position
  const existing = await db.orm.public.Candidate.where({
    dni: data.dni,
    positionId: data.positionId,
  }).first();

  if (existing) {
    return {
      errors: {
        dni: ["Ya existe una postulación registrada con este DNI para el puesto seleccionado."],
      },
    };
  }

  await db.orm.public.Candidate.create({
    id: crypto.randomUUID(),
    positionId: data.positionId,
    fullName: data.fullName,
    dni: data.dni,
    phone: data.phone,
    email: data.email || null,
    licenseNumber: data.licenseNumber || null,
    residenceCity: data.residenceCity,
    availability: data.availability,
    status: "nuevo",
    recruiterNotes: null,
  });

  revalidatePath("/admin");
  redirect("/gracias");
}
