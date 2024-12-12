import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";
import { zodToSequelizeAttributes } from "@/common/utils/defineConvert";
import { sequelize } from "@/config/database";

extendZodWithOpenApi(z);

export type Player = z.infer<typeof PlayerSchema>;
export const PlayerSchema = z.object({
  id: z.number(),
  name: z.string().max(100),
  phoneNumber: z.string().max(20),
  email: z.string().email().max(50),
  userName: z.string().max(50),
  password: z.string().max(50),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetPlayerSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export const CreatePlayerSchema = z.object({
  body: PlayerSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }).partial({
    phoneNumber: true,
    email: true,
  }),
});

export const UpdatePlayerSchema = z.object({
  body: PlayerSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }).partial(),
});

const playerSequelizeAttributes = zodToSequelizeAttributes(
  PlayerSchema.omit({ id: true })
);

export const PlayerModel = sequelize.define(
  "players",
  playerSequelizeAttributes
);
