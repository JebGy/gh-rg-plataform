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

      if (cvFile.size > 20 * 1024 * 1024) {
        return {
          success: false,
          errors: {
            cvFile: ["El archivo excede el tamaño máximo permitido de 20MB."],
          },
          message: "El archivo es demasiado pesado (máximo 20MB).",
        };
      }

      cvFileName = cvFile.name;

      // 1. Sincronizar archivo con RG-Hub (MinIO S3 + Compresión nativa PDF)
      let rghubUrl =
        process.env.RGHUB_API_URL ||
        process.env.RGHUB_URL ||
        "https://proyectoarca.ramirezgroup.com.pe";

      if (rghubUrl.includes("hub.ramirezgroup.com.pe")) {
        rghubUrl = "https://proyectoarca.ramirezgroup.com.pe";
      }

      const rghubApiKey = process.env.GHAPP_INTEGRATION_KEY || "rg_arca_ghapp_sync_2026";

      try {
        const fileBuffer = Buffer.from(await cvFile.arrayBuffer());
        const fileBlob = new Blob([fileBuffer], { type: cvFile.type || "application/pdf" });

        const hubFormData = new FormData();
        hubFormData.append("file", fileBlob, cvFile.name);
        hubFormData.append("folderName", "Capacitaciones PALFINGER 2026");
        hubFormData.append("candidateName", rawFullName);
        hubFormData.append("candidateDni", rawDni);
        hubFormData.append("candidatePhone", rawPhone);
        hubFormData.append("source", "palfinger");

        const hubRes = await fetch(`${rghubUrl}/api/integrations/ghapp/upload`, {
          method: "POST",
          headers: {
            "x-api-key": rghubApiKey,
          },
          body: hubFormData,
          signal: AbortSignal.timeout(30000),
        });

        if (hubRes.ok) {
          const hubData = await hubRes.json();
          if (hubData.success && hubData.document) {
            cvFilePath = hubData.document.downloadUrl || hubData.document.directUrl;
            cvFileName = hubData.document.originalName || hubData.document.name || cvFile.name;
          }
        } else {
          const errText = await hubRes.text().catch(() => "");
          console.warn("RG-Hub sync returned HTTP status:", hubRes.status, errText);
        }
      } catch (hubErr: any) {
        console.warn("Notice: RG-Hub sync attempt bypassed or unavailable:", hubErr?.message || hubErr);
      }

      // 2. Si no se obtuvo URL de RG-Hub (ej. offline o entorno local), intentar guardar en disco local si es escribible
      if (!cvFilePath) {
        try {
          const uploadDir = path.join(process.cwd(), "public", "uploads", "cv");
          await fs.mkdir(uploadDir, { recursive: true });
          const sanitizedDni = rawDni.replace(/[^0-9]/g, "");
          const uniqueFileName = `cv_${sanitizedDni}_${Date.now()}${ext}`;
          const targetPath = path.join(uploadDir, uniqueFileName);
          const arrayBuffer = await cvFile.arrayBuffer();
          await fs.writeFile(targetPath, Buffer.from(arrayBuffer));
          cvFilePath = `/uploads/cv/${uniqueFileName}`;
        } catch {
          // En serverless de solo lectura (como Vercel) no bloqueamos la inscripción del postulante
        }
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

    // Guardar en almacenamiento seguro con persistencia en PostgreSQL
    await savePalfingerRegistration(record);

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

export async function syncPalfingerCvAction(candidateId: string, formData: FormData) {
  try {
    const file = formData.get("file") as File | null;
    if (!file || file.size === 0) {
      return { success: false, message: "No se seleccionó ningún archivo." };
    }

    const { getPalfingerRegistrations, updatePalfingerCv } = await import("@/lib/data/palfinger");
    const all = await getPalfingerRegistrations();
    const reg = all.find((r) => r.id === candidateId);
    if (!reg) {
      return { success: false, message: "No se encontró el registro del participante." };
    }

    let rghubUrl =
      process.env.RGHUB_API_URL ||
      process.env.RGHUB_URL ||
      "https://proyectoarca.ramirezgroup.com.pe";

    if (rghubUrl.includes("hub.ramirezgroup.com.pe")) {
      rghubUrl = "https://proyectoarca.ramirezgroup.com.pe";
    }

    const rghubApiKey = process.env.GHAPP_INTEGRATION_KEY || "rg_arca_ghapp_sync_2026";

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileBlob = new Blob([fileBuffer], { type: file.type || "application/pdf" });

    const hubFormData = new FormData();
    hubFormData.append("file", fileBlob, file.name);
    hubFormData.append("folderName", "Capacitaciones PALFINGER 2026");
    hubFormData.append("candidateName", reg.fullName);
    hubFormData.append("candidateDni", reg.dni);
    hubFormData.append("candidatePhone", reg.phone);
    hubFormData.append("source", "palfinger_admin_sync");

    const hubRes = await fetch(`${rghubUrl}/api/integrations/ghapp/upload`, {
      method: "POST",
      headers: {
        "x-api-key": rghubApiKey,
      },
      body: hubFormData,
      signal: AbortSignal.timeout(30000),
    });

    if (!hubRes.ok) {
      const errJson = await hubRes.json().catch(() => ({}));
      return {
        success: false,
        message: errJson.error || `Error al sincronizar con RG-Hub (HTTP ${hubRes.status})`,
      };
    }

    const hubData = await hubRes.json();
    const cvFilePath = hubData.document?.downloadUrl || hubData.document?.directUrl;
    const cvFileName = hubData.document?.originalName || file.name;

    if (!cvFilePath) {
      return { success: false, message: "RG-Hub no devolvió la URL del archivo." };
    }

    await updatePalfingerCv(candidateId, cvFileName, cvFilePath);
    revalidatePath("/admin");

    return {
      success: true,
      message: "¡Documento sincronizado exitosamente con RG-Hub y MinIO!",
      cvFilePath,
      cvFileName,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Error inesperado al sincronizar.",
    };
  }
}


