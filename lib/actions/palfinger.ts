"use server";

import { revalidatePath } from "next/cache";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { palfingerRegistrationSchema } from "@/lib/validations/palfinger";
import {
  findPalfingerRegistrationByDni,
  savePalfingerRegistration,
  type PalfingerRegistration,
} from "@/lib/data/palfinger";
import { getDb } from "@/lib/prisma";

export type PalfingerActionState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  registrationId?: string;
  candidateName?: string;
};

export async function registerPalfingerTraining(
  _prevState: PalfingerActionState,
  formData: FormData
): Promise<PalfingerActionState> {
  try {
    const rawFullName = formData.get("fullName")?.toString().trim() || "";
    const rawDni = formData.get("dni")?.toString().trim() || "";
    const rawPhone = formData.get("phone")?.toString().trim() || "";
    const rawEmail = formData.get("email")?.toString().trim() || "";
    const rawResidenceCity = formData.get("residenceCity")?.toString().trim() || "";
    
    // Perfil profesional y personalizado
    let rawProfile = formData.get("profile")?.toString().trim() || "";
    const customProfile = formData.get("customProfile")?.toString().trim();
    if (rawProfile === "Otro" && customProfile) {
      rawProfile = `Otro (${customProfile})`;
    }

    const rawExperienceYears = formData.get("experienceYears")?.toString().trim() || "";
    
    // Multi-select equipos
    let equipmentExperience = formData.getAll("equipmentExperience").map((v) => v.toString().trim()).filter(Boolean);
    const customEquipment = formData.get("customEquipment")?.toString().trim();
    if (equipmentExperience.includes("Otro") && customEquipment) {
      equipmentExperience = equipmentExperience.map(e => e === "Otro" ? `Otro (${customEquipment})` : e);
    }

    // Multi-select sectores
    let sectors = formData.getAll("sectors").map((v) => v.toString().trim()).filter(Boolean);
    const customSector = formData.get("customSector")?.toString().trim();
    if (sectors.includes("Otros") && customSector) {
      sectors = sectors.map(s => s === "Otros" ? `Otros (${customSector})` : s);
    }

    const miningExperience = formData.get("miningExperience")?.toString().trim();
    const palfingerExperience = formData.get("palfingerExperience")?.toString().trim();

    // Franja / Categoría
    let rawCategoryBadge = formData.get("categoryBadge")?.toString().trim() || "";
    const customCategoryBadge = formData.get("customCategoryBadge")?.toString().trim();
    if (rawCategoryBadge === "Otra" && customCategoryBadge) {
      rawCategoryBadge = `Otra (${customCategoryBadge})`;
    }

    const futureOpportunities = formData.get("futureOpportunities")?.toString().trim();
    const termsAccepted = formData.get("termsAccepted") === "on" || formData.get("termsAccepted") === "true";

    const validated = palfingerRegistrationSchema.safeParse({
      fullName: rawFullName,
      dni: rawDni,
      phone: rawPhone,
      email: rawEmail || undefined,
      residenceCity: rawResidenceCity,
      profile: rawProfile,
      experienceYears: rawExperienceYears,
      equipmentExperience,
      sectors,
      miningExperience,
      palfingerExperience,
      categoryBadge: rawCategoryBadge,
      futureOpportunities,
      termsAccepted,
    });

    if (!validated.success) {
      const fieldErrors = validated.error.flatten().fieldErrors as Record<string, string[]>;
      return {
        success: false,
        errors: fieldErrors,
        message: "Por favor revisa los campos señalados en el formulario.",
      };
    }

    // Comprobar DNI duplicado en registros de capacitación
    const existing = await findPalfingerRegistrationByDni(rawDni);
    if (existing) {
      return {
        success: false,
        errors: {
          dni: ["Ya existe un registro con este DNI para la Capacitación PALFINGER."],
        },
        message: "Este DNI ya se encuentra registrado para la jornada de capacitación.",
      };
    }

    // Procesar CV si se adjuntó
    let cvFileName: string | null = null;
    let cvFilePath: string | null = null;
    const cvFile = formData.get("cvFile") as File | null;

    if (cvFile && cvFile.size > 0 && cvFile.name) {
      const allowedExts = [".pdf", ".doc", ".docx"];
      const ext = path.extname(cvFile.name).toLowerCase();
      if (!allowedExts.includes(ext)) {
        return {
          success: false,
          errors: {
            cvFile: ["Formato de archivo no válido. Solo se admiten archivos PDF o Word (.pdf, .doc, .docx)."],
          },
          message: "Formato de CV incorrecto.",
        };
      }

      if (cvFile.size > 15 * 1024 * 1024) {
        return {
          success: false,
          errors: {
            cvFile: ["El archivo excede el tamaño máximo permitido de 15MB."],
          },
        };
      }

      try {
        const uploadDir = path.join(process.cwd(), "public", "uploads", "cv");
        await fs.mkdir(uploadDir, { recursive: true });
        const sanitizedDni = rawDni.replace(/[^0-9]/g, "");
        const uniqueFileName = `cv_${sanitizedDni}_${Date.now()}${ext}`;
        const targetPath = path.join(uploadDir, uniqueFileName);
        const arrayBuffer = await cvFile.arrayBuffer();
        await fs.writeFile(targetPath, Buffer.from(arrayBuffer));
        cvFileName = cvFile.name;
        cvFilePath = `/uploads/cv/${uniqueFileName}`;
      } catch (fileErr) {
        console.error("Error saving CV file:", fileErr);
        // Do not block registration if file write fails, save original file name
        cvFileName = cvFile.name;
      }
    }

    const registrationId = crypto.randomUUID();
    const nowIso = new Date().toISOString();

    const record: PalfingerRegistration = {
      id: registrationId,
      fullName: validated.data.fullName,
      dni: validated.data.dni,
      phone: validated.data.phone,
      email: validated.data.email || null,
      residenceCity: validated.data.residenceCity,
      profile: validated.data.profile,
      experienceYears: validated.data.experienceYears,
      equipmentExperience: validated.data.equipmentExperience,
      sectors: validated.data.sectors,
      miningExperience: validated.data.miningExperience,
      palfingerExperience: validated.data.palfingerExperience,
      categoryBadge: validated.data.categoryBadge,
      cvFileName,
      cvFilePath,
      futureOpportunities: validated.data.futureOpportunities,
      termsAccepted: true,
      status: "nuevo",
      recruiterNotes: null,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    // Guardar en el almacenamiento local robusto
    await savePalfingerRegistration(record);

    // Intentar sincronizar también en la tabla Candidate si está disponible
    try {
      const db = await getDb();
      // Encontrar posición relacionada a Camión Grúa o Rigger
      const allPositions = await db.orm.public.Position.all();
      let posId = allPositions[0]?.id || 1;
      const lowerProfile = validated.data.profile.toLowerCase();
      if (lowerProfile.includes("rigger")) {
        const riggerPos = allPositions.find((p) => p.title.toLowerCase().includes("rigger"));
        if (riggerPos) posId = riggerPos.id;
      } else if (lowerProfile.includes("grúa") || lowerProfile.includes("operador")) {
        const cranePos = allPositions.find((p) => p.title.toLowerCase().includes("grúa") || p.title.toLowerCase().includes("operador"));
        if (cranePos) posId = cranePos.id;
      }

      await db.orm.public.Candidate.create({
        id: registrationId,
        positionId: posId,
        fullName: validated.data.fullName,
        dni: validated.data.dni,
        phone: validated.data.phone,
        email: validated.data.email || null,
        licenseNumber: `[PALFINGER] ${validated.data.categoryBadge} | ${validated.data.profile}`,
        residenceCity: validated.data.residenceCity,
        availability: `Capacitación PALFINGER (Futuras Oportunidades: ${validated.data.futureOpportunities})`,
        status: "nuevo",
        recruiterNotes: JSON.stringify({
          source: "capacitacion_palfinger",
          profile: validated.data.profile,
          experienceYears: validated.data.experienceYears,
          equipmentExperience: validated.data.equipmentExperience,
          sectors: validated.data.sectors,
          miningExperience: validated.data.miningExperience,
          palfingerExperience: validated.data.palfingerExperience,
          categoryBadge: validated.data.categoryBadge,
          cvFileName,
          cvFilePath,
          futureOpportunities: validated.data.futureOpportunities,
        }),
      });
    } catch (dbErr) {
      console.warn("Could not sync to DB candidates table (fallback to local store active):", dbErr);
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/gracias-capacitacion");

    return {
      success: true,
      registrationId,
      candidateName: validated.data.fullName,
      message: "¡Registro recibido exitosamente!",
    };
  } catch (error: any) {
    console.error("Unhandled error in registerPalfingerTraining:", error);
    return {
      success: false,
      message: "Ocurrió un error inesperado al procesar tu solicitud. Intenta nuevamente.",
    };
  }
}

export async function updatePalfingerStatusAction(
  id: string,
  status: PalfingerRegistration["status"],
  notes?: string
) {
  const { updatePalfingerStatus } = await import("@/lib/data/palfinger");
  await updatePalfingerStatus(id, status, notes);
  revalidatePath("/admin");
  return { success: true };
}

