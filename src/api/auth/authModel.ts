import { zodToSequelizeAttributes } from "@/common/utils/defineConvert";
import { sequelize } from "@/config/database";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export type Auth = z.infer<typeof AuthSchema>;
export const AuthSchema = z.object({
  id: z.number(),
  name: z.string().max(100),
  phoneNumber: z.string().max(20),
  email: z.string().email().max(50),
  userName: z.string().max(50),
  password: z.string().max(50),
  createdAt: z.date(),
  updatedAt: z.date(),
  token: z.string(),
  refreshToken: z.string(),
});

export const LoginSchema = z.object({
  body: z.object({
    userName: z.string().max(50),
    password: z.string().max(50),
  }),
});

export const logoutSchema = z.object({
  body: z.object({
    refreshToken: z.string().max(200),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().max(200),
  }),
});

export const RefreshTokenSchema = z.object({
  id: z.number(),
  playerId: z.number(),
  refreshToken: z.string().max(200),
  ipAddress: z.string().max(45),
  expriresAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type RefreshToken = z.infer<typeof RefreshTokenSchema>;

export const CreateRefreshToken = RefreshTokenSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const FortgotPasswordSchema = z.object({
  body: z.object({
    phoneNumber: z.string().max(20),
    otp: z.string().max(6),
  }),
});

const refreshTokenSequelizeAttributes = zodToSequelizeAttributes(
  RefreshTokenSchema.omit({ id: true })
);

export const RefreshTokenModel = sequelize.define(
  "refresh_tokens",
  refreshTokenSequelizeAttributes
);
