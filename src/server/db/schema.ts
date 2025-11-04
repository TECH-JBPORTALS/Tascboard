// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import { index, pgTable } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { invitation, organization, user } from "./auth-schema";

export const organizationRelatoions = relations(organization, ({ many }) => ({
  invitations: many(invitation),
}));

export const invitationRealations = relations(invitation, ({ one }) => ({
  organization: one(organization, {
    fields: [invitation.organizationId],
    references: [organization.id],
  }),
  inviter: one(user, {
    fields: [invitation.inviterId],
    references: [user.id],
  }),
}));

export const boards = pgTable(
  "boards",
  (d) => ({
    id: d
      .text()
      .primaryKey()
      .$defaultFn(() => createId()),
    name: d.varchar({ length: 256 }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("name_idx").on(t.name)],
);
