import { pgTable, text, timestamp, index, unique } from "drizzle-orm/pg-core";
import { user } from "./auth";
import {
  clubMembershipRoleEnum,
  clubMembershipStatusEnum,
} from "./enums";

export const clubs = pgTable(
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
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("clubs_owner_id_idx").on(table.ownerId)],
);

export const clubMemberships = pgTable(
  "club_memberships",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    clubId: text("club_id")
      .notNull()
      .references(() => clubs.id, { onDelete: "cascade" }),
    role: clubMembershipRoleEnum("role").notNull(),
    status: clubMembershipStatusEnum("status").default("active").notNull(),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (table) => [
    unique("club_memberships_user_club_uniq").on(table.userId, table.clubId),
    index("club_memberships_user_id_idx").on(table.userId),
    index("club_memberships_club_id_idx").on(table.clubId),
  ],
);
