import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import { text, timestamp } from "drizzle-orm/pg-core";

/**
 * ## Initial Columns
 *
 * This object contains the crucial columns for any schema def.
 * @contains
 * ```ts
  id: text().primaryKey().$defaultFn(() => createId()),
  createdAt: timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp({ withTimezone: true }).$onUpdate(() => new Date())
 */
export const initialColumns = {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  createdAt: timestamp({ withTimezone: true, mode: "date" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp({ withTimezone: true, mode: "date" }).$onUpdate(
    () => new Date(),
  ),
};

/**
 * ## Due Date Columns
 *
 * This object contains the column def. to define due start and end date of entity
 * @contains
 * ```ts
 * startDate: timestamp({ mode: "date", withTimezone: true })
 * endDate: timestamp({ mode: "date", withTimezone: true })
 */
export const dueDateColumns = {
  startDate: timestamp({ mode: "date", withTimezone: true }),
  endDate: timestamp({ mode: "date", withTimezone: true }),
};
