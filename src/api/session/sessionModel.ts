import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";
import { zodToSequelizeAttributes } from "@/common/utils/defineConvert";
import { sequelize } from "@/config/database";

extendZodWithOpenApi(z);

export type Session = z.infer<typeof SessionSchema>;
export const SessionSchema = z.object({
  id: z.number(),
  courtId: z.number(),
  datePlay: z.string().datetime(),
  courtCost: z.number(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetSessionSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export const CreateSessionSchema = z.object({
  body: SessionSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }),
});

export const UpdateSessionSchema = z.object({
  body: SessionSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }).partial(),
});

const sessionSequelizeAttributes = zodToSequelizeAttributes(
  SessionSchema.omit({ id: true })
);

export const SessionModel = sequelize.define(
  "sessions",
  sessionSequelizeAttributes
);
