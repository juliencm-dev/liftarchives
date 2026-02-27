import { hc } from 'hono/client';
import type { AppType } from '@liftarchives/shared/app-type';

export const client = hc<AppType>(import.meta.env.PROD ? import.meta.env.VITE_API_URL : 'http://localhost:4000');
