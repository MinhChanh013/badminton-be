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

const CreateListPlayerSchema = z.object({
  id: z.number(),
  playerId: z.number(),
  totalAmount: z.number(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  isPayment: z.boolean(),
});

const CreateListDiscountSchema = z.object({
  id: z.number(),
  playerId: z.number().optional(),
  discountId: z.number(),
  totalAmount: z.number(),
});

const CreateListExpensesSchema = z.object({
  id: z.number(),
  playerId: z.number().optional(),
  expensesId: z.number(),
  amountTotal: z.number(),
  quantity: z.number(),
});

export const CreateItemSessionSchema = SessionSchema.omit({
  createdAt: true,
  updatedAt: true,
  id: true,
});

export const CreateSessionSchema = z.object({
  body: z.array(
    CreateItemSessionSchema.merge(
      z.object({
        players: z.array(CreateListPlayerSchema.omit({ id: true })),
      })
    )
      .merge(
        z.object({
          discounts: z.array(CreateListDiscountSchema.omit({ id: true })),
        })
      )
      .merge(
        z.object({
          expenses: z.array(CreateListExpensesSchema.omit({ id: true })),
        })
      )
  ),
});

export const ReponseCreateSessionSchema = z.object({
  body: z.array(
    z
      .object({ id: z.number() })
      .merge(CreateItemSessionSchema)
      .merge(
        z.object({
          players: z.array(CreateListPlayerSchema),
        })
      )
      .merge(
        z.object({
          discounts: z.array(CreateListDiscountSchema),
        })
      )
      .merge(
        z.object({
          expenses: z.array(CreateListExpensesSchema),
        })
      )
  ),
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
