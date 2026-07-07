import "dotenv/config";
import app from "./app.js";
import { assertJwtSecretConfigured } from "./lib/jwt.js";
import { checkDatabaseConnection } from "./lib/prisma.js";

const port = Number(process.env.PORT) || 3000;

async function start() {
  try {
    assertJwtSecretConfigured();
    await checkDatabaseConnection();
    console.log("Database connected");
  } catch (error) {
    console.error(
      "Startup failed:",
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`API http://localhost:${port}`);
    console.log(`LAN erişimi: http://<bilgisayar-ip>:${port}`);
  });
}

start();
