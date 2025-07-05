import { boolean, doublePrecision, integer, pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const lifts = pgTable('lifts', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => createId()),
    name: text('name'),
    description: text('description'),
    category: text('category'),
    benchmark: boolean('benchmark').default(false),
});

export const liftsEstimates = pgTable(
    'liftsEstimates',
    {
        liftId: text('liftId')
            .notNull()
            .references(() => lifts.id, { onDelete: 'cascade' }),
        liftForCalculationId: text('liftForCalculationId')
            .notNull()
            .references(() => lifts.id, { onDelete: 'cascade' }),
        percentage: doublePrecision('percentage').notNull(),
        description: text('description').notNull(),
    },
    (table) => {
        return {
            pk: primaryKey({ columns: [table.liftId, table.liftForCalculationId] }),
        };
    }
);

export const competitionCategoriesDetails = pgTable('competitionCategoriesDetails', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => createId()),
    name: text('name').notNull().unique(),
    total: doublePrecision('total'),
    minBirthYear: integer('minBirthDate').notNull(),
    maxBirthYear: integer('maxBirthDate'),
    minWeight: integer('minWeight').notNull(),
    maxWeight: integer('maxWeight'),
    gender: text('gender').notNull(),
    division: text('division').notNull(),
});

export type Lift = typeof lifts.$inferSelect;
export type LiftEstimate = typeof liftsEstimates.$inferSelect;
export type CompetitionCategoryDetails = typeof competitionCategoriesDetails.$inferSelect;
