// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations } from "drizzle-orm";
import { index, pgTable, uniqueIndex } from "drizzle-orm/pg-core";
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

export type BoardRole = "member" | "creator";

/** ## Board Member */
export const boardMember = pgTable(
  "board_member",
  (d) => ({
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
    role: d.text().$type<BoardRole>().notNull().default("member"),
  }),
  (t) => [uniqueIndex().on(t.boardId, t.userId)],
);

export const boardMemberRelations = relations(boardMember, ({ one }) => ({
  user: one(user, { fields: [boardMember.userId], references: [user.id] }),
  board: one(board, { fields: [boardMember.boardId], references: [board.id] }),
}));

export const CreateBoardSchema = createInsertSchema(board, {
  name: z.string().min(3, "Board name cannot be less than 3 characters"),
})
  .omit({ organizationId: true })
  .and(z.object({ membersUserIds: z.array(z.string()) }));

export const UpdateBoardSchema = createUpdateSchema(board, {
  name: z.string().min(1, "Board name can not be empty"),
  id: z.string().min(1),
})
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .and(z.object({ boardMembersUserIds: z.array(z.string()) }));

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
}).and(z.object({ membersUserIds: z.array(z.string()) }));

export const UpdateTrackSchema = createUpdateSchema(track, {
  name: z.string().min(3, "Track name can not be empty"),
  id: z.string().min(1),
})
  .omit({
    boardId: true,
    createdAt: true,
    updatedAt: true,
  })
  .and(z.object({ trackMembersUserIds: z.array(z.string()) }));

export type TrackRole = "member" | "creator" | "leader";

/** ## Track Member */
export const trackMember = pgTable(
  "track_member",
  (d) => ({
    ...initialColumns,
    trackId: d
      .text()
      .references(() => track.id, {
        onDelete: "cascade",
      })
      .notNull(),
    userId: d
      .text()
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    role: d.text().$type<TrackRole>().notNull().default("member"),
  }),
  (t) => [uniqueIndex().on(t.trackId, t.userId)],
);

export const trackMemberRelations = relations(trackMember, ({ one }) => ({
  track: one(track, { fields: [trackMember.trackId], references: [track.id] }),
  user: one(user, { fields: [trackMember.userId], references: [user.id] }),
}));

/** Tasc */

export type TascStatus = "todo" | "in_progress" | "completed" | "verified";

export type TascPriority = "no_priority" | "urgent" | "high" | "medium" | "low";

export type TascRole = "creator" | "member";

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
    priority: d.text().$type<TascPriority>().notNull().default("no_priority"),
    createdBy: d
      .text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  }),
  (t) => [index().on(t.name), uniqueIndex().on(t.trackId, t.faceId)],
);

export const tascRelations = relations(tasc, ({ many, one }) => ({
  tascMembers: many(tascMember),
  track: one(track, { fields: [tasc.trackId], references: [track.id] }),
  createdByUser: one(user, { fields: [tasc.createdBy], references: [user.id] }),
}));

export const tascMember = pgTable(
  "tasc_member",
  (d) => ({
    ...initialColumns,
    tascId: d
      .text()
      .references(() => tasc.id, { onDelete: "cascade" })
      .notNull(),
    userId: d
      .text()
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
  }),
  (t) => [uniqueIndex().on(t.tascId, t.userId)],
);

export const tascMemberRelations = relations(tascMember, ({ one }) => ({
  tasc: one(tasc, { fields: [tascMember.tascId], references: [tasc.id] }),
  user: one(user, { fields: [tascMember.userId], references: [user.id] }),
}));

export const CreateTascSchema = createInsertSchema(tasc, {
  name: z.string().min(3, "Tasc title cannot be less than 3 characters"),
  trackId: z.string().min(1, "Track Id is required to create tasc"),
  status: z.custom<TascStatus>(),
  priority: z.custom<TascPriority>(),
  description: z.string().trim().optional(),
})
  .omit({ faceId: true, createdBy: true, completedAt: true, startedAt: true })
  .and(z.object({ membersUserIds: z.array(z.string()) }));

export const UpdateTascSchema = createUpdateSchema(tasc, {
  name: z.string().min(3, "Tasc title can not be empty"),
  faceId: z.string().min(1, "Face ID is required"),
  trackId: z.string().min(1, "Track ID is required"),
})
  .omit({
    status: true,
    createdAt: true,
    updatedAt: true,
    id: true,
    createdBy: true,
    priority: true,
    startedAt: true,
    completedAt: true,
  })
  .and(z.object({ tascMembersUserIds: z.array(z.string()).optional() }));

export type TascActivityAction =
  | "created"
  | "status_changed"
  | "priority_changed"
  | "due_changed"
  | "title_chaged"
  | "assigned";

export type TascActivityReason =
  | {
      action: "created";
      payload: {
        status: TascStatus;
        priority: TascPriority;
        due?: { startDate?: Date | null; endDate?: Date | null };
        assignedTo?: string[];
      };
    }
  | {
      action: "status_changed";
      payload: { from: TascStatus; to: TascStatus };
    }
  | {
      action: "priority_changed";
      payload: { from: TascPriority; to: TascPriority };
    }
  | {
      action: "due_changed";
      payload: { setTo: { startDate?: Date | null; endDate?: Date | null } };
    }
  | {
      action: "title_changed";
      payload: { to: string };
    }
  | {
      action: "member_assigned";
      payload: { userId: string };
    }
  | {
      action: "member_removed";
      payload: { userId: string };
    };

export type ActivityPayloadByAction<T extends TascActivityAction> = Extract<
  TascActivityReason,
  { action: T }
>["payload"];

// TODO:
export const tascActivity = pgTable("tasc_activity", (d) => ({
  ...initialColumns,
  tascId: d
    .text()
    .references(() => tasc.id, { onDelete: "cascade" })
    .notNull(),
  performedBy: d.text().references(() => user.id, { onDelete: "set null" }),
  reason: d.jsonb().$type<TascActivityReason>().notNull(),
}));

export const tascActivityRelations = relations(tascActivity, ({ one }) => ({
  performedByUser: one(user, {
    fields: [tascActivity.performedBy],
    references: [user.id],
  }),
  tasc: one(tasc, { fields: [tascActivity.tascId], references: [tasc.id] }),
}));
