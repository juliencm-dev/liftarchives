const STORAGE_KEY = 'liftarchives:active-session';

export interface LocalSet {
    localId: string;
    weight: number; // always kg
    reps: number;
    setType: 'warmup' | 'working' | 'backoff' | 'dropset' | 'amrap';
    feedback?: 'hard' | 'normal' | 'easy';
    rpe?: number;
    loggedAt: string; // ISO timestamp
}

export interface LocalExerciseData {
    exerciseId: string; // server-side session_exercise ID
    liftId: string;
    liftName: string;
    liftCategory: string;
    programBlockId: string | null;
    targetSets: number;
    targetReps: number;
    upToPercent: number | null;
    oneRepMax: number | null; // 1RM of parent lift (olympic) or self
    sets: LocalSet[];
}

export interface LocalSessionData {
    sessionId: string;
    title: string | null;
    startedAt: string;
    exercises: LocalExerciseData[];
    currentExerciseIndex: number;
}

export function getLocalSession(): LocalSessionData | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as LocalSessionData;
    } catch {
        return null;
    }
}

export function saveLocalSession(data: LocalSessionData): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearLocalSession(): void {
    localStorage.removeItem(STORAGE_KEY);
}

export function addLocalSet(
    exerciseIndex: number,
    set: Omit<LocalSet, 'localId' | 'loggedAt'>
): LocalSessionData | null {
    const session = getLocalSession();
    if (!session) return null;

    const exercise = session.exercises[exerciseIndex];
    if (!exercise) return null;

    exercise.sets.push({
        ...set,
        localId: crypto.randomUUID(),
        loggedAt: new Date().toISOString(),
    });

    saveLocalSession(session);
    return session;
}

export function removeLocalSet(exerciseIndex: number, localId: string): LocalSessionData | null {
    const session = getLocalSession();
    if (!session) return null;

    const exercise = session.exercises[exerciseIndex];
    if (!exercise) return null;

    exercise.sets = exercise.sets.filter((s) => s.localId !== localId);

    saveLocalSession(session);
    return session;
}

export function setCurrentExercise(index: number): LocalSessionData | null {
    const session = getLocalSession();
    if (!session) return null;

    session.currentExerciseIndex = index;
    saveLocalSession(session);
    return session;
}
