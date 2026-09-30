import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Convocatoria Operativa Izaje Antamina | Ramirez Group",
  description:
    "Portal oficial de reclutamiento de Ramirez Group para el servicio de Izaje en Mina Antamina (Huaraz). Supervisor Operativo, Supervisor de Seguridad, Operadores de Camión Grúa y Rigger.",
  openGraph: {
    title: "Convocatoria Operativa Izaje Antamina | Ramirez Group",
    description:
      "Postula a la convocatoria de personal operativo en Huaraz para el servicio de Izaje - Antamina con Ramirez Group.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-zinc-900">{children}</body>
    </html>
  );
}
