import "dotenv/config";
import { db } from "../prisma/db.js";

async function main() {
  console.log("DATABASE_URL loaded:", !!process.env.DATABASE_URL);
  console.log("Connecting with URL...");
  await db.connect({ url: process.env.DATABASE_URL! });
  console.log("Connected successfully!");

  const positions = await db.orm.public.Position.all();
  console.log("Positions in DB:", positions);
}

main().catch(console.error).finally(async () => {
  try { await db.close(); } catch {}
  process.exit(0);
});
