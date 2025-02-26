import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import {
  AuthSchema,
  FortgotPasswordSchema,
  LoginSchema,
  logoutSchema,
  refreshTokenSchema,
} from "./authModel";
import { authController } from "./authController";
import { jsonRquestBody, validateRequest } from "@/common/utils/httpHandlers";
import { z } from "zod";

export const authRegistry = new OpenAPIRegistry();
export const authRouter: Router = express.Router();

authRegistry.registerPath({
  method: "post",
  path: "/auth/login",
  tags: ["Auth"],
  request: {
    body: jsonRquestBody(LoginSchema.shape.body),
  },
  responses: createApiResponse(AuthSchema, "Success"),
});
authRouter.post(
  "/login",
  validateRequest(LoginSchema, true),
  authController.login
);

authRegistry.registerPath({
  method: "post",
  path: "/auth/logout",
  tags: ["Auth"],
  request: {
    body: jsonRquestBody(logoutSchema.shape.body),
  },
  responses: createApiResponse(z.object({}), "Success"),
});
authRouter.post(
  "/logout",
  validateRequest(logoutSchema, true),
  authController.logout
);

authRegistry.registerPath({
  method: "post",
  path: "/auth/refresh-token",
  tags: ["Auth"],
  request: {
    body: jsonRquestBody(refreshTokenSchema.shape.body),
  },
  responses: createApiResponse(z.object({ token: z.string() }), "Success"),
});
authRouter.post(
  "/refresh-token",
  validateRequest(refreshTokenSchema, true),
  authController.refreshToken
);

authRegistry.registerPath({
  method: "post",
  path: "/auth/forgot-password",
  tags: ["Auth"],
  request: {
    body: jsonRquestBody(FortgotPasswordSchema.shape.body),
  },
  responses: createApiResponse(z.boolean(), "Success"),
});
authRouter.post(
  "/forgot-password",
  validateRequest(FortgotPasswordSchema, true),
  authController.refreshToken
);
