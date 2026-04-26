import { defineConfig } from "prisma/config";
import { loadEnvFile } from "node:process";

try { loadEnvFile(".env.local"); } catch {}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
