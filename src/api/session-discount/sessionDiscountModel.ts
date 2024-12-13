import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";
import { zodToSequelizeAttributes } from "@/common/utils/defineConvert";
import { sequelize } from "@/config/database";

extendZodWithOpenApi(z);

export type SessionDiscount = z.infer<typeof SessionDiscountSchema>;
export const SessionDiscountSchema = z.object({
  id: z.number(),
  discountId: z.number(),
  sessionId: z.number(),
  playerId: z.number(),
  percent: z.number(),
  totalAmount: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetSessionDiscountSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export const CreateSessionDiscountSchema = z.object({
  body: SessionDiscountSchema.omit({
    id: true,
    playerId: true,
    percent: true,
    createdAt: true,
    updatedAt: true,
  }),
});

export const UpdateSessionDiscountSchema = z.object({
  body: SessionDiscountSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }).partial(),
});

const sessionDiscountSequelizeAttributes = zodToSequelizeAttributes(
  SessionDiscountSchema.omit({ id: true })
);

export const SessionDiscountModel = sequelize.define(
  "session_discounts",
  sessionDiscountSequelizeAttributes
);
