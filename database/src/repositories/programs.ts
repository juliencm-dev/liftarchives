import { eq, and, asc } from "drizzle-orm";
import {
  programs,
  programWeeks,
  programDays,
  programBlocks,
  programBlockMovements,
  programAssignments,
} from "../schemas";
import type { CreateProgramData } from "@liftarchives/shared";
import type { DbClient } from "./types";

type ProgramAssignmentRow = typeof programAssignments.$inferSelect;

// D1 does not support BEGIN/COMMIT transactions.
// We use db.batch() for atomic multi-statement operations instead.
// The type assertion is needed because Drizzle's batch() expects a readonly
// tuple with >=2 items, but we build dynamic arrays.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyBatchItem = any;

export async function getUserPrograms(dbClient: DbClient, userId: string) {
  return dbClient.query.programs.findMany({
    where: eq(programs.createdById, userId),
    orderBy: asc(programs.createdAt),
    with: {
      weeks: {
        with: {
          days: true,
        },
      },
    },
  });
}

export async function getProgramById(dbClient: DbClient, programId: string) {
  return dbClient.query.programs.findFirst({
    where: eq(programs.id, programId),
    with: {
      weeks: {
        orderBy: asc(programWeeks.weekNumber),
        with: {
          days: {
            orderBy: asc(programDays.dayNumber),
            with: {
              blocks: {
                orderBy: asc(programBlocks.displayOrder),
                with: {
                  movements: {
                    orderBy: asc(programBlockMovements.displayOrder),
                    with: {
                      lift: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
}

/** Collects insert statements for a day's blocks and movements (for batch). */
function collectDayBlockStatements(
  dbClient: DbClient,
  dayId: string,
  day: CreateProgramData["weeks"][number]["days"][number],
): AnyBatchItem[] {
  const stmts: AnyBatchItem[] = [];

  for (let blockIdx = 0; blockIdx < day.blocks.length; blockIdx++) {
    const block = day.blocks[blockIdx];
    const blockId = crypto.randomUUID();

    stmts.push(
      dbClient.insert(programBlocks).values({
        id: blockId,
        dayId,
        displayOrder: blockIdx + 1,
        sets: block.sets,
        reps: block.reps,
        upTo: block.upTo ?? false,
        upToPercent: block.upToPercent,
        upToRpe: block.upToRpe,
        setDetails: block.setDetails ?? null,
        notes: block.notes,
      }),
    );

    for (let movIdx = 0; movIdx < block.movements.length; movIdx++) {
      const movement = block.movements[movIdx];
      stmts.push(
        dbClient.insert(programBlockMovements).values({
          id: crypto.randomUUID(),
          blockId,
          liftId: movement.liftId,
          displayOrder: movIdx + 1,
          reps: movement.reps,
        }),
      );
    }
  }

  return stmts;
}

export async function createProgram(
  dbClient: DbClient,
  userId: string,
  data: CreateProgramData,
) {
  const newProgramId = crypto.randomUUID();
  const stmts: AnyBatchItem[] = [];

  stmts.push(
    dbClient.insert(programs).values({
      id: newProgramId,
      createdById: userId,
      name: data.name,
      description: data.description,
      durationWeeks: data.weeks.length,
    }),
  );

  for (let weekIdx = 0; weekIdx < data.weeks.length; weekIdx++) {
    const week = data.weeks[weekIdx];
    const weekId = crypto.randomUUID();
    stmts.push(
      dbClient.insert(programWeeks).values({
        id: weekId,
        programId: newProgramId,
        weekNumber: weekIdx + 1,
        name: week.name,
      }),
    );

    for (let i = 0; i < week.days.length; i++) {
      const day = week.days[i];
      const dayId = crypto.randomUUID();
      stmts.push(
        dbClient.insert(programDays).values({
          id: dayId,
          weekId,
          dayNumber: i + 1,
          name: day.name,
        }),
      );

      stmts.push(...collectDayBlockStatements(dbClient, dayId, day));
    }
  }

  await (dbClient.batch as (s: AnyBatchItem[]) => Promise<unknown[]>)(stmts);

  return getProgramById(dbClient, newProgramId);
}

export async function updateProgram(
  dbClient: DbClient,
  userId: string,
  programId: string,
  data: CreateProgramData,
) {
  // Verify ownership first
  const existing = await dbClient.query.programs.findFirst({
    where: and(eq(programs.id, programId), eq(programs.createdById, userId)),
    with: { weeks: true },
  });

  if (!existing) return null;

  const stmts: AnyBatchItem[] = [];

  // Update program metadata
  stmts.push(
    dbClient
      .update(programs)
      .set({
        name: data.name,
        description: data.description,
        durationWeeks: data.weeks.length,
      })
      .where(eq(programs.id, programId)),
  );

  // Delete existing weeks (cascade deletes days, blocks, movements)
  for (const week of existing.weeks) {
    stmts.push(
      dbClient.delete(programWeeks).where(eq(programWeeks.id, week.id)),
    );
  }

  // Re-insert full tree with all weeks
  for (let weekIdx = 0; weekIdx < data.weeks.length; weekIdx++) {
    const week = data.weeks[weekIdx];
    const weekId = crypto.randomUUID();
    stmts.push(
      dbClient.insert(programWeeks).values({
        id: weekId,
        programId,
        weekNumber: weekIdx + 1,
        name: week.name,
      }),
    );

    for (let i = 0; i < week.days.length; i++) {
      const day = week.days[i];
      const dayId = crypto.randomUUID();
      stmts.push(
        dbClient.insert(programDays).values({
          id: dayId,
          weekId,
          dayNumber: i + 1,
          name: day.name,
        }),
      );

      stmts.push(...collectDayBlockStatements(dbClient, dayId, day));
    }
  }

  await (dbClient.batch as (s: AnyBatchItem[]) => Promise<unknown[]>)(stmts);

  return getProgramById(dbClient, programId);
}

export async function deleteProgram(
  dbClient: DbClient,
  userId: string,
  programId: string,
) {
  const [result] = await dbClient
    .delete(programs)
    .where(and(eq(programs.id, programId), eq(programs.createdById, userId)))
    .returning();
  return result;
}

export async function getActiveAssignment(
  dbClient: DbClient,
  userId: string,
) {
  return dbClient.query.programAssignments.findFirst({
    where: and(
      eq(programAssignments.userId, userId),
      eq(programAssignments.status, "active"),
    ),
    with: {
      program: {
        with: {
          weeks: {
            orderBy: asc(programWeeks.weekNumber),
            with: {
              days: {
                orderBy: asc(programDays.dayNumber),
                with: {
                  blocks: {
                    orderBy: asc(programBlocks.displayOrder),
                    with: {
                      movements: {
                        orderBy: asc(programBlockMovements.displayOrder),
                        with: {
                          lift: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function assignProgram(
  dbClient: DbClient,
  userId: string,
  programId: string,
  startDate?: string,
) {
  // Verify the program belongs to this user
  const program = await dbClient.query.programs.findFirst({
    where: and(eq(programs.id, programId), eq(programs.createdById, userId)),
    columns: { id: true },
  });
  if (!program) return null;

  // Deactivate any existing active assignment
  const existing = await dbClient.query.programAssignments.findFirst({
    where: and(
      eq(programAssignments.userId, userId),
      eq(programAssignments.status, "active"),
    ),
  });

  const stmts: AnyBatchItem[] = [];

  if (existing) {
    stmts.push(
      dbClient
        .update(programAssignments)
        .set({ status: "completed" })
        .where(eq(programAssignments.id, existing.id)),
    );
  }

  // Delete any existing assignment for this specific program+user combo
  stmts.push(
    dbClient
      .delete(programAssignments)
      .where(
        and(
          eq(programAssignments.userId, userId),
          eq(programAssignments.programId, programId),
        ),
      ),
  );

  const newAssignmentId = crypto.randomUUID();
  stmts.push(
    dbClient
      .insert(programAssignments)
      .values({
        id: newAssignmentId,
        programId,
        userId,
        startDate: startDate || null,
        status: "active",
        currentWeekNumber: 1,
        currentCycle: 1,
        currentWeekStartedAt: new Date(),
      }),
  );

  await (dbClient.batch as (s: AnyBatchItem[]) => Promise<unknown[]>)(stmts);

  // Read back the inserted assignment
  return dbClient.query.programAssignments.findFirst({
    where: eq(programAssignments.id, newAssignmentId),
  });
}

export async function assignProgramToLifter(
  dbClient: DbClient,
  coachId: string,
  programId: string,
  lifterId: string,
  startDate?: string,
) {
  // Verify the program belongs to the coach
  const program = await dbClient.query.programs.findFirst({
    where: and(eq(programs.id, programId), eq(programs.createdById, coachId)),
    columns: { id: true },
  });
  if (!program) return null;

  // Deactivate any existing active assignment for the lifter
  const existing = await dbClient.query.programAssignments.findFirst({
    where: and(
      eq(programAssignments.userId, lifterId),
      eq(programAssignments.status, "active"),
    ),
  });

  const stmts: AnyBatchItem[] = [];

  if (existing) {
    stmts.push(
      dbClient
        .update(programAssignments)
        .set({ status: "completed" })
        .where(eq(programAssignments.id, existing.id)),
    );
  }

  // Delete any existing assignment for this specific program+lifter combo
  stmts.push(
    dbClient
      .delete(programAssignments)
      .where(
        and(
          eq(programAssignments.userId, lifterId),
          eq(programAssignments.programId, programId),
        ),
      ),
  );

  const newAssignmentId = crypto.randomUUID();
  stmts.push(
    dbClient
      .insert(programAssignments)
      .values({
        id: newAssignmentId,
        programId,
        userId: lifterId,
        assignedById: coachId,
        startDate: startDate || null,
        status: "active",
        currentWeekNumber: 1,
        currentCycle: 1,
        currentWeekStartedAt: new Date(),
      }),
  );

  await (dbClient.batch as (s: AnyBatchItem[]) => Promise<unknown[]>)(stmts);

  return dbClient.query.programAssignments.findFirst({
    where: eq(programAssignments.id, newAssignmentId),
  });
}

export async function advanceWeekIfComplete(
  dbClient: DbClient,
  assignment: ProgramAssignmentRow & {
    program: {
      durationWeeks: number;
      weeks: { weekNumber: number; days: { id: string }[] }[];
    };
  },
  completedDayIds: string[],
): Promise<{
  advanced: boolean;
  newWeekNumber?: number;
  newCycle?: number;
}> {
  // Find the current week by weekNumber
  const week = assignment.program.weeks.find(
    (w) => w.weekNumber === assignment.currentWeekNumber,
  );
  if (!week) return { advanced: false };

  const weekDayIds = week.days.map((d) => d.id);
  const allComplete = weekDayIds.every((id) => completedDayIds.includes(id));

  if (!allComplete) return { advanced: false };

  let newWeekNumber: number;
  let newCycle: number;

  if (assignment.currentWeekNumber < assignment.program.durationWeeks) {
    newWeekNumber = assignment.currentWeekNumber + 1;
    newCycle = assignment.currentCycle;
  } else {
    newWeekNumber = 1;
    newCycle = assignment.currentCycle + 1;
  }

  await dbClient
    .update(programAssignments)
    .set({
      currentWeekNumber: newWeekNumber,
      currentCycle: newCycle,
      currentWeekStartedAt: new Date(),
    })
    .where(eq(programAssignments.id, assignment.id));

  return { advanced: true, newWeekNumber, newCycle };
}

export async function unassignProgram(
  dbClient: DbClient,
  userId: string,
  programId: string,
) {
  const [result] = await dbClient
    .update(programAssignments)
    .set({ status: "completed" })
    .where(
      and(
        eq(programAssignments.userId, userId),
        eq(programAssignments.programId, programId),
        eq(programAssignments.status, "active"),
      ),
    )
    .returning();
  return result;
}
