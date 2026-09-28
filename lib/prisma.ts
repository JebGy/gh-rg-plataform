import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "@/prisma/schema.d";
import contractJson from "@/prisma/schema.json" with { type: "json" };

const globalForDb = globalThis as unknown as {
  prismaDb?: ReturnType<typeof createDb>;
  isConnecting?: Promise<void>;
};

function createDb() {
  return postgres<Contract>({
    contractJson,
    url: process.env.DATABASE_URL!,
  });
}

export const db = globalForDb.prismaDb ?? createDb();

if (process.env.NODE_ENV !== "production") globalForDb.prismaDb = db;

let isConnected = false;

export async function getDb() {
  if (!isConnected) {
    if (!globalForDb.isConnecting) {
      globalForDb.isConnecting = db.connect({ url: process.env.DATABASE_URL! }).then(() => {
        isConnected = true;
      });
    }
    await globalForDb.isConnecting;
  }
  return db;
}

export default getDb;
