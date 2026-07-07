import { checkDatabaseConnection } from "../lib/prisma.js";

export async function getHealthStatus() {
  const timestamp = new Date().toISOString();

  try {
    await checkDatabaseConnection();
    return {
      status: "ok" as const,
      timestamp,
      database: "connected" as const,
    };
  } catch {
    return {
      status: "error" as const,
      timestamp,
      database: "disconnected" as const,
    };
  }
}
