import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { trainingSessions } from "./sessions";

export const sessionComments = pgTable(
  "session_comments",
  {
    id: text("id").primaryKey(),
    sessionId: text("session_id")
      .notNull()
      .references(() => trainingSessions.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("session_comments_session_id_idx").on(table.sessionId),
    index("session_comments_user_id_idx").on(table.userId),
  ],
);
