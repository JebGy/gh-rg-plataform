import { z } from "zod";

export const candidateSchema = z.object({
  positionId: z.coerce.number().int().positive("Selecciona un puesto válido"),
  fullName: z.string().min(3, "Ingresa tu nombre completo").max(120),
  dni: z
    .string()
    .regex(/^\d{8}$/, "El DNI debe tener exactamente 8 dígitos numéricos"),
  phone: z
    .string()
    .regex(/^9\d{8}$/, "Ingresa un número de celular válido de 9 dígitos (9XXXXXXXX)"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  licenseNumber: z.string().max(60).optional().or(z.literal("")),
  residenceCity: z.string().min(2, "Indica tu lugar de residencia").max(80),
  availability: z.string().min(1, "Selecciona tu disponibilidad"),
});

export type CandidateInput = z.infer<typeof candidateSchema>;

export const positionSchema = z.object({
  title: z.string().min(3, "El nombre del puesto es requerido").max(120),
  department: z.string().max(120).optional(),
  location: z.string().max(120).optional(),
  description: z.string().max(500).optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export type PositionInput = z.infer<typeof positionSchema>;
