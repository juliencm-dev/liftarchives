import { relations } from "drizzle-orm";
import { user, session, account } from "./auth";
import { clubs, clubMemberships } from "./clubs";
import { lifterProfile, coachProfile, coachLifters } from "./profiles";
import { lifts, liftTranslations } from "./lifts";
import {
  programs,
  programWeeks,
  programDays,
  programBlocks,
  programBlockMovements,
  programAssignments,
} from "./programs";
import {
  trainingSessions,
  sessionExercises,
  sessionSets,
  exerciseMedia,
} from "./sessions";
import { personalRecords } from "./records";
import { sessionComments } from "./comments";

// ── Auth ──

export const userRelations = relations(user, ({ one, many }) => ({
  sessions: many(session),
  accounts: many(account),
  lifterProfile: one(lifterProfile, {
    fields: [user.id],
    references: [lifterProfile.userId],
  }),
  coachProfile: one(coachProfile, {
    fields: [user.id],
    references: [coachProfile.userId],
  }),
  ownedClubs: many(clubs),
  clubMemberships: many(clubMemberships),
  createdLifts: many(lifts),
  createdPrograms: many(programs),
  programAssignments: many(programAssignments),
  trainingSessions: many(trainingSessions),
  personalRecords: many(personalRecords),
  sessionComments: many(sessionComments),
  uploadedMedia: many(exerciseMedia),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

// ── Clubs ──

export const clubsRelations = relations(clubs, ({ one, many }) => ({
  owner: one(user, {
    fields: [clubs.ownerId],
    references: [user.id],
  }),
  memberships: many(clubMemberships),
  lifterProfiles: many(lifterProfile),
  coachProfiles: many(coachProfile),
}));

export const clubMembershipsRelations = relations(
  clubMemberships,
  ({ one }) => ({
    user: one(user, {
      fields: [clubMemberships.userId],
      references: [user.id],
    }),
    club: one(clubs, {
      fields: [clubMemberships.clubId],
      references: [clubs.id],
    }),
  }),
);

// ── Profiles ──

export const lifterProfileRelations = relations(
  lifterProfile,
  ({ one, many }) => ({
    user: one(user, {
      fields: [lifterProfile.userId],
      references: [user.id],
    }),
    club: one(clubs, {
      fields: [lifterProfile.clubId],
      references: [clubs.id],
    }),
    coaches: many(coachLifters),
  }),
);

export const coachProfileRelations = relations(
  coachProfile,
  ({ one, many }) => ({
    user: one(user, {
      fields: [coachProfile.userId],
      references: [user.id],
    }),
    club: one(clubs, {
      fields: [coachProfile.clubId],
      references: [clubs.id],
    }),
    lifters: many(coachLifters),
  }),
);

export const coachLiftersRelations = relations(coachLifters, ({ one }) => ({
  coach: one(coachProfile, {
    fields: [coachLifters.coachId],
    references: [coachProfile.userId],
  }),
  lifter: one(lifterProfile, {
    fields: [coachLifters.lifterId],
    references: [lifterProfile.userId],
  }),
}));

// ── Lifts ──

export const liftsRelations = relations(lifts, ({ one, many }) => ({
  createdBy: one(user, {
    fields: [lifts.createdById],
    references: [user.id],
  }),
  parentLift: one(lifts, {
    fields: [lifts.parentLiftId],
    references: [lifts.id],
    relationName: "liftParent",
  }),
  variations: many(lifts, { relationName: "liftParent" }),
  translations: one(liftTranslations, {
    fields: [lifts.id],
    references: [liftTranslations.liftId],
  }),
  sessionExercises: many(sessionExercises),
  programBlockMovements: many(programBlockMovements),
  personalRecords: many(personalRecords),
}));

export const liftTranslationsRelations = relations(
  liftTranslations,
  ({ one }) => ({
    lift: one(lifts, {
      fields: [liftTranslations.liftId],
      references: [lifts.id],
    }),
  }),
);

// ── Programs ──

export const programsRelations = relations(programs, ({ one, many }) => ({
  createdBy: one(user, {
    fields: [programs.createdById],
    references: [user.id],
  }),
  weeks: many(programWeeks),
  assignments: many(programAssignments),
}));

export const programWeeksRelations = relations(
  programWeeks,
  ({ one, many }) => ({
    program: one(programs, {
      fields: [programWeeks.programId],
      references: [programs.id],
    }),
    days: many(programDays),
  }),
);

export const programDaysRelations = relations(
  programDays,
  ({ one, many }) => ({
    week: one(programWeeks, {
      fields: [programDays.weekId],
      references: [programWeeks.id],
    }),
    blocks: many(programBlocks),
    trainingSessions: many(trainingSessions),
  }),
);

export const programBlocksRelations = relations(
  programBlocks,
  ({ one, many }) => ({
    day: one(programDays, {
      fields: [programBlocks.dayId],
      references: [programDays.id],
    }),
    movements: many(programBlockMovements),
  }),
);

export const programBlockMovementsRelations = relations(
  programBlockMovements,
  ({ one }) => ({
    block: one(programBlocks, {
      fields: [programBlockMovements.blockId],
      references: [programBlocks.id],
    }),
    lift: one(lifts, {
      fields: [programBlockMovements.liftId],
      references: [lifts.id],
    }),
  }),
);

export const programAssignmentsRelations = relations(
  programAssignments,
  ({ one }) => ({
    program: one(programs, {
      fields: [programAssignments.programId],
      references: [programs.id],
    }),
    user: one(user, {
      fields: [programAssignments.userId],
      references: [user.id],
    }),
  }),
);

// ── Training Sessions ──

export const trainingSessionsRelations = relations(
  trainingSessions,
  ({ one, many }) => ({
    user: one(user, {
      fields: [trainingSessions.userId],
      references: [user.id],
    }),
    programDay: one(programDays, {
      fields: [trainingSessions.programDayId],
      references: [programDays.id],
    }),
    exercises: many(sessionExercises),
    comments: many(sessionComments),
  }),
);

export const sessionExercisesRelations = relations(
  sessionExercises,
  ({ one, many }) => ({
    session: one(trainingSessions, {
      fields: [sessionExercises.sessionId],
      references: [trainingSessions.id],
    }),
    lift: one(lifts, {
      fields: [sessionExercises.liftId],
      references: [lifts.id],
    }),
    sets: many(sessionSets),
    media: many(exerciseMedia),
  }),
);

export const sessionSetsRelations = relations(
  sessionSets,
  ({ one, many }) => ({
    exercise: one(sessionExercises, {
      fields: [sessionSets.sessionExerciseId],
      references: [sessionExercises.id],
    }),
    personalRecords: many(personalRecords),
  }),
);

export const exerciseMediaRelations = relations(exerciseMedia, ({ one }) => ({
  exercise: one(sessionExercises, {
    fields: [exerciseMedia.sessionExerciseId],
    references: [sessionExercises.id],
  }),
  uploadedBy: one(user, {
    fields: [exerciseMedia.uploadedById],
    references: [user.id],
  }),
}));

// ── Records ──

export const personalRecordsRelations = relations(
  personalRecords,
  ({ one }) => ({
    user: one(user, {
      fields: [personalRecords.userId],
      references: [user.id],
    }),
    lift: one(lifts, {
      fields: [personalRecords.liftId],
      references: [lifts.id],
    }),
    sessionSet: one(sessionSets, {
      fields: [personalRecords.sessionSetId],
      references: [sessionSets.id],
    }),
  }),
);

// ── Comments ──

export const sessionCommentsRelations = relations(
  sessionComments,
  ({ one }) => ({
    session: one(trainingSessions, {
      fields: [sessionComments.sessionId],
      references: [trainingSessions.id],
    }),
    user: one(user, {
      fields: [sessionComments.userId],
      references: [user.id],
    }),
  }),
);
