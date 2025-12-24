import { migrate } from "drizzle-orm/neon-serverless/migrator";
import { db } from ".";

console.log("Applying migrations....");

await migrate(db, { migrationsFolder: "drizzle" })
  .then(() => {
    console.log("Migration Applied ✅");
  })
  .catch((e) => console.error("❌ Migration failed: ", e));
