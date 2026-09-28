import "dotenv/config";
import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "../prisma/schema.d";
import contractJson from "../prisma/schema.json" with { type: "json" };

const db = postgres<Contract>({
  contractJson,
  url: process.env.DATABASE_URL!,
});

let isConnected = false;
let connectPromise: Promise<void> | null = null;

async function getDb() {
  if (!isConnected) {
    if (!connectPromise) {
      connectPromise = db.connect({ url: process.env.DATABASE_URL! }).then(() => {
        isConnected = true;
      });
    }
    await connectPromise;
  }
  return db;
}

async function main() {
  const [d1, d2] = await Promise.all([getDb(), getDb()]);
  const positions = await d1.orm.public.Position.all();
  console.log("Positions count:", positions.length);
}

main().catch(console.error).finally(async () => {
  try { await db.close(); } catch {}
  process.exit(0);
});
