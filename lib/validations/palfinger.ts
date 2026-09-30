import { z } from "zod";

export const palfingerRegistrationSchema = z.object({
  fullName: z
    .string()
    .min(3, "Ingresa tu nombre y apellidos completos")
    .max(120, "El nombre es demasiado extenso"),
  dni: z
    .string()
    .regex(/^\d{8}$/, "El DNI debe contener exactamente 8 dígitos numéricos"),
  phone: z
    .string()
    .regex(/^9\d{8}$/, "Ingresa un número de celular o WhatsApp válido (9 dígitos)"),
  email: z
    .string()
    .email("Ingresa un correo electrónico válido")
    .optional()
    .or(z.literal("")),
  residenceCity: z
    .string()
    .min(2, "Indica tu ciudad o lugar de residencia habitual")
    .max(80),
  profile: z
    .string()
    .min(1, "Selecciona tu perfil profesional"),
  experienceYears: z
    .string()
    .min(1, "Indica tus años de experiencia"),
  equipmentExperience: z
    .array(z.string())
    .min(1, "Selecciona al menos un equipo en el que tengas experiencia"),
  sectors: z
    .array(z.string())
    .min(1, "Selecciona al menos un sector en el que hayas trabajado"),
  miningExperience: z
    .enum(["Sí", "No"], {
      message: "Indica si tienes experiencia en izaje en minería",
    }),
  palfingerExperience: z
    .enum(["Sí", "No"], {
      message: "Indica si has trabajado con equipos PALFINGER",
    }),
  categoryBadge: z
    .string()
    .min(1, "Selecciona tu franja o categoría"),
  futureOpportunities: z
    .enum(["Sí", "No", "Me gustaría recibir información"], {
      message: "Indica tu disponibilidad para futuras oportunidades",
    }),
  termsAccepted: z
    .boolean()
    .refine((val) => val === true, "Debes autorizar el uso de datos para continuar"),
});

export type PalfingerRegistrationInput = z.infer<typeof palfingerRegistrationSchema>;
