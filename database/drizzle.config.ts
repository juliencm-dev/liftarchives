import { config } from "dotenv";
import { resolve } from "path";
import { defineConfig } from "drizzle-kit";

config({ path: resolve(process.cwd(), "../server/.env") });

export default defineConfig({
  out: "./migrations",
  schema: "./src/schemas/*.ts",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.NODE_ENV === "production"
        ? process.env.DATABASE_URL!
        : process.env.DATABASE_URL_DEV!,
  },
});
