import "dotenv/config";
import { db } from "./db.js";

async function main() {
  await db.connect({ url: process.env.DATABASE_URL! });

  const positions = [
    {
      title: "Supervisor Operativo",
      slug: "supervisor-operativo",
      department: "Izaje – Antamina",
      location: "Huaraz / Mina Antamina",
      description: "Supervisión directa de operaciones de izaje. Requiere experiencia en grúas y maniobras de carga.",
      isActive: true,
      sortOrder: 1,
    },
    {
      title: "Supervisor de Seguridad",
      slug: "supervisor-seguridad",
      department: "Izaje – Antamina",
      location: "Huaraz / Mina Antamina",
      description: "Control y gestión de estándares de seguridad en operaciones de izaje. Requiere certificación SSOMA.",
      isActive: true,
      sortOrder: 2,
    },
    {
      title: "Operadores de Camión Grúa",
      slug: "operadores-camion-grua",
      department: "Izaje – Antamina",
      location: "Huaraz / Mina Antamina",
      description: "Operación de camión grúa para maniobras de izaje. Brevete A-IIIb o superior requerido.",
      isActive: true,
      sortOrder: 3,
    },
    {
      title: "Rigger",
      slug: "rigger",
      department: "Izaje – Antamina",
      location: "Huaraz / Mina Antamina",
      description: "Amarre, aseguramiento y señalización de cargas en operaciones de izaje. Certificación de Rigger requerida.",
      isActive: true,
      sortOrder: 4,
    },
  ];

  for (const pos of positions) {
    const existing = await db.orm.public.Position.where({ slug: pos.slug }).first();
    if (!existing) {
      await db.orm.public.Position.create(pos);
      console.log(`✓ Creado: ${pos.title}`);
    } else {
      console.log(`· Ya existe: ${pos.title}`);
    }
  }

  console.log("\n✅ Semilla completada — 4 puestos iniciales listos.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => {
    try { await db.close(); } catch {}
  });
