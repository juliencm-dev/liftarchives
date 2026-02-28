import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(import.meta.dirname, '../../server/.env') });
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq } from 'drizzle-orm';
import { lifts } from './schemas';
import { liftTranslations } from './schemas'; // adjust path as needed

const DATABASE_URL = process.env.NODE_ENV === 'production' ? process.env.DATABASE_URL! : process.env.DATABASE_URL_DEV!;

const pool = new Pool({ connectionString: DATABASE_URL });
const db = drizzle(pool);

type LiftSeed = {
    name: string; // internal key (never shown to users)
    en: string; // English display name
    fr: string; // French display name
    category: 'olympic' | 'powerlifting' | 'accessory' | 'crossfit' | 'strongman' | 'hybrid' | 'hyrox';
    isCore: boolean;
};

// Core lifts appear on the Lifts page by default
// Non-core lifts are available in the exercise picker only
const ALL_LIFTS: LiftSeed[] = [
    // ═══════════════════════════════════════════
    // OLYMPIC WEIGHTLIFTING
    // ═══════════════════════════════════════════

    // ── Core competition lifts ──────────────────
    { name: 'Snatch', en: 'Snatch', fr: 'Arraché', category: 'olympic', isCore: true },
    { name: 'Clean & Jerk', en: 'Clean & Jerk', fr: 'Épaulé-jeté', category: 'olympic', isCore: true },
    { name: 'Clean', en: 'Clean', fr: 'Épaulé', category: 'olympic', isCore: true },
    { name: 'Jerk', en: 'Jerk', fr: 'Jeté', category: 'olympic', isCore: true },
    { name: 'Power Clean', en: 'Power Clean', fr: 'Épaulé en puissance', category: 'olympic', isCore: true },
    { name: 'Power Snatch', en: 'Power Snatch', fr: 'Arraché en puissance', category: 'olympic', isCore: true },

    // ── Snatch — Hang variations (by position) ──
    { name: 'Hang Snatch', en: 'Hang Snatch', fr: 'Arraché suspendu', category: 'olympic', isCore: false },
    {
        name: 'High-Hang Snatch',
        en: 'High-Hang Snatch',
        fr: 'Arraché suspendu haut',
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Below Knee Hang Snatch',
        en: 'Below Knee Hang Snatch',
        fr: 'Arraché suspendu sous le genou',
        category: 'olympic',
        isCore: false,
    },
    { name: 'Floating Snatch', en: 'Floating Snatch', fr: 'Arraché flottant', category: 'olympic', isCore: false },
    { name: 'Hip Snatch', en: 'Hip Snatch', fr: 'Arraché à la hanche', category: 'olympic', isCore: false },
    {
        name: 'Hang Power Snatch',
        en: 'Hang Power Snatch',
        fr: 'Arraché en puissance suspendu',
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'High-Hang Power Snatch',
        en: 'High-Hang Power Snatch',
        fr: 'Arraché en puissance suspendu haut',
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Below Knee Hang Power Snatch',
        en: 'Below Knee Hang Power Snatch',
        fr: 'Arraché en puissance suspendu sous le genou',
        category: 'olympic',
        isCore: false,
    },

    // ── Snatch — Technique / Turnover drills ────
    { name: 'Tall Snatch', en: 'Tall Snatch', fr: 'Arraché debout', category: 'olympic', isCore: false },
    { name: 'Dip Snatch', en: 'Dip Snatch', fr: 'Arraché en plongeon', category: 'olympic', isCore: false },
    { name: 'Muscle Snatch', en: 'Muscle Snatch', fr: 'Arraché muscle', category: 'olympic', isCore: false },
    {
        name: 'Dip Muscle Snatch',
        en: 'Dip Muscle Snatch',
        fr: 'Arraché muscle en plongeon',
        category: 'olympic',
        isCore: false,
    },
    { name: 'Drop Snatch', en: 'Drop Snatch', fr: 'Arraché tombé', category: 'olympic', isCore: false },
    { name: 'Snatch Balance', en: 'Snatch Balance', fr: "Équilibre d'arraché", category: 'olympic', isCore: false },
    {
        name: 'Heaving Snatch Balance',
        en: 'Heaving Snatch Balance',
        fr: "Équilibre d'arraché avec élan",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Pressing Snatch Balance',
        en: 'Pressing Snatch Balance',
        fr: "Équilibre d'arraché en pressé",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Snatch from Power Position',
        en: 'Snatch from Power Position',
        fr: 'Arraché depuis la position de puissance',
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Power Snatch from Power Position',
        en: 'Power Snatch from Power Position',
        fr: 'Arraché en puissance depuis la position de puissance',
        category: 'olympic',
        isCore: false,
    },
    { name: 'No Feet Snatch', en: 'No Feet Snatch', fr: 'Arraché sans pieds', category: 'olympic', isCore: false },
    {
        name: 'Clean Grip Snatch',
        en: 'Clean Grip Snatch',
        fr: "Arraché prise d'épaulé",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Snatch Grip Push Press',
        en: 'Snatch Grip Push Press',
        fr: "Poussé pressé prise d'arraché",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Snatch Grip Behind the Neck Push Press',
        en: 'Snatch Grip Behind the Neck Push Press',
        fr: "Poussé pressé derrière la nuque prise d'arraché",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Sots Press (Snatch Grip)',
        en: 'Sots Press (Snatch Grip)',
        fr: "Sots Press (prise d'arraché)",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Snatch Push Press + Overhead Squat',
        en: 'Snatch Push Press + Overhead Squat',
        fr: "Poussé pressé d'arraché + squat overhead",
        category: 'olympic',
        isCore: false,
    },

    // ── Snatch — Multi-position ─────────────────
    {
        name: '2-Position Snatch',
        en: '2-Position Snatch',
        fr: 'Arraché 2 positions',
        category: 'olympic',
        isCore: false,
    },
    {
        name: '3-Position Snatch',
        en: '3-Position Snatch',
        fr: 'Arraché 3 positions',
        category: 'olympic',
        isCore: false,
    },
    {
        name: '2-Position Power Snatch',
        en: '2-Position Power Snatch',
        fr: 'Arraché en puissance 2 positions',
        category: 'olympic',
        isCore: false,
    },
    {
        name: '3-Position Power Snatch',
        en: '3-Position Power Snatch',
        fr: 'Arraché en puissance 3 positions',
        category: 'olympic',
        isCore: false,
    },

    // ── Snatch — Block variations ───────────────
    { name: 'Block Snatch', en: 'Block Snatch', fr: 'Arraché depuis les blocs', category: 'olympic', isCore: false },
    {
        name: 'Block Power Snatch',
        en: 'Block Power Snatch',
        fr: 'Arraché en puissance depuis les blocs',
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Snatch from Blocks',
        en: 'Snatch from Blocks',
        fr: 'Arraché depuis les blocs',
        category: 'olympic',
        isCore: false,
    },

    // ── Snatch — Riser / Deficit ────────────────
    { name: 'Snatch on Riser', en: 'Snatch on Riser', fr: 'Arraché sur cale', category: 'olympic', isCore: false },
    { name: 'Deficit Snatch', en: 'Deficit Snatch', fr: 'Arraché en déficit', category: 'olympic', isCore: false },
    {
        name: 'Power Snatch on Riser',
        en: 'Power Snatch on Riser',
        fr: 'Arraché en puissance sur cale',
        category: 'olympic',
        isCore: false,
    },

    // ── Snatch — Tempo / Paused ─────────────────
    { name: 'Paused Snatch', en: 'Paused Snatch', fr: 'Arraché avec pause', category: 'olympic', isCore: false },
    { name: 'Slow Pull Snatch', en: 'Slow Pull Snatch', fr: 'Arraché tirage lent', category: 'olympic', isCore: false },
    {
        name: 'Pause at Knee Snatch',
        en: 'Pause at Knee Snatch',
        fr: 'Arraché avec pause au genou',
        category: 'olympic',
        isCore: false,
    },

    // ── Snatch — Pull variations ────────────────
    { name: 'Snatch Pull', en: 'Snatch Pull', fr: "Tirage d'arraché", category: 'olympic', isCore: false },
    {
        name: 'Snatch High Pull',
        en: 'Snatch High Pull',
        fr: "Tirage haut d'arraché",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Snatch Speed Pull (Panda Pull)',
        en: 'Snatch Speed Pull (Panda Pull)',
        fr: "Tirage rapide d'arraché (Panda Pull)",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Snatch Segment Pull',
        en: 'Snatch Segment Pull',
        fr: "Tirage segmenté d'arraché",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Snatch Pull to Hold',
        en: 'Snatch Pull to Hold',
        fr: "Tirage d'arraché avec maintien",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Snatch Pull to Hip',
        en: 'Snatch Pull to Hip',
        fr: "Tirage d'arraché à la hanche",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Flat-Footed Snatch Pull',
        en: 'Flat-Footed Snatch Pull',
        fr: "Tirage d'arraché pieds à plat",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Flat-Footed Snatch Pull to Hold',
        en: 'Flat-Footed Snatch Pull to Hold',
        fr: "Tirage d'arraché pieds à plat avec maintien",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Floating Snatch Pull',
        en: 'Floating Snatch Pull',
        fr: "Tirage d'arraché flottant",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Snatch Pull on Riser',
        en: 'Snatch Pull on Riser',
        fr: "Tirage d'arraché sur cale",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Snatch High Pull on Riser',
        en: 'Snatch High Pull on Riser',
        fr: "Tirage haut d'arraché sur cale",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Block Snatch Pull',
        en: 'Block Snatch Pull',
        fr: "Tirage d'arraché depuis les blocs",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Block Snatch Pull to Hold',
        en: 'Block Snatch Pull to Hold',
        fr: "Tirage d'arraché depuis les blocs avec maintien",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Block Snatch High Pull',
        en: 'Block Snatch High Pull',
        fr: "Tirage haut d'arraché depuis les blocs",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Dip Snatch Pull',
        en: 'Dip Snatch Pull',
        fr: "Tirage d'arraché en plongeon",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Snatch Lasha Pull (Short Pull)',
        en: 'Snatch Lasha Pull (Short Pull)',
        fr: "Tirage court d'arraché (Lasha Pull)",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Snatch Stage Pull',
        en: 'Snatch Stage Pull',
        fr: "Tirage d'arraché par étapes",
        category: 'olympic',
        isCore: false,
    },

    // ── Snatch — Deadlift variations ────────────
    {
        name: 'Snatch Deadlift',
        en: 'Snatch Deadlift',
        fr: "Soulevé de terre d'arraché",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Snatch Grip Deadlift',
        en: 'Snatch Grip Deadlift',
        fr: "Soulevé de terre prise d'arraché",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Snatch Deadlift on Riser',
        en: 'Snatch Deadlift on Riser',
        fr: "Soulevé de terre d'arraché sur cale",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Snatch Deadlift to Power Position',
        en: 'Snatch Deadlift to Power Position',
        fr: "Soulevé de terre d'arraché à la position de puissance",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Halting Snatch Deadlift',
        en: 'Halting Snatch Deadlift',
        fr: "Soulevé de terre d'arraché arrêté",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Floating Halting Snatch Deadlift',
        en: 'Floating Halting Snatch Deadlift',
        fr: "Soulevé de terre d'arraché flottant arrêté",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Floating Halting Snatch Deadlift on Riser',
        en: 'Floating Halting Snatch Deadlift on Riser',
        fr: "Soulevé de terre d'arraché flottant arrêté sur cale",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Block Snatch Deadlift',
        en: 'Block Snatch Deadlift',
        fr: "Soulevé de terre d'arraché depuis les blocs",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Block Halting Snatch Deadlift',
        en: 'Block Halting Snatch Deadlift',
        fr: "Soulevé de terre d'arraché arrêté depuis les blocs",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Snatch Segment Deadlift',
        en: 'Snatch Segment Deadlift',
        fr: "Soulevé de terre segmenté d'arraché",
        category: 'olympic',
        isCore: false,
    },
    { name: 'Snatch Lift-Off', en: 'Snatch Lift-Off', fr: "Décollage d'arraché", category: 'olympic', isCore: false },

    // ── Clean — Hang variations (by position) ───
    { name: 'Hang Clean', en: 'Hang Clean', fr: 'Épaulé suspendu', category: 'olympic', isCore: false },
    { name: 'High-Hang Clean', en: 'High-Hang Clean', fr: 'Épaulé suspendu haut', category: 'olympic', isCore: false },
    {
        name: 'Below Knee Hang Clean',
        en: 'Below Knee Hang Clean',
        fr: 'Épaulé suspendu sous le genou',
        category: 'olympic',
        isCore: false,
    },
    { name: 'Floating Clean', en: 'Floating Clean', fr: 'Épaulé flottant', category: 'olympic', isCore: false },
    { name: 'Hip Clean', en: 'Hip Clean', fr: 'Épaulé à la hanche', category: 'olympic', isCore: false },
    {
        name: 'Hang Power Clean',
        en: 'Hang Power Clean',
        fr: 'Épaulé en puissance suspendu',
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'High-Hang Power Clean',
        en: 'High-Hang Power Clean',
        fr: 'Épaulé en puissance suspendu haut',
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Below Knee Hang Power Clean',
        en: 'Below Knee Hang Power Clean',
        fr: 'Épaulé en puissance suspendu sous le genou',
        category: 'olympic',
        isCore: false,
    },

    // ── Clean — Technique / Turnover drills ─────
    { name: 'Tall Clean', en: 'Tall Clean', fr: 'Épaulé debout', category: 'olympic', isCore: false },
    { name: 'Dip Clean', en: 'Dip Clean', fr: 'Épaulé en plongeon', category: 'olympic', isCore: false },
    { name: 'Muscle Clean', en: 'Muscle Clean', fr: 'Épaulé muscle', category: 'olympic', isCore: false },
    {
        name: 'Dip Muscle Clean',
        en: 'Dip Muscle Clean',
        fr: 'Épaulé muscle en plongeon',
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Clean from Power Position',
        en: 'Clean from Power Position',
        fr: 'Épaulé depuis la position de puissance',
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Power Clean from Power Position',
        en: 'Power Clean from Power Position',
        fr: 'Épaulé en puissance depuis la position de puissance',
        category: 'olympic',
        isCore: false,
    },
    { name: 'No Feet Clean', en: 'No Feet Clean', fr: 'Épaulé sans pieds', category: 'olympic', isCore: false },
    {
        name: 'Clean Bench Pull (Staircase Pull)',
        en: 'Clean Bench Pull (Staircase Pull)',
        fr: "Tirage d'épaulé au banc (tirage en escalier)",
        category: 'olympic',
        isCore: false,
    },

    // ── Clean — Multi-position ──────────────────
    { name: '2-Position Clean', en: '2-Position Clean', fr: 'Épaulé 2 positions', category: 'olympic', isCore: false },
    { name: '3-Position Clean', en: '3-Position Clean', fr: 'Épaulé 3 positions', category: 'olympic', isCore: false },
    {
        name: '2-Position Power Clean',
        en: '2-Position Power Clean',
        fr: 'Épaulé en puissance 2 positions',
        category: 'olympic',
        isCore: false,
    },
    {
        name: '3-Position Power Clean',
        en: '3-Position Power Clean',
        fr: 'Épaulé en puissance 3 positions',
        category: 'olympic',
        isCore: false,
    },

    // ── Clean — Block variations ────────────────
    { name: 'Block Clean', en: 'Block Clean', fr: 'Épaulé depuis les blocs', category: 'olympic', isCore: false },
    {
        name: 'Block Power Clean',
        en: 'Block Power Clean',
        fr: 'Épaulé en puissance depuis les blocs',
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Clean from Blocks',
        en: 'Clean from Blocks',
        fr: 'Épaulé depuis les blocs',
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Block Clean & Jerk',
        en: 'Block Clean & Jerk',
        fr: 'Épaulé-jeté depuis les blocs',
        category: 'olympic',
        isCore: false,
    },

    // ── Clean — Riser / Deficit ─────────────────
    { name: 'Clean on Riser', en: 'Clean on Riser', fr: 'Épaulé sur cale', category: 'olympic', isCore: false },
    { name: 'Deficit Clean', en: 'Deficit Clean', fr: 'Épaulé en déficit', category: 'olympic', isCore: false },
    {
        name: 'Power Clean on Riser',
        en: 'Power Clean on Riser',
        fr: 'Épaulé en puissance sur cale',
        category: 'olympic',
        isCore: false,
    },

    // ── Clean — Tempo / Paused ──────────────────
    { name: 'Paused Clean', en: 'Paused Clean', fr: 'Épaulé avec pause', category: 'olympic', isCore: false },
    { name: 'Slow Pull Clean', en: 'Slow Pull Clean', fr: 'Épaulé tirage lent', category: 'olympic', isCore: false },
    {
        name: 'Pause at Knee Clean',
        en: 'Pause at Knee Clean',
        fr: 'Épaulé avec pause au genou',
        category: 'olympic',
        isCore: false,
    },

    // ── Clean — Pull variations ─────────────────
    { name: 'Clean Pull', en: 'Clean Pull', fr: "Tirage d'épaulé", category: 'olympic', isCore: false },
    { name: 'Clean High Pull', en: 'Clean High Pull', fr: "Tirage haut d'épaulé", category: 'olympic', isCore: false },
    {
        name: 'Clean Speed Pull (Panda Pull)',
        en: 'Clean Speed Pull (Panda Pull)',
        fr: "Tirage rapide d'épaulé (Panda Pull)",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Clean Segment Pull',
        en: 'Clean Segment Pull',
        fr: "Tirage segmenté d'épaulé",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Clean Pull to Hold',
        en: 'Clean Pull to Hold',
        fr: "Tirage d'épaulé avec maintien",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Clean Pull to Hip',
        en: 'Clean Pull to Hip',
        fr: "Tirage d'épaulé à la hanche",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Flat-Footed Clean Pull',
        en: 'Flat-Footed Clean Pull',
        fr: "Tirage d'épaulé pieds à plat",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Flat-Footed Clean Pull to Hold',
        en: 'Flat-Footed Clean Pull to Hold',
        fr: "Tirage d'épaulé pieds à plat avec maintien",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Floating Clean Pull',
        en: 'Floating Clean Pull',
        fr: "Tirage d'épaulé flottant",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Clean Pull on Riser',
        en: 'Clean Pull on Riser',
        fr: "Tirage d'épaulé sur cale",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Clean High Pull on Riser',
        en: 'Clean High Pull on Riser',
        fr: "Tirage haut d'épaulé sur cale",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Block Clean Pull',
        en: 'Block Clean Pull',
        fr: "Tirage d'épaulé depuis les blocs",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Block Clean Pull to Hold',
        en: 'Block Clean Pull to Hold',
        fr: "Tirage d'épaulé depuis les blocs avec maintien",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Block Clean High Pull',
        en: 'Block Clean High Pull',
        fr: "Tirage haut d'épaulé depuis les blocs",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Dip Clean Pull',
        en: 'Dip Clean Pull',
        fr: "Tirage d'épaulé en plongeon",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Clean Lasha Pull (Short Pull)',
        en: 'Clean Lasha Pull (Short Pull)',
        fr: "Tirage court d'épaulé (Lasha Pull)",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Clean Stage Pull',
        en: 'Clean Stage Pull',
        fr: "Tirage d'épaulé par étapes",
        category: 'olympic',
        isCore: false,
    },

    // ── Clean — Deadlift variations ─────────────
    {
        name: 'Clean Deadlift',
        en: 'Clean Deadlift',
        fr: "Soulevé de terre d'épaulé",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Clean Deadlift on Riser',
        en: 'Clean Deadlift on Riser',
        fr: "Soulevé de terre d'épaulé sur cale",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Clean Deadlift to Power Position',
        en: 'Clean Deadlift to Power Position',
        fr: "Soulevé de terre d'épaulé à la position de puissance",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Halting Clean Deadlift',
        en: 'Halting Clean Deadlift',
        fr: "Soulevé de terre d'épaulé arrêté",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Floating Halting Clean Deadlift',
        en: 'Floating Halting Clean Deadlift',
        fr: "Soulevé de terre d'épaulé flottant arrêté",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Floating Halting Clean Deadlift on Riser',
        en: 'Floating Halting Clean Deadlift on Riser',
        fr: "Soulevé de terre d'épaulé flottant arrêté sur cale",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Block Clean Deadlift',
        en: 'Block Clean Deadlift',
        fr: "Soulevé de terre d'épaulé depuis les blocs",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Block Halting Clean Deadlift',
        en: 'Block Halting Clean Deadlift',
        fr: "Soulevé de terre d'épaulé arrêté depuis les blocs",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Clean Segment Deadlift',
        en: 'Clean Segment Deadlift',
        fr: "Soulevé de terre segmenté d'épaulé",
        category: 'olympic',
        isCore: false,
    },
    { name: 'Clean Lift-Off', en: 'Clean Lift-Off', fr: "Décollage d'épaulé", category: 'olympic', isCore: false },

    // ── Jerk — Main variations ──────────────────
    { name: 'Split Jerk', en: 'Split Jerk', fr: 'Jeté fendu', category: 'olympic', isCore: false },
    { name: 'Power Jerk', en: 'Power Jerk', fr: 'Jeté en puissance', category: 'olympic', isCore: false },
    { name: 'Push Jerk', en: 'Push Jerk', fr: 'Jeté poussé', category: 'olympic', isCore: false },
    { name: 'Squat Jerk', en: 'Squat Jerk', fr: 'Jeté squat', category: 'olympic', isCore: false },

    // ── Jerk — From racks / blocks / Behind the Neck ────
    {
        name: 'Jerk from Blocks',
        en: 'Jerk from Blocks',
        fr: 'Jeté depuis les blocs',
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Behind the Neck Jerk',
        en: 'Behind the Neck Jerk',
        fr: 'Jeté derrière la nuque',
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Behind the Neck Power Jerk',
        en: 'Behind the Neck Power Jerk',
        fr: 'Jeté en puissance derrière la nuque',
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Behind the Neck Split Jerk',
        en: 'Behind the Neck Split Jerk',
        fr: 'Jeté fendu derrière la nuque',
        category: 'olympic',
        isCore: false,
    },
    { name: 'Jerk from Split', en: 'Jerk from Split', fr: 'Jeté depuis la fente', category: 'olympic', isCore: false },

    // ── Jerk — Technique / Support ──────────────
    { name: 'Jerk Recovery', en: 'Jerk Recovery', fr: 'Récupération de jeté', category: 'olympic', isCore: false },
    { name: 'Jerk Dip', en: 'Jerk Dip', fr: 'Plongeon de jeté', category: 'olympic', isCore: false },
    {
        name: 'Jerk Dip Squat',
        en: 'Jerk Dip Squat',
        fr: 'Squat de plongeon de jeté',
        category: 'olympic',
        isCore: false,
    },
    { name: 'Jerk Spring', en: 'Jerk Spring', fr: 'Ressort de jeté', category: 'olympic', isCore: false },
    { name: 'Jerk Drive', en: 'Jerk Drive', fr: 'Poussée de jeté', category: 'olympic', isCore: false },
    { name: 'Tall Jerk', en: 'Tall Jerk', fr: 'Jeté debout', category: 'olympic', isCore: false },
    { name: 'Press in Split', en: 'Press in Split', fr: 'Pressé en fente', category: 'olympic', isCore: false },
    {
        name: 'Push Press in Split',
        en: 'Push Press in Split',
        fr: 'Poussé pressé en fente',
        category: 'olympic',
        isCore: false,
    },
    { name: 'Jerk Balance', en: 'Jerk Balance', fr: 'Équilibre de jeté', category: 'olympic', isCore: false },
    { name: 'Drop to Split', en: 'Drop to Split', fr: 'Chute en fente', category: 'olympic', isCore: false },
    { name: 'Pause Jerk', en: 'Pause Jerk', fr: 'Jeté avec pause', category: 'olympic', isCore: false },
    {
        name: 'Jerk with Pause in Dip',
        en: 'Jerk with Pause in Dip',
        fr: 'Jeté avec pause en plongeon',
        category: 'olympic',
        isCore: false,
    },

    // ── Jerk — Pressing / Overhead support ──────
    { name: 'Push Press', en: 'Push Press', fr: 'Poussé pressé', category: 'olympic', isCore: false },
    {
        name: 'Push Press Behind the Neck',
        en: 'Push Press Behind the Neck',
        fr: 'Poussé pressé derrière la nuque',
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Sots Press (Clean Grip)',
        en: 'Sots Press (Clean Grip)',
        fr: "Sots Press (prise d'épaulé)",
        category: 'olympic',
        isCore: false,
    },

    // ── Complexes ───────────────────────────────
    {
        name: 'Clean-Jerk (Squat Clean to Jerk)',
        en: 'Clean-Jerk (Squat Clean to Jerk)',
        fr: 'Épaulé-jeté (épaulé squat + jeté)',
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Clean Pull + Clean',
        en: 'Clean Pull + Clean',
        fr: "Tirage d'épaulé + épaulé",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Clean + Front Squat + Jerk',
        en: 'Clean + Front Squat + Jerk',
        fr: 'Épaulé + squat avant + jeté',
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Power Clean + Clean',
        en: 'Power Clean + Clean',
        fr: 'Épaulé en puissance + épaulé',
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Hang Clean + Clean',
        en: 'Hang Clean + Clean',
        fr: 'Épaulé suspendu + épaulé',
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Snatch Pull + Snatch',
        en: 'Snatch Pull + Snatch',
        fr: "Tirage d'arraché + arraché",
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Power Snatch + Snatch',
        en: 'Power Snatch + Snatch',
        fr: 'Arraché en puissance + arraché',
        category: 'olympic',
        isCore: false,
    },
    {
        name: 'Hang Snatch + Snatch',
        en: 'Hang Snatch + Snatch',
        fr: 'Arraché suspendu + arraché',
        category: 'olympic',
        isCore: false,
    },

    // ═══════════════════════════════════════════
    // POWERLIFTING
    // ═══════════════════════════════════════════

    { name: 'Back Squat', en: 'Back Squat', fr: 'Squat arrière', category: 'powerlifting', isCore: true },
    { name: 'Deadlift', en: 'Deadlift', fr: 'Soulevé de terre', category: 'powerlifting', isCore: true },
    { name: 'Bench Press', en: 'Bench Press', fr: 'Développé couché', category: 'powerlifting', isCore: true },

    { name: 'Pause Squat', en: 'Pause Squat', fr: 'Squat avec pause', category: 'powerlifting', isCore: false },
    { name: 'Pin Squat', en: 'Pin Squat', fr: 'Squat sur goupilles', category: 'powerlifting', isCore: false },
    { name: 'Box Squat', en: 'Box Squat', fr: 'Squat sur boîte', category: 'powerlifting', isCore: false },
    { name: 'Tempo Squat', en: 'Tempo Squat', fr: 'Squat tempo', category: 'powerlifting', isCore: false },
    {
        name: 'Safety Bar Squat',
        en: 'Safety Bar Squat',
        fr: 'Squat barre de sécurité',
        category: 'powerlifting',
        isCore: false,
    },
    { name: 'Belt Squat', en: 'Belt Squat', fr: 'Squat à la ceinture', category: 'powerlifting', isCore: false },
    { name: 'Anderson Squat', en: 'Anderson Squat', fr: 'Squat Anderson', category: 'powerlifting', isCore: false },
    { name: 'Goblet Squat', en: 'Goblet Squat', fr: 'Squat gobelet', category: 'powerlifting', isCore: false },
    { name: 'Zercher Squat', en: 'Zercher Squat', fr: 'Squat Zercher', category: 'powerlifting', isCore: false },
    { name: 'High Bar Squat', en: 'High Bar Squat', fr: 'Squat barre haute', category: 'powerlifting', isCore: false },
    { name: 'Low Bar Squat', en: 'Low Bar Squat', fr: 'Squat barre basse', category: 'powerlifting', isCore: false },
    { name: 'Hack Squat', en: 'Hack Squat', fr: 'Hack squat', category: 'powerlifting', isCore: false },

    {
        name: 'Sumo Deadlift',
        en: 'Sumo Deadlift',
        fr: 'Soulevé de terre sumo',
        category: 'powerlifting',
        isCore: false,
    },
    {
        name: 'Romanian Deadlift',
        en: 'Romanian Deadlift',
        fr: 'Soulevé de terre roumain',
        category: 'powerlifting',
        isCore: false,
    },
    {
        name: 'Deficit Deadlift',
        en: 'Deficit Deadlift',
        fr: 'Soulevé de terre en déficit',
        category: 'powerlifting',
        isCore: false,
    },
    { name: 'Block Pull', en: 'Block Pull', fr: 'Tirage depuis les blocs', category: 'powerlifting', isCore: false },
    { name: 'Rack Pull', en: 'Rack Pull', fr: 'Tirage au rack', category: 'powerlifting', isCore: false },
    {
        name: 'Paused Deadlift',
        en: 'Paused Deadlift',
        fr: 'Soulevé de terre avec pause',
        category: 'powerlifting',
        isCore: false,
    },
    {
        name: 'Stiff Leg Deadlift',
        en: 'Stiff Leg Deadlift',
        fr: 'Soulevé de terre jambes tendues',
        category: 'powerlifting',
        isCore: false,
    },
    {
        name: 'Trap Bar Deadlift',
        en: 'Trap Bar Deadlift',
        fr: 'Soulevé de terre barre hexagonale',
        category: 'powerlifting',
        isCore: false,
    },
    {
        name: 'Single Leg Romanian Deadlift',
        en: 'Single Leg Romanian Deadlift',
        fr: 'Soulevé de terre roumain unilatéral',
        category: 'powerlifting',
        isCore: false,
    },
    {
        name: 'Snatch Grip Romanian Deadlift',
        en: 'Snatch Grip Romanian Deadlift',
        fr: "Soulevé de terre roumain prise d'arraché",
        category: 'powerlifting',
        isCore: false,
    },

    {
        name: 'Close Grip Bench Press',
        en: 'Close Grip Bench Press',
        fr: 'Développé couché prise serrée',
        category: 'powerlifting',
        isCore: false,
    },
    {
        name: 'Wide Grip Bench Press',
        en: 'Wide Grip Bench Press',
        fr: 'Développé couché prise large',
        category: 'powerlifting',
        isCore: false,
    },
    {
        name: 'Pause Bench Press',
        en: 'Pause Bench Press',
        fr: 'Développé couché avec pause',
        category: 'powerlifting',
        isCore: false,
    },
    { name: 'Spoto Press', en: 'Spoto Press', fr: 'Spoto Press', category: 'powerlifting', isCore: false },
    { name: 'Floor Press', en: 'Floor Press', fr: 'Développé au sol', category: 'powerlifting', isCore: false },
    { name: 'Board Press', en: 'Board Press', fr: 'Développé sur planche', category: 'powerlifting', isCore: false },
    {
        name: 'Incline Bench Press',
        en: 'Incline Bench Press',
        fr: 'Développé couché incliné',
        category: 'powerlifting',
        isCore: false,
    },
    {
        name: 'Decline Bench Press',
        en: 'Decline Bench Press',
        fr: 'Développé couché décliné',
        category: 'powerlifting',
        isCore: false,
    },
    {
        name: 'Dumbbell Bench Press',
        en: 'Dumbbell Bench Press',
        fr: 'Développé couché haltères',
        category: 'powerlifting',
        isCore: false,
    },
    {
        name: 'Incline Dumbbell Bench Press',
        en: 'Incline Dumbbell Bench Press',
        fr: 'Développé incliné haltères',
        category: 'powerlifting',
        isCore: false,
    },
    { name: 'Larsen Press', en: 'Larsen Press', fr: 'Larsen Press', category: 'powerlifting', isCore: false },
    { name: 'Pin Press', en: 'Pin Press', fr: 'Développé sur goupilles', category: 'powerlifting', isCore: false },
    {
        name: 'Tempo Bench Press',
        en: 'Tempo Bench Press',
        fr: 'Développé couché tempo',
        category: 'powerlifting',
        isCore: false,
    },

    {
        name: 'Overhead Press',
        en: 'Overhead Press',
        fr: 'Développé militaire',
        category: 'powerlifting',
        isCore: false,
    },
    {
        name: 'Seated Overhead Press',
        en: 'Seated Overhead Press',
        fr: 'Développé militaire assis',
        category: 'powerlifting',
        isCore: false,
    },
    {
        name: 'Dumbbell Overhead Press',
        en: 'Dumbbell Overhead Press',
        fr: 'Développé haltères',
        category: 'powerlifting',
        isCore: false,
    },
    { name: 'Z Press', en: 'Z Press', fr: 'Z Press', category: 'powerlifting', isCore: false },

    // ═══════════════════════════════════════════
    // ACCESSORY — Upper Body Pull
    // ═══════════════════════════════════════════

    { name: 'Barbell Row', en: 'Barbell Row', fr: 'Tirage barre', category: 'accessory', isCore: false },
    { name: 'Pendlay Row', en: 'Pendlay Row', fr: 'Tirage Pendlay', category: 'accessory', isCore: false },
    { name: 'Dumbbell Row', en: 'Dumbbell Row', fr: 'Tirage haltère', category: 'accessory', isCore: false },
    {
        name: 'Seated Cable Row',
        en: 'Seated Cable Row',
        fr: 'Tirage câble assis',
        category: 'accessory',
        isCore: false,
    },
    { name: 'T-Bar Row', en: 'T-Bar Row', fr: 'Tirage T-Bar', category: 'accessory', isCore: false },
    { name: 'Meadows Row', en: 'Meadows Row', fr: 'Tirage Meadows', category: 'accessory', isCore: false },
    {
        name: 'Chest Supported Row',
        en: 'Chest Supported Row',
        fr: 'Tirage poitrine supportée',
        category: 'accessory',
        isCore: false,
    },
    { name: 'Pull-Up', en: 'Pull-Up', fr: 'Traction', category: 'accessory', isCore: false },
    { name: 'Weighted Pull-Up', en: 'Weighted Pull-Up', fr: 'Traction lestée', category: 'accessory', isCore: false },
    { name: 'Chin-Up', en: 'Chin-Up', fr: 'Traction en supination', category: 'accessory', isCore: false },
    { name: 'Lat Pulldown', en: 'Lat Pulldown', fr: 'Tirage poulie haute', category: 'accessory', isCore: false },
    { name: 'Face Pull', en: 'Face Pull', fr: 'Tirage visage', category: 'accessory', isCore: false },
    { name: 'Upright Row', en: 'Upright Row', fr: 'Tirage menton', category: 'accessory', isCore: false },
    { name: 'Shrug', en: 'Shrug', fr: "Haussement d'épaules", category: 'accessory', isCore: false },
    {
        name: 'Dumbbell Shrug',
        en: 'Dumbbell Shrug',
        fr: "Haussement d'épaules haltères",
        category: 'accessory',
        isCore: false,
    },

    // ═══════════════════════════════════════════
    // ACCESSORY — Upper Body Push
    // ═══════════════════════════════════════════

    { name: 'Dip', en: 'Dip', fr: 'Dips', category: 'accessory', isCore: false },
    { name: 'Weighted Dip', en: 'Weighted Dip', fr: 'Dips lestés', category: 'accessory', isCore: false },
    {
        name: 'Tricep Pushdown',
        en: 'Tricep Pushdown',
        fr: 'Extension triceps à la poulie',
        category: 'accessory',
        isCore: false,
    },
    { name: 'Skull Crusher', en: 'Skull Crusher', fr: 'Barre au front', category: 'accessory', isCore: false },
    {
        name: 'Overhead Tricep Extension',
        en: 'Overhead Tricep Extension',
        fr: 'Extension triceps au-dessus de la tête',
        category: 'accessory',
        isCore: false,
    },
    { name: 'JM Press', en: 'JM Press', fr: 'JM Press', category: 'accessory', isCore: false },
    { name: 'Lateral Raise', en: 'Lateral Raise', fr: 'Élévation latérale', category: 'accessory', isCore: false },
    { name: 'Front Raise', en: 'Front Raise', fr: 'Élévation frontale', category: 'accessory', isCore: false },
    {
        name: 'Rear Delt Fly',
        en: 'Rear Delt Fly',
        fr: 'Oiseau (deltoïde postérieur)',
        category: 'accessory',
        isCore: false,
    },
    { name: 'Arnold Press', en: 'Arnold Press', fr: 'Arnold Press', category: 'accessory', isCore: false },
    { name: 'Cable Fly', en: 'Cable Fly', fr: 'Écarté à la poulie', category: 'accessory', isCore: false },
    { name: 'Pec Deck', en: 'Pec Deck', fr: 'Pec deck', category: 'accessory', isCore: false },
    { name: 'Push-Up', en: 'Push-Up', fr: 'Pompe', category: 'accessory', isCore: false },

    // ═══════════════════════════════════════════
    // ACCESSORY — Lower Body
    // ═══════════════════════════════════════════

    { name: 'Overhead Squat', en: 'Overhead Squat', fr: 'Squat overhead', category: 'accessory', isCore: true },
    { name: 'Front Squat', en: 'Front Squat', fr: 'Squat avant', category: 'accessory', isCore: true },
    { name: 'Leg Press', en: 'Leg Press', fr: 'Presse à cuisses', category: 'accessory', isCore: false },
    { name: 'Leg Extension', en: 'Leg Extension', fr: 'Extension des jambes', category: 'accessory', isCore: false },
    { name: 'Leg Curl', en: 'Leg Curl', fr: 'Flexion des jambes', category: 'accessory', isCore: false },
    { name: 'Nordic Curl', en: 'Nordic Curl', fr: 'Curl nordique', category: 'accessory', isCore: false },
    {
        name: 'Glute Ham Raise',
        en: 'Glute Ham Raise',
        fr: 'Relevé fessier-ischio',
        category: 'accessory',
        isCore: false,
    },
    { name: 'Hip Thrust', en: 'Hip Thrust', fr: 'Extension de hanche', category: 'accessory', isCore: false },
    {
        name: 'Barbell Hip Thrust',
        en: 'Barbell Hip Thrust',
        fr: 'Extension de hanche à la barre',
        category: 'accessory',
        isCore: false,
    },
    {
        name: 'Bulgarian Split Squat',
        en: 'Bulgarian Split Squat',
        fr: 'Squat bulgare',
        category: 'accessory',
        isCore: false,
    },
    { name: 'Lunge', en: 'Lunge', fr: 'Fente', category: 'accessory', isCore: false },
    { name: 'Walking Lunge', en: 'Walking Lunge', fr: 'Fente en marche', category: 'accessory', isCore: false },
    { name: 'Step Up', en: 'Step Up', fr: 'Montée sur banc', category: 'accessory', isCore: false },
    { name: 'Calf Raise', en: 'Calf Raise', fr: 'Extension des mollets debout', category: 'accessory', isCore: false },
    {
        name: 'Seated Calf Raise',
        en: 'Seated Calf Raise',
        fr: 'Extension des mollets assis',
        category: 'accessory',
        isCore: false,
    },
    { name: 'Good Morning', en: 'Good Morning', fr: 'Good morning', category: 'accessory', isCore: false },
    {
        name: 'Reverse Hyper',
        en: 'Reverse Hyper',
        fr: 'Hyper extension inversée',
        category: 'accessory',
        isCore: false,
    },
    { name: 'Back Extension', en: 'Back Extension', fr: 'Extension du dos', category: 'accessory', isCore: false },
    { name: 'Glute Bridge', en: 'Glute Bridge', fr: 'Pont fessier', category: 'accessory', isCore: false },
    {
        name: 'Single Leg Press',
        en: 'Single Leg Press',
        fr: 'Presse unilatérale',
        category: 'accessory',
        isCore: false,
    },
    { name: 'Sissy Squat', en: 'Sissy Squat', fr: 'Sissy squat', category: 'accessory', isCore: false },
    { name: 'Pistol Squat', en: 'Pistol Squat', fr: 'Squat pistol', category: 'accessory', isCore: false },

    // ═══════════════════════════════════════════
    // ACCESSORY — Core
    // ═══════════════════════════════════════════

    { name: 'Plank', en: 'Plank', fr: 'Planche', category: 'accessory', isCore: false },
    { name: 'Side Plank', en: 'Side Plank', fr: 'Planche latérale', category: 'accessory', isCore: false },
    { name: 'Ab Wheel Rollout', en: 'Ab Wheel Rollout', fr: 'Roue abdominale', category: 'accessory', isCore: false },
    {
        name: 'Hanging Leg Raise',
        en: 'Hanging Leg Raise',
        fr: 'Relevé de jambes suspendu',
        category: 'accessory',
        isCore: false,
    },
    { name: 'Cable Woodchop', en: 'Cable Woodchop', fr: 'Bûcheron à la poulie', category: 'accessory', isCore: false },
    { name: 'Pallof Press', en: 'Pallof Press', fr: 'Pallof Press', category: 'accessory', isCore: false },
    { name: 'Russian Twist', en: 'Russian Twist', fr: 'Rotation russe', category: 'accessory', isCore: false },
    { name: 'V-Up', en: 'V-Up', fr: 'V-Up', category: 'accessory', isCore: false },
    { name: 'Hollow Hold', en: 'Hollow Hold', fr: 'Hollow hold', category: 'accessory', isCore: false },
    { name: 'L-Sit', en: 'L-Sit', fr: 'L-Sit', category: 'accessory', isCore: false },

    // ═══════════════════════════════════════════
    // ACCESSORY — Arms
    // ═══════════════════════════════════════════

    { name: 'Barbell Curl', en: 'Barbell Curl', fr: 'Curl barre', category: 'accessory', isCore: false },
    { name: 'Dumbbell Curl', en: 'Dumbbell Curl', fr: 'Curl haltères', category: 'accessory', isCore: false },
    { name: 'Hammer Curl', en: 'Hammer Curl', fr: 'Curl marteau', category: 'accessory', isCore: false },
    { name: 'Preacher Curl', en: 'Preacher Curl', fr: 'Curl au pupitre', category: 'accessory', isCore: false },
    {
        name: 'Concentration Curl',
        en: 'Concentration Curl',
        fr: 'Curl concentration',
        category: 'accessory',
        isCore: false,
    },
    { name: 'Cable Curl', en: 'Cable Curl', fr: 'Curl à la poulie', category: 'accessory', isCore: false },
    { name: 'Wrist Curl', en: 'Wrist Curl', fr: 'Curl poignet', category: 'accessory', isCore: false },
    { name: 'Reverse Curl', en: 'Reverse Curl', fr: 'Curl inversé', category: 'accessory', isCore: false },

    // ═══════════════════════════════════════════
    // CROSSFIT — Gymnastics / Bodyweight
    // ═══════════════════════════════════════════

    { name: 'Muscle-Up', en: 'Muscle-Up', fr: 'Muscle-up', category: 'crossfit', isCore: false },
    { name: 'Ring Muscle-Up', en: 'Ring Muscle-Up', fr: 'Muscle-up aux anneaux', category: 'crossfit', isCore: false },
    { name: 'Bar Muscle-Up', en: 'Bar Muscle-Up', fr: 'Muscle-up à la barre', category: 'crossfit', isCore: false },
    {
        name: 'Strict Ring Muscle-Up',
        en: 'Strict Ring Muscle-Up',
        fr: 'Muscle-up strict aux anneaux',
        category: 'crossfit',
        isCore: false,
    },
    { name: 'Ring Dip', en: 'Ring Dip', fr: 'Dips aux anneaux', category: 'crossfit', isCore: false },
    {
        name: 'Strict Ring Dip',
        en: 'Strict Ring Dip',
        fr: 'Dips stricts aux anneaux',
        category: 'crossfit',
        isCore: false,
    },
    { name: 'Ring Row', en: 'Ring Row', fr: 'Tirage aux anneaux', category: 'crossfit', isCore: false },
    { name: 'Handstand Push-Up', en: 'Handstand Push-Up', fr: 'Pompe en poirier', category: 'crossfit', isCore: false },
    {
        name: 'Strict Handstand Push-Up',
        en: 'Strict Handstand Push-Up',
        fr: 'Pompe en poirier stricte',
        category: 'crossfit',
        isCore: false,
    },
    {
        name: 'Deficit Handstand Push-Up',
        en: 'Deficit Handstand Push-Up',
        fr: 'Pompe en poirier en déficit',
        category: 'crossfit',
        isCore: false,
    },
    { name: 'Handstand Walk', en: 'Handstand Walk', fr: 'Marche en poirier', category: 'crossfit', isCore: false },
    { name: 'Handstand Hold', en: 'Handstand Hold', fr: 'Maintien en poirier', category: 'crossfit', isCore: false },
    { name: 'Kipping Pull-Up', en: 'Kipping Pull-Up', fr: 'Traction kipping', category: 'crossfit', isCore: false },
    {
        name: 'Butterfly Pull-Up',
        en: 'Butterfly Pull-Up',
        fr: 'Traction butterfly',
        category: 'crossfit',
        isCore: false,
    },
    {
        name: 'Chest to Bar Pull-Up',
        en: 'Chest to Bar Pull-Up',
        fr: 'Traction poitrine à la barre',
        category: 'crossfit',
        isCore: false,
    },
    { name: 'Strict Pull-Up', en: 'Strict Pull-Up', fr: 'Traction stricte', category: 'crossfit', isCore: false },
    { name: 'Rope Climb', en: 'Rope Climb', fr: 'Grimper de corde', category: 'crossfit', isCore: false },
    {
        name: 'Legless Rope Climb',
        en: 'Legless Rope Climb',
        fr: 'Grimper de corde sans jambes',
        category: 'crossfit',
        isCore: false,
    },
    { name: 'Pegboard', en: 'Pegboard', fr: 'Pegboard', category: 'crossfit', isCore: false },
    { name: 'Deficit Push-Up', en: 'Deficit Push-Up', fr: 'Pompe en déficit', category: 'crossfit', isCore: false },
    { name: 'Toes to Bar', en: 'Toes to Bar', fr: 'Orteils à la barre', category: 'crossfit', isCore: false },
    { name: 'GHD Sit-Up', en: 'GHD Sit-Up', fr: 'Relevé assis au GHD', category: 'crossfit', isCore: false },
    {
        name: 'GHD Back Extention',
        en: 'GHD Back Extension',
        fr: 'Extension du dos au GHD',
        category: 'crossfit',
        isCore: false,
    },

    // ═══════════════════════════════════════════
    // CROSSFIT — Barbell / Dumbbell WOD
    // ═══════════════════════════════════════════

    { name: 'Thruster', en: 'Thruster', fr: 'Thruster', category: 'crossfit', isCore: false },
    {
        name: 'Dumbbell Thruster',
        en: 'Dumbbell Thruster',
        fr: 'Thruster haltères',
        category: 'crossfit',
        isCore: false,
    },
    { name: 'Wall Ball', en: 'Wall Ball', fr: 'Wall ball', category: 'crossfit', isCore: false },
    { name: 'Cluster', en: 'Cluster', fr: 'Cluster', category: 'crossfit', isCore: false },
    {
        name: 'Sumo Deadlift High Pull',
        en: 'Sumo Deadlift High Pull',
        fr: 'Soulevé de terre sumo tirage haut',
        category: 'crossfit',
        isCore: false,
    },
    { name: 'Devil Press', en: 'Devil Press', fr: 'Devil press', category: 'crossfit', isCore: false },
    { name: 'Man Maker', en: 'Man Maker', fr: 'Man maker', category: 'crossfit', isCore: false },
    {
        name: 'Single Arm Dumbbell Snatch',
        en: 'Single Arm Dumbbell Snatch',
        fr: 'Arraché haltère unilatéral',
        category: 'crossfit',
        isCore: false,
    },
    {
        name: 'Single Arm Dumbbell Clean and Jerk',
        en: 'Single Arm Dumbbell Clean and Jerk',
        fr: 'Épaulé-jeté haltère unilatéral',
        category: 'crossfit',
        isCore: false,
    },
    {
        name: 'Dumbbell Box Step Over',
        en: 'Dumbbell Box Step Over',
        fr: 'Passage de boîte haltères',
        category: 'crossfit',
        isCore: false,
    },
    {
        name: 'Hang Squat Clean',
        en: 'Hang Squat Clean',
        fr: 'Épaulé squat suspendu',
        category: 'crossfit',
        isCore: false,
    },
    {
        name: 'Squat Clean Thruster',
        en: 'Squat Clean Thruster',
        fr: 'Épaulé squat + thruster',
        category: 'crossfit',
        isCore: false,
    },
    {
        name: 'Overhead Walking Lunge',
        en: 'Overhead Walking Lunge',
        fr: 'Fente en marche bras tendus',
        category: 'crossfit',
        isCore: false,
    },
    {
        name: 'Front Rack Lunge',
        en: 'Front Rack Lunge',
        fr: 'Fente position front rack',
        category: 'crossfit',
        isCore: false,
    },
    {
        name: 'Dumbbell Hang Clean',
        en: 'Dumbbell Hang Clean',
        fr: 'Épaulé suspendu haltères',
        category: 'crossfit',
        isCore: false,
    },

    // ═══════════════════════════════════════════
    // CROSSFIT — Cardio / Mixed
    // ═══════════════════════════════════════════

    { name: 'Box Jump', en: 'Box Jump', fr: 'Saut sur boîte', category: 'crossfit', isCore: false },
    { name: 'Box Jump Over', en: 'Box Jump Over', fr: 'Saut par-dessus la boîte', category: 'crossfit', isCore: false },
    { name: 'Burpee', en: 'Burpee', fr: 'Burpee', category: 'crossfit', isCore: false },
    {
        name: 'Burpee Box Jump Over',
        en: 'Burpee Box Jump Over',
        fr: 'Burpee saut par-dessus la boîte',
        category: 'crossfit',
        isCore: false,
    },
    {
        name: 'Bar Facing Burpee',
        en: 'Bar Facing Burpee',
        fr: 'Burpee face à la barre',
        category: 'crossfit',
        isCore: false,
    },
    { name: 'Burpee Pull-Up', en: 'Burpee Pull-Up', fr: 'Burpee traction', category: 'crossfit', isCore: false },
    { name: 'Burpee to Target', en: 'Burpee to Target', fr: 'Burpee avec cible', category: 'crossfit', isCore: false },
    { name: 'Double Under', en: 'Double Under', fr: 'Double under', category: 'crossfit', isCore: false },
    { name: 'Triple Under', en: 'Triple Under', fr: 'Triple under', category: 'crossfit', isCore: false },
    {
        name: 'Crossover Single Under',
        en: 'Crossover Single Under',
        fr: 'Simple croisé',
        category: 'crossfit',
        isCore: false,
    },
    { name: 'Shuttle Run', en: 'Shuttle Run', fr: 'Course navette', category: 'crossfit', isCore: false },
    { name: 'Echo Bike', en: 'Echo Bike', fr: 'Echo bike', category: 'crossfit', isCore: false },

    // ═══════════════════════════════════════════
    // STRONGMAN — Pressing
    // ═══════════════════════════════════════════

    { name: 'Viking Press', en: 'Viking Press', fr: 'Viking press', category: 'strongman', isCore: false },
    { name: 'Log Press', en: 'Log Press', fr: 'Développé au log', category: 'strongman', isCore: false },
    { name: 'Axle Bar Press', en: 'Axle Bar Press', fr: 'Développé barre axle', category: 'strongman', isCore: false },
    {
        name: 'Axle Bar Clean and Press',
        en: 'Axle Bar Clean and Press',
        fr: 'Épaulé-développé barre axle',
        category: 'strongman',
        isCore: false,
    },
    {
        name: 'Log Clean and Press',
        en: 'Log Clean and Press',
        fr: 'Épaulé-développé au log',
        category: 'strongman',
        isCore: false,
    },
    {
        name: 'Circus Dumbbell Press',
        en: 'Circus Dumbbell Press',
        fr: 'Développé haltère de cirque',
        category: 'strongman',
        isCore: false,
    },
    { name: 'Keg Press', en: 'Keg Press', fr: 'Développé au baril', category: 'strongman', isCore: false },

    // ═══════════════════════════════════════════
    // STRONGMAN — Deadlift / Pulling
    // ═══════════════════════════════════════════

    {
        name: 'Axle Bar Deadlift',
        en: 'Axle Bar Deadlift',
        fr: 'Soulevé de terre barre axle',
        category: 'strongman',
        isCore: false,
    },
    { name: 'Car Deadlift', en: 'Car Deadlift', fr: 'Soulevé de terre voiture', category: 'strongman', isCore: false },
    {
        name: '18 Inch Deadlift',
        en: '18 Inch Deadlift',
        fr: 'Soulevé de terre 18 pouces',
        category: 'strongman',
        isCore: false,
    },
    {
        name: 'Silver Dollar Deadlift',
        en: 'Silver Dollar Deadlift',
        fr: 'Soulevé de terre silver dollar',
        category: 'strongman',
        isCore: false,
    },
    {
        name: 'Deadlift for Reps',
        en: 'Deadlift for Reps',
        fr: 'Soulevé de terre pour répétitions',
        category: 'strongman',
        isCore: false,
    },
    {
        name: 'Arm Over Arm Pull',
        en: 'Arm Over Arm Pull',
        fr: 'Tirage bras par-dessus bras',
        category: 'strongman',
        isCore: false,
    },

    // ═══════════════════════════════════════════
    // STRONGMAN — Stones / Loading
    // ═══════════════════════════════════════════

    { name: 'Atlas Stone', en: 'Atlas Stone', fr: "Pierre d'Atlas", category: 'strongman', isCore: false },
    {
        name: 'Atlas Stone to Shoulder',
        en: 'Atlas Stone to Shoulder',
        fr: "Pierre d'Atlas à l'épaule",
        category: 'strongman',
        isCore: false,
    },
    {
        name: 'Atlas Stone Over Bar',
        en: 'Atlas Stone Over Bar',
        fr: "Pierre d'Atlas par-dessus la barre",
        category: 'strongman',
        isCore: false,
    },
    {
        name: 'Atlas Stone Load',
        en: 'Atlas Stone Load',
        fr: "Chargement pierre d'Atlas",
        category: 'strongman',
        isCore: false,
    },
    {
        name: 'Natural Stone Load',
        en: 'Natural Stone Load',
        fr: 'Chargement pierre naturelle',
        category: 'strongman',
        isCore: false,
    },
    { name: 'Keg Load', en: 'Keg Load', fr: 'Chargement de baril', category: 'strongman', isCore: false },
    { name: 'Sandbag Load', en: 'Sandbag Load', fr: 'Chargement sac de sable', category: 'strongman', isCore: false },
    { name: 'Loading Race', en: 'Loading Race', fr: 'Course de chargement', category: 'strongman', isCore: false },

    // ═══════════════════════════════════════════
    // STRONGMAN — Carry / Moving Events
    // ═══════════════════════════════════════════

    { name: 'Farmer Walk', en: 'Farmer Walk', fr: 'Marche du fermier', category: 'strongman', isCore: false },
    { name: 'Yoke Walk', en: 'Yoke Walk', fr: 'Marche au joug', category: 'strongman', isCore: false },
    { name: 'Frame Carry', en: 'Frame Carry', fr: 'Transport au cadre', category: 'strongman', isCore: false },
    { name: 'Keg Carry', en: 'Keg Carry', fr: 'Transport de baril', category: 'strongman', isCore: false },
    {
        name: 'Husafell Stone Carry',
        en: 'Husafell Stone Carry',
        fr: 'Transport pierre Husafell',
        category: 'strongman',
        isCore: false,
    },
    { name: "Conan's Wheel", en: "Conan's Wheel", fr: 'Roue de Conan', category: 'strongman', isCore: false },
    { name: 'Duck Walk', en: 'Duck Walk', fr: 'Marche du canard', category: 'strongman', isCore: false },
    { name: "Fingal's Fingers", en: "Fingal's Fingers", fr: 'Doigts de Fingal', category: 'strongman', isCore: false },
    { name: 'Tire Flip', en: 'Tire Flip', fr: 'Retournement de pneu', category: 'strongman', isCore: false },
    { name: 'Truck Pull', en: 'Truck Pull', fr: 'Tirage de camion', category: 'strongman', isCore: false },
    { name: 'Sled Drag', en: 'Sled Drag', fr: 'Traînée de traîneau', category: 'strongman', isCore: false },
    { name: 'Prowler Sprint', en: 'Prowler Sprint', fr: 'Sprint au prowler', category: 'strongman', isCore: false },

    // ═══════════════════════════════════════════
    // STRONGMAN — Grip
    // ═══════════════════════════════════════════

    { name: 'Hercules Hold', en: 'Hercules Hold', fr: "Maintien d'Hercule", category: 'strongman', isCore: false },
    { name: 'Hub Lift', en: 'Hub Lift', fr: 'Soulevé au moyeu', category: 'strongman', isCore: false },
    {
        name: 'Dinnie Stone Hold',
        en: 'Dinnie Stone Hold',
        fr: 'Maintien pierres de Dinnie',
        category: 'strongman',
        isCore: false,
    },
    {
        name: 'Grip Deadlift (Double Overhand)',
        en: 'Grip Deadlift (Double Overhand)',
        fr: 'Soulevé de terre double pronation',
        category: 'strongman',
        isCore: false,
    },

    // ═══════════════════════════════════════════
    // HYBRID — Kettlebell
    // ═══════════════════════════════════════════

    { name: 'Kettlebell Swing', en: 'Kettlebell Swing', fr: 'Balancé kettlebell', category: 'hybrid', isCore: false },
    {
        name: 'American Kettlebell Swing',
        en: 'American Kettlebell Swing',
        fr: 'Balancé kettlebell américain',
        category: 'hybrid',
        isCore: false,
    },
    { name: 'Turkish Get-Up', en: 'Turkish Get-Up', fr: 'Relevé turc', category: 'hybrid', isCore: false },
    { name: 'Kettlebell Clean', en: 'Kettlebell Clean', fr: 'Épaulé kettlebell', category: 'hybrid', isCore: false },
    { name: 'Kettlebell Snatch', en: 'Kettlebell Snatch', fr: 'Arraché kettlebell', category: 'hybrid', isCore: false },
    { name: 'Kettlebell Press', en: 'Kettlebell Press', fr: 'Développé kettlebell', category: 'hybrid', isCore: false },
    {
        name: 'Kettlebell Goblet Squat',
        en: 'Kettlebell Goblet Squat',
        fr: 'Squat gobelet kettlebell',
        category: 'hybrid',
        isCore: false,
    },
    {
        name: 'Kettlebell Clean and Press',
        en: 'Kettlebell Clean and Press',
        fr: 'Épaulé-développé kettlebell',
        category: 'hybrid',
        isCore: false,
    },
    {
        name: 'Single Arm Kettlebell Clean and Press',
        en: 'Single Arm Kettlebell Clean and Press',
        fr: 'Épaulé-développé kettlebell unilatéral',
        category: 'hybrid',
        isCore: false,
    },
    {
        name: 'Double Kettlebell Clean and Press',
        en: 'Double Kettlebell Clean and Press',
        fr: 'Épaulé-développé double kettlebell',
        category: 'hybrid',
        isCore: false,
    },
    {
        name: 'Double Kettlebell Front Squat',
        en: 'Double Kettlebell Front Squat',
        fr: 'Squat avant double kettlebell',
        category: 'hybrid',
        isCore: false,
    },
    {
        name: 'Kettlebell Armor Complex',
        en: 'Kettlebell Armor Complex',
        fr: 'Complexe armor kettlebell',
        category: 'hybrid',
        isCore: false,
    },
    {
        name: 'Kettlebell Complex',
        en: 'Kettlebell Complex',
        fr: 'Complexe kettlebell',
        category: 'hybrid',
        isCore: false,
    },

    // ═══════════════════════════════════════════
    // HYBRID — Landmine
    // ═══════════════════════════════════════════

    { name: 'Landmine Press', en: 'Landmine Press', fr: 'Développé landmine', category: 'hybrid', isCore: false },
    { name: 'Landmine Row', en: 'Landmine Row', fr: 'Tirage landmine', category: 'hybrid', isCore: false },
    { name: 'Landmine Squat', en: 'Landmine Squat', fr: 'Squat landmine', category: 'hybrid', isCore: false },
    { name: 'Landmine Rotation', en: 'Landmine Rotation', fr: 'Rotation landmine', category: 'hybrid', isCore: false },
    {
        name: 'Landmine Deadlift',
        en: 'Landmine Deadlift',
        fr: 'Soulevé de terre landmine',
        category: 'hybrid',
        isCore: false,
    },
    { name: 'Landmine Thruster', en: 'Landmine Thruster', fr: 'Thruster landmine', category: 'hybrid', isCore: false },
    {
        name: 'Landmine Clean and Press',
        en: 'Landmine Clean and Press',
        fr: 'Épaulé-développé landmine',
        category: 'hybrid',
        isCore: false,
    },

    // ═══════════════════════════════════════════
    // HYBRID — Complexes / Combination Lifts
    // ═══════════════════════════════════════════

    { name: 'Bear Complex', en: 'Bear Complex', fr: "Complexe de l'ours", category: 'hybrid', isCore: false },
    { name: 'Barbell Complex', en: 'Barbell Complex', fr: 'Complexe barre', category: 'hybrid', isCore: false },
    { name: 'Dumbbell Complex', en: 'Dumbbell Complex', fr: 'Complexe haltères', category: 'hybrid', isCore: false },
    {
        name: 'Dumbbell Clean and Press',
        en: 'Dumbbell Clean and Press',
        fr: 'Épaulé-développé haltères',
        category: 'hybrid',
        isCore: false,
    },
    {
        name: 'Dumbbell Clean and Jerk',
        en: 'Dumbbell Clean and Jerk',
        fr: 'Épaulé-jeté haltères',
        category: 'hybrid',
        isCore: false,
    },
    {
        name: 'Hang Clean to Push Press',
        en: 'Hang Clean to Push Press',
        fr: 'Épaulé suspendu + poussé pressé',
        category: 'hybrid',
        isCore: false,
    },
    {
        name: 'Clean to Front Squat',
        en: 'Clean to Front Squat',
        fr: 'Épaulé + squat avant',
        category: 'hybrid',
        isCore: false,
    },

    // ═══════════════════════════════════════════
    // HYBRID — Functional / Odd Object
    // ═══════════════════════════════════════════

    { name: 'Suitcase Carry', en: 'Suitcase Carry', fr: 'Transport valise', category: 'hybrid', isCore: false },
    { name: 'Overhead Carry', en: 'Overhead Carry', fr: 'Transport bras tendus', category: 'hybrid', isCore: false },
    {
        name: 'Trap Bar Carry',
        en: 'Trap Bar Carry',
        fr: 'Transport barre hexagonale',
        category: 'hybrid',
        isCore: false,
    },
    { name: 'Sandbag Clean', en: 'Sandbag Clean', fr: 'Épaulé sac de sable', category: 'hybrid', isCore: false },
    {
        name: 'Sandbag to Shoulder',
        en: 'Sandbag to Shoulder',
        fr: "Sac de sable à l'épaule",
        category: 'hybrid',
        isCore: false,
    },
    { name: 'D-Ball Clean', en: 'D-Ball Clean', fr: 'Épaulé D-Ball', category: 'hybrid', isCore: false },
    {
        name: 'Medicine Ball Slam',
        en: 'Medicine Ball Slam',
        fr: 'Slam médecine-ball',
        category: 'hybrid',
        isCore: false,
    },
    {
        name: 'Medicine Ball Clean',
        en: 'Medicine Ball Clean',
        fr: 'Épaulé médecine-ball',
        category: 'hybrid',
        isCore: false,
    },
    {
        name: 'Cable Pull Through',
        en: 'Cable Pull Through',
        fr: 'Tirage entre les jambes à la poulie',
        category: 'hybrid',
        isCore: false,
    },
    { name: 'Renegade Row', en: 'Renegade Row', fr: 'Tirage renégat', category: 'hybrid', isCore: false },
    {
        name: 'Dumbbell Man Maker',
        en: 'Dumbbell Man Maker',
        fr: 'Man maker haltères',
        category: 'hybrid',
        isCore: false,
    },
    {
        name: 'Sled Push and Pull Combo',
        en: 'Sled Push and Pull Combo',
        fr: 'Combo poussée-tirage traîneau',
        category: 'hybrid',
        isCore: false,
    },

    // ═══════════════════════════════════════════
    // HYROX — Machines / Cardio
    // ═══════════════════════════════════════════

    { name: 'Rowing (Erg)', en: 'Rowing (Erg)', fr: 'Rameur (ergomètre)', category: 'hyrox', isCore: false },
    { name: 'SkiErg', en: 'SkiErg', fr: 'SkiErg', category: 'hyrox', isCore: false },
    { name: 'Assault Bike', en: 'Assault Bike', fr: 'Assault bike', category: 'hyrox', isCore: false },
    { name: '1km Run', en: '1km Run', fr: 'Course 1 km', category: 'hyrox', isCore: false },
    { name: 'Treadmill Run', en: 'Treadmill Run', fr: 'Course sur tapis roulant', category: 'hyrox', isCore: false },

    // ═══════════════════════════════════════════
    // HYROX — Sled / Push / Pull
    // ═══════════════════════════════════════════

    { name: 'Sled Push', en: 'Sled Push', fr: 'Poussée de traîneau', category: 'hyrox', isCore: false },
    { name: 'Sled Pull', en: 'Sled Pull', fr: 'Tirage de traîneau', category: 'hyrox', isCore: false },
    { name: 'Sled Sprint', en: 'Sled Sprint', fr: 'Sprint au traîneau', category: 'hyrox', isCore: false },
    {
        name: 'Prowler Push (Hyrox)',
        en: 'Prowler Push (Hyrox)',
        fr: 'Poussée prowler (Hyrox)',
        category: 'hyrox',
        isCore: false,
    },

    // ═══════════════════════════════════════════
    // HYROX — Sandbag / Carry
    // ═══════════════════════════════════════════

    { name: 'Sandbag Carry', en: 'Sandbag Carry', fr: 'Transport sac de sable', category: 'hyrox', isCore: false },
    { name: 'Sandbag Lunges', en: 'Sandbag Lunges', fr: 'Fentes sac de sable', category: 'hyrox', isCore: false },
    { name: 'Sandbag Squat', en: 'Sandbag Squat', fr: 'Squat sac de sable', category: 'hyrox', isCore: false },
    {
        name: 'Sandbag Over Shoulder',
        en: 'Sandbag Over Shoulder',
        fr: "Sac de sable par-dessus l'épaule",
        category: 'hyrox',
        isCore: false,
    },
    { name: 'Sandbag Run', en: 'Sandbag Run', fr: 'Course avec sac de sable', category: 'hyrox', isCore: false },
    {
        name: 'Farmer Carry (Hyrox)',
        en: 'Farmer Carry (Hyrox)',
        fr: 'Transport du fermier (Hyrox)',
        category: 'hyrox',
        isCore: false,
    },

    // ═══════════════════════════════════════════
    // HYROX — Station / WOD
    // ═══════════════════════════════════════════

    {
        name: 'Burpee Broad Jump',
        en: 'Burpee Broad Jump',
        fr: 'Burpee saut en longueur',
        category: 'hyrox',
        isCore: false,
    },
    {
        name: 'Wall Balls (Hyrox)',
        en: 'Wall Balls (Hyrox)',
        fr: 'Wall balls (Hyrox)',
        category: 'hyrox',
        isCore: false,
    },
    {
        name: 'Weighted Broad Jump',
        en: 'Weighted Broad Jump',
        fr: 'Saut en longueur lesté',
        category: 'hyrox',
        isCore: false,
    },
    { name: 'Battle Rope', en: 'Battle Rope', fr: 'Corde ondulatoire', category: 'hyrox', isCore: false },
    { name: 'Bear Crawl', en: 'Bear Crawl', fr: "Marche de l'ours", category: 'hyrox', isCore: false },

    // ═══════════════════════════════════════════
    // HYROX — Training / Intervals
    // ═══════════════════════════════════════════

    { name: 'Hyrox Simulation', en: 'Hyrox Simulation', fr: 'Simulation Hyrox', category: 'hyrox', isCore: false },
    {
        name: 'Hyrox Double Station',
        en: 'Hyrox Double Station',
        fr: 'Double station Hyrox',
        category: 'hyrox',
        isCore: false,
    },
    {
        name: 'Roxzone Transition Practice',
        en: 'Roxzone Transition Practice',
        fr: 'Pratique transition Roxzone',
        category: 'hyrox',
        isCore: false,
    },
    {
        name: 'Run to Row Interval',
        en: 'Run to Row Interval',
        fr: 'Intervalle course-rameur',
        category: 'hyrox',
        isCore: false,
    },
    {
        name: 'Run to SkiErg Interval',
        en: 'Run to SkiErg Interval',
        fr: 'Intervalle course-SkiErg',
        category: 'hyrox',
        isCore: false,
    },
    {
        name: 'Wall Ball to Run Interval',
        en: 'Wall Ball to Run Interval',
        fr: 'Intervalle wall ball-course',
        category: 'hyrox',
        isCore: false,
    },
];

