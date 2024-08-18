import { relations } from "drizzle-orm";
import { users, usersInformations, usersLifts } from "./users";
import { lifts } from "./lifts";

export const usersInformationsRelations = relations(
  usersInformations,
  ({ one }) => ({
    user: one(users, {
      fields: [usersInformations.userId],
      references: [users.id],
    }),
  })
);

export const usersLiftsRelations = relations(usersLifts, ({ one }) => ({
  user: one(users, {
    fields: [usersLifts.userId],
    references: [users.id],
  }),
  lift: one(lifts, {
    fields: [usersLifts.liftId],
    references: [lifts.id],
  }),
}));
