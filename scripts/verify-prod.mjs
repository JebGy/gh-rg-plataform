import postgres from "file:///C:/Users/xkira24/Desktop/Apps/ssma/node_modules/postgres/src/index.js";

async function verify() {
  const sql = postgres("postgres://postgres:baryik4vhvm14rf3mlxa@tc5u8q.easypanel.host:5445/ti?sslmode=disable");
  try {
    const positions = await sql`
      SELECT id, title, slug, department, location, "isActive", "sortOrder" 
      FROM positions 
      ORDER BY "sortOrder" ASC
    `;
    console.log("=== PUESTOS EN BASE DE DATOS ===");
    positions.forEach(p => console.log(`[ID ${p.id}] ${p.title} (slug: ${p.slug}, activo: ${p.isActive})`));

    const candidates = await sql`SELECT count(*) as total FROM candidates`;
    console.log("\n=== TOTAL POSTULANTES REGISTRADOS ===");
    console.log("Total:", candidates[0].total);

    const schema = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'candidates'
      ORDER BY ordinal_position
    `;
    console.log("\n=== COLUMNAS TABLA CANDIDATES ===");
    schema.forEach(c => console.log(`- ${c.column_name}: ${c.data_type}`));
  } finally {
    await sql.end();
  }
}

verify().catch(console.error);
