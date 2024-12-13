import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";
import { zodToSequelizeAttributes } from "@/common/utils/defineConvert";
import { sequelize } from "@/config/database";

extendZodWithOpenApi(z);

export type Expenses = z.infer<typeof ExpensesSchema>;
export const ExpensesSchema = z.object({
  id: z.number(),
  name: z.string().max(100),
  amount: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetExpensesSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export const CreateExpensesSchema = z.object({
  body: ExpensesSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }),
});

export const UpdateExpensesSchema = z.object({
  body: ExpensesSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }).partial(),
});

const expensesSequelizeAttributes = zodToSequelizeAttributes(
  ExpensesSchema.omit({ id: true })
);

export const ExpensesModel = sequelize.define(
  "expenses",
  expensesSequelizeAttributes
);
