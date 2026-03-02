import { sqliteTable, text, integer, index, uniqueIndex } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { user } from "./auth";

export const clubs = sqliteTable(
  "clubs",
  {
    id: text("id").primaryKey(),
    ownerId: text("owner_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    location: text("location"),
    description: text("description"),
    imageUrl: text("image_url"),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("clubs_owner_id_idx").on(table.ownerId)],
);

export const clubMemberships = sqliteTable(
  "club_memberships",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    clubId: text("club_id")
      .notNull()
      .references(() => clubs.id, { onDelete: "cascade" }),
    role: text("role").notNull(),
    status: text("status").default("active").notNull(),
    joinedAt: integer("joined_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  },
  (table) => [
    uniqueIndex("club_memberships_user_club_uniq").on(table.userId, table.clubId),
    index("club_memberships_user_id_idx").on(table.userId),
    index("club_memberships_club_id_idx").on(table.clubId),
  ],
);
