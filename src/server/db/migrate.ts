import { migrate } from "drizzle-orm/neon-http/migrator";
import { db } from ".";

console.log("Applying migrations....");

await migrate(db, { migrationsFolder: "drizzle" })
  .then(() => {
    console.log("Migration Appli");
  })
  .catch((e) => console.error("Migration failed: ", e));
