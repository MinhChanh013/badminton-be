import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";
import { zodToSequelizeAttributes } from "@/common/utils/defineConvert";
import { sequelize } from "@/config/database";

extendZodWithOpenApi(z);

export type SessionPlayer = z.infer<typeof SessionPlayerSchema>;
export const SessionPlayerSchema = z.object({
  id: z.number(),
  sessionId: z.number(),
  playerId: z.number(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  totalAmount: z.number(),
  isPayment: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetSessionPlayerSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export const CreateSessionPlayerSchema = z.object({
  body: SessionPlayerSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }),
});

export const UpdateSessionPlayerSchema = z.object({
  body: SessionPlayerSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }).partial(),
});

const sessionPlayerSequelizeAttributes = zodToSequelizeAttributes(
  SessionPlayerSchema.omit({ id: true })
);

export const SessionPlayerModel = sequelize.define(
  "session_players",
  sessionPlayerSequelizeAttributes
);
