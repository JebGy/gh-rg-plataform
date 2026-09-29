"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminSession, destroyAdminSession } from "@/lib/auth";

export type LoginState = {
  error?: string;
};

export async function loginAdmin(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = (formData.get("username") as string)?.trim();
  const password = (formData.get("password") as string)?.trim();

  const expectedUser = (process.env.ADMIN_USERNAME || "root").trim();
  const expectedPass = (process.env.ADMIN_PASSWORD || "root").trim();

  // Strict check: ONLY "root" can access
  if (username !== "root" && username !== expectedUser) {
    return { error: "Acceso denegado. Solo el usuario root tiene autorización para ingresar a este panel." };
  }

  if (password !== expectedPass) {
    return { error: "Contraseña incorrecta para el usuario root." };
  }

  // Create secure session
  await createAdminSession(username);
  revalidatePath("/admin");
  redirect("/admin");
}

export async function logoutAdmin(): Promise<void> {
  await destroyAdminSession();
  revalidatePath("/admin");
  redirect("/admin");
}
