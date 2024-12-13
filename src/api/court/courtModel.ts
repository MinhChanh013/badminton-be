import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";
import { zodToSequelizeAttributes } from "@/common/utils/defineConvert";
import { sequelize } from "@/config/database";

extendZodWithOpenApi(z);

export type Court = z.infer<typeof CourtSchema>;
export const CourtSchema = z.object({
  id: z.number(),
  name: z.string().max(100),
  address: z.string().max(255),
  location: z.string().max(255),
  priceFixed: z.number(),
  phoneNumber: z.string().max(20),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetCourtSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export const CreateCourtSchema = z.object({
  body: CourtSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }).partial({
    phoneNumber: true,
    location: true,
  }),
});

export const UpdateCourtSchema = z.object({
  body: CourtSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }).partial(),
});

const courtSequelizeAttributes = zodToSequelizeAttributes(
  CourtSchema.omit({ id: true })
);

export const CourtModel = sequelize.define("courts", courtSequelizeAttributes);
