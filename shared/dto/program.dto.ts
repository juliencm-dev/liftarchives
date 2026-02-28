import {
  ProgramResponseSchema,
  ProgramSummaryResponseSchema,
  CreateProgramSchema,
  UpdateProgramSchema,
} from "../schemas/programs";
import type {
  ProgramResponse,
  ProgramSummaryResponse,
  CreateProgramData,
  UpdateProgramData,
} from "../schemas/programs";

export const ProgramDto = {
  fromServer(raw: unknown): ProgramResponse {
    return ProgramResponseSchema.parse(raw);
  },

  fromServerList(raw: unknown[]): ProgramSummaryResponse[] {
    return raw.map((item) => ProgramSummaryResponseSchema.parse(item));
  },

  toCreatePayload(data: unknown): CreateProgramData {
    return CreateProgramSchema.parse(data);
  },

  toUpdatePayload(data: unknown): UpdateProgramData {
    return UpdateProgramSchema.parse(data);
  },
} as const;
