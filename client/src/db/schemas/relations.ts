import { relations } from 'drizzle-orm';
import { users, usersInformations, usersLifts, userTrackedLifts } from './users';
import { lifts, liftsEstimates } from './lifts';

export const usersInformationsRelations = relations(usersInformations, ({ one }) => ({
    user: one(users, {
        fields: [usersInformations.userId],
        references: [users.id],
    }),
}));

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

export const userTrackedLiftsRelations = relations(userTrackedLifts, ({ one }) => ({
    user: one(users, {
        fields: [userTrackedLifts.userId],
        references: [users.id],
    }),
    lift: one(lifts, {
        fields: [userTrackedLifts.liftId],
        references: [lifts.id],
    }),
}));

export const liftsEstimatesRelations = relations(liftsEstimates, ({ one }) => ({
    lift: one(lifts, {
        fields: [liftsEstimates.liftId],
        references: [lifts.id],
    }),
    liftForCalculation: one(lifts, {
        fields: [liftsEstimates.liftForCalculationId],
        references: [lifts.id],
    }),
}));
