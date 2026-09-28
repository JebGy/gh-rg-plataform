import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Convocatoria Izaje – Antamina | Huaraz",
  description:
    "Reclutamiento de personal operativo para el servicio de Izaje en Antamina, Huaraz. Regístrate y forma parte de nuestro equipo.",
  openGraph: {
    title: "Convocatoria Izaje – Antamina | Huaraz",
    description:
      "Supervisor Operativo, Supervisor de Seguridad, Operadores de Camión Grúa y Rigger. Postula ahora.",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
