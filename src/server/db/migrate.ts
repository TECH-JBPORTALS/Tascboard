import { migrate } from "drizzle-orm/neon-http/migrator";
import { db } from ".";
import { tasc } from "./schema";
import { eq } from "drizzle-orm";
import { asc } from "drizzle-orm";

console.log("Fixing tasc face Id's...");

// Get all tracks
await db.query.track.findMany().then(async (tracks) => {
  return await Promise.all(
    tracks.map(async (tr) => {
      // Get all tascs in track in ascending order by createdAt
      const tascs = await db.query.tasc.findMany({
        where: eq(tasc.trackId, tr.id),
        orderBy: asc(tasc.createdAt),
      });

      return await Promise.all(
        tascs.map((ta, i) =>
          db
            .update(tasc)
            .set({ faceId: (i + 1).toString() })
            .where(eq(tasc.id, ta.id)),
        ),
      );
    }),
  );
});

console.log("Applying migrations....");

await migrate(db, { migrationsFolder: "drizzle" })
  .then(() => {
    console.log("Migration Appli");
  })
  .catch((e) => console.error("Migration failed: ", e));
