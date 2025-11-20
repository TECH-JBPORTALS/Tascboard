// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations } from "drizzle-orm";
import { index, pgTable } from "drizzle-orm/pg-core";
import { invitation, member, organization, user } from "./auth-schema";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { dueDateColumns, initialColumns } from "./column.helpers";

/***************************************************************************/
/* AuthSchema's drizzle relations */

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

/*****************************************************************************/

/** ## Board */
export const board = pgTable(
  "board",
  (d) => ({
    ...initialColumns,
    ...dueDateColumns,
    name: d.varchar({ length: 256 }).notNull(),
    description: d.text(),
    organizationId: d
      .text()
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
  }),
  (t) => [index().on(t.name)],
);

export const boardRelations = relations(board, ({ many }) => ({
  boardMembers: many(boardMember),
}));

export const CreateBoardSchema = createInsertSchema(board, {
  name: z.string().min(3, "Board name cannot be less than 3 characters"),
}).omit({ organizationId: true });

export const UpdateBoardSchema = createUpdateSchema(board, {
  name: z.string().optional(),
  id: z.string().min(1),
}).omit({
  createdAt: true,
  updatedAt: true,
});

/** ## Board Member */
export const boardMember = pgTable("board_member", (d) => ({
  ...initialColumns,
  userId: d
    .text()
    .references(() => user.id, {
      onDelete: "cascade",
    })
    .notNull(),
  boardId: d
    .text()
    .references(() => board.id, {
      onDelete: "cascade",
    })
    .notNull(),
}));

export const boardMemberRelations = relations(boardMember, ({ one }) => ({
  user: one(user, { fields: [boardMember.userId], references: [user.id] }),
  board: one(board, { fields: [boardMember.boardId], references: [board.id] }),
}));

/** ## Track */
export const track = pgTable(
  "track",
  (d) => ({
    ...initialColumns,
    ...dueDateColumns,
    name: d.varchar({ length: 256 }).notNull(),
    description: d.text(),
    boardId: d
      .text()
      .references(() => board.id, {
        onDelete: "cascade",
      })
      .notNull(),
  }),
  (t) => [index().on(t.name)],
);

export const trackRelations = relations(track, ({ many, one }) => ({
  trackMembers: many(trackMember),
  board: one(board, { fields: [track.boardId], references: [board.id] }),
}));

export const CreateTrackSchema = createInsertSchema(track, {
  name: z.string().min(3, "Track name cannot be less than 3 characters"),
  boardId: z.string().min(1, "Board Id is required to create track"),
});

export const UpdateTrackSchema = createUpdateSchema(track, {
  name: z.string().optional(),
  id: z.string().min(1),
}).omit({
  boardId: true,
  createdAt: true,
  updatedAt: true,
});

/** ## Track Member */
export const trackMember = pgTable("track_member", (d) => ({
  ...initialColumns,
  trackId: d
    .text()
    .references(() => track.id, {
      onDelete: "cascade",
    })
    .notNull(),
  boardMemberId: d
    .text()
    .references(() => boardMember.id, {
      onDelete: "cascade",
    })
    .notNull(),
  userId: d
    .text()
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  isLeader: d.boolean().default(false),
}));

export const trackMemberRelations = relations(trackMember, ({ one }) => ({
  track: one(track, { fields: [trackMember.trackId], references: [track.id] }),
  boardMember: one(boardMember, {
    fields: [trackMember.boardMemberId],
    references: [boardMember.id],
  }),
  user: one(user, { fields: [trackMember.userId], references: [user.id] }),
}));

/** Tasc */

export type TascStatus = "todo" | "in_progress" | "completed" | "verified";

export const tasc = pgTable(
  "tasc",
  (d) => ({
    ...initialColumns,
    ...dueDateColumns,
    name: d.varchar({ length: 256 }).notNull(),
    description: d.text(),
    faceId: d.varchar({ length: 256 }).notNull(),
    trackId: d
      .text()
      .references(() => track.id, { onDelete: "cascade" })
      .notNull(),
    status: d.text().$type<TascStatus>().notNull().default("todo"),
    /** Tasc status changed form `todo` to `in_progress` status timestamp */
    startedAt: d.timestamp({ mode: "date", withTimezone: true }),
    /** Tasc status changed to `completed` status timestamp */
    completedAt: d.timestamp({ mode: "date", withTimezone: true }),
  }),
  (t) => [index().on(t.name)],
);

export const tascRelations = relations(tasc, ({ many, one }) => ({
  trackMembers: many(trackMember),
  board: one(track, { fields: [tasc.trackId], references: [track.id] }),
}));

export const tascMember = pgTable("tasc_member", (d) => ({
  ...initialColumns,
  tascId: d
    .text()
    .references(() => tasc.id, { onDelete: "cascade" })
    .notNull(),
  trackMemberId: d
    .text()
    .references(() => trackMember.id, { onDelete: "cascade" })
    .notNull(),
  userId: d
    .text()
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
}));
