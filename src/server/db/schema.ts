// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import { index, pgTable } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { invitation, member, organization, user } from "./auth-schema";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const organizationRelatoions = relations(organization, ({ many }) => ({
  invitations: many(invitation),
}));

export const memberRelations = relations(member, ({ one }) => ({
  user: one(user, { fields: [member.userId], references: [user.id] }),
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

export const board = pgTable(
  "board",
  (d) => ({
    id: d
      .text()
      .primaryKey()
      .$defaultFn(() => createId()),
    name: d.varchar({ length: 256 }).notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
    description: d.text(),
    startDate: d.timestamp({ mode: "date", withTimezone: true }),
    endDate: d.timestamp({ mode: "date", withTimezone: true }),
  }),
  (t) => [index("name_idx").on(t.name)],
);

export const boardRelations = relations(board, ({ many }) => ({
  boardMembers: many(boardMember),
}));

export const CreateBoardSchema = createInsertSchema(board, {
  name: z.string().min(3, "Board name cannot be less than 3 characters"),
  description: z.string().min(1, "Description must be atleast 1 character"),
});

export const UpdateBoardSchema = createUpdateSchema(board, {
  name: z.string().optional(),
  id: z.string().min(1),
}).omit({
  createdAt: true,
  updatedAt: true,
});

export const boardMember = pgTable("board_member", (d) => ({
  id: d
    .text()
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: d
    .text()
    .references(() => user.id)
    .notNull(),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  boardId: d
    .text()
    .references(() => board.id)
    .notNull(),
}));

export const boardMemberRelations = relations(boardMember, ({ one }) => ({
  user: one(user, { fields: [boardMember.userId], references: [user.id] }),
  board: one(board, { fields: [boardMember.boardId], references: [board.id] }),
}));
