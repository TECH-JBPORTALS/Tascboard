import { migrate } from "drizzle-orm/neon-serverless/migrator";
import { db } from ".";
import { tascActivity } from "./schema";

console.log("Adding activity logs...");

await db.query.tasc
  .findMany({ with: { tascMembers: true } })
  .then(async (tascs) => {
    await Promise.all(
      tascs.map(async (tasc) => {
        const tascMember = tasc.tascMembers.find(
          (item) => item.userId !== tasc.createdBy,
        );

        const tascActivityValues: (typeof tascActivity.$inferInsert)[] = [
          {
            tascId: tasc.id,
            performedBy: tasc.createdBy,
            reason: {
              action: "created",
              payload: { status: "todo", priority: "no_priority" },
            },
            createdAt: tasc.createdAt,
          },
        ];

        if (tasc.startedAt)
          tascActivityValues.push({
            tascId: tasc.id,
            performedBy: tascMember?.userId ?? tasc.createdBy,
            reason: {
              action: "status_changed",
              payload: { from: "todo", to: "in_progress" },
            },
            createdAt: tasc.startedAt,
          });

        if (tasc.completedAt)
          tascActivityValues.push({
            tascId: tasc.id,
            performedBy: tascMember?.userId ?? tasc.createdBy,
            reason: {
              action: "status_changed",
              payload: { from: "in_progress", to: "completed" },
            },
            createdAt: tasc.completedAt,
          });

        return await db.insert(tascActivity).values(tascActivityValues);
      }),
    );

    console.log("Insertion done ✅");
  })
  .catch((e) => console.log(e));

console.log("Applying migrations....");

await migrate(db, { migrationsFolder: "drizzle" })
  .then(() => {
    console.log("Migration Applied ✅");
  })
  .catch((e) => console.error("❌ Migration failed: ", e));
