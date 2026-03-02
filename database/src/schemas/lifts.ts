import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { user } from './auth';

export const lifts = sqliteTable(
    'lifts',
    {
        id: text('id').primaryKey(),
        name: text('name').notNull(),
        description: text('description'),
        category: text('category').notNull(),
        isCore: integer('is_core', { mode: 'boolean' }).default(false).notNull(),
        parentLiftId: text('parent_lift_id'),
        createdById: text('created_by_id').references(() => user.id, {
            onDelete: 'set null',
        }),
        createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
        updatedAt: integer('updated_at', { mode: 'timestamp' })
            .default(sql`(unixepoch())`)
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        index('lifts_created_by_id_idx').on(table.createdById),
        index('lifts_parent_lift_id_idx').on(table.parentLiftId),
    ]
);

export const competitionCategories = sqliteTable('competition_categories', {
    id: text('id').primaryKey(),
    name: text('name').notNull().unique(),
    qualifyingTotal: integer('qualifying_total'),
    minDateOfBirth: text('min_date_of_birth').notNull(),
    maxDateOfBirth: text('max_date_of_birth'),
    minWeight: real('min_weight').notNull(),
    maxWeight: real('max_weight'),
    gender: text('gender').notNull(),
    division: text('division').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
        .default(sql`(unixepoch())`)
        .$onUpdate(() => new Date())
        .notNull(),
});

// Stores display names per language — lifts.name remains the internal key
export const liftTranslations = sqliteTable('lift_translations', {
    id: text('id').primaryKey(),
    liftId: text('lift_id')
        .notNull()
        .references(() => lifts.id, { onDelete: 'cascade' })
        .unique(),
    en: text('en').notNull(),
    fr: text('fr').notNull(),
});
