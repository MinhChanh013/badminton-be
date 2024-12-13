import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";
import { zodToSequelizeAttributes } from "@/common/utils/defineConvert";
import { sequelize } from "@/config/database";

extendZodWithOpenApi(z);

export type SessionExpenses = z.infer<typeof SessionExpensesSchema>;
export const SessionExpensesSchema = z.object({
  id: z.number(),
  sessionId: z.number(),
  playerId: z.number(),
  expensesId: z.number(),
  quantity: z.number(),
  amountTotal: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetSessionExpensesSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export const CreateSessionExpensesSchema = z.object({
  body: SessionExpensesSchema.omit({
    id: true,
    playerId: true,
    createdAt: true,
    updatedAt: true,
  }),
});

export const UpdateSessionExpensesSchema = z.object({
  body: SessionExpensesSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }).partial(),
});

const sessionExpensesSequelizeAttributes = zodToSequelizeAttributes(
  SessionExpensesSchema.omit({ id: true })
);

export const SessionExpensesModel = sequelize.define(
  "session_expenses",
  sessionExpensesSequelizeAttributes
);
