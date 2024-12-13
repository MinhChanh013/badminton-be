import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";
import { zodToSequelizeAttributes } from "@/common/utils/defineConvert";
import { sequelize } from "@/config/database";

extendZodWithOpenApi(z);

export type Discount = z.infer<typeof DiscountSchema>;
export const DiscountSchema = z.object({
  id: z.number(),
  name: z.string().max(100),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetDiscountSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export const CreateDiscountSchema = z.object({
  body: DiscountSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }),
});

export const UpdateDiscountSchema = z.object({
  body: DiscountSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }).partial(),
});

const discountSequelizeAttributes = zodToSequelizeAttributes(
  DiscountSchema.omit({ id: true })
);

export const DiscountModel = sequelize.define(
  "discounts",
  discountSequelizeAttributes
);