async function seed() {
    console.log(`Seeding ${ALL_LIFTS.length} lifts...`);

    let inserted = 0;
    let updated = 0;
    let skipped = 0;
    let translationsInserted = 0;
    let translationsUpdated = 0;

    for (const lift of ALL_LIFTS) {
        // ── Upsert lift ─────────────────────────
        let liftId: string;
        const existing = await db.select().from(lifts).where(eq(lifts.name, lift.name)).limit(1);

        if (existing.length > 0) {
            liftId = existing[0].id;
            const needsUpdate = existing[0].category !== lift.category || existing[0].isCore !== lift.isCore;

            if (needsUpdate) {
                await db
                    .update(lifts)
                    .set({ category: lift.category, isCore: lift.isCore })
                    .where(eq(lifts.name, lift.name));
                updated++;
                console.log(`  Updated "${lift.name}" → category=${lift.category}, isCore=${lift.isCore}`);
            } else {
                skipped++;
            }
        } else {
            liftId = crypto.randomUUID();
            await db.insert(lifts).values({
                id: liftId,
                name: lift.name,
                category: lift.category,
                isCore: lift.isCore,
                createdById: null,
            });
            inserted++;
            console.log(`  Inserted "${lift.name}"`);
        }

        // ── Upsert translation ──────────────────
        const existingTranslation = await db
            .select()
            .from(liftTranslations)
            .where(eq(liftTranslations.liftId, liftId))
            .limit(1);

        if (existingTranslation.length > 0) {
            const needsTranslationUpdate =
                existingTranslation[0].en !== lift.en || existingTranslation[0].fr !== lift.fr;

            if (needsTranslationUpdate) {
                await db
                    .update(liftTranslations)
                    .set({ en: lift.en, fr: lift.fr })
                    .where(eq(liftTranslations.liftId, liftId));
                translationsUpdated++;
            }
        } else {
            await db.insert(liftTranslations).values({
                id: crypto.randomUUID(),
                liftId,
                en: lift.en,
                fr: lift.fr,
            });
            translationsInserted++;
        }
    }

    console.log(
        `\nDone: ${inserted} inserted, ${updated} updated, ${skipped} skipped.` +
            `\nTranslations: ${translationsInserted} inserted, ${translationsUpdated} updated.`
    );
    await pool.end();
}

seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
