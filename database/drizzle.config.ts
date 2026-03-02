import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./migrations",
  schema: "./src/schemas/*.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: "../server/.wrangler/state/v3/d1/miniflare-D1DatabaseObject/4f126dbda8453b3dab340f747424778a67b6770d3da148c83c711dc13c102789.sqlite",
  },
});
