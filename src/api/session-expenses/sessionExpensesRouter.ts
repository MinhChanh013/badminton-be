import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { authMiddleware } from "@/common/middleware/authMiddleware";
import { jsonRquestBody, validateRequest } from "@/common/utils/httpHandlers";

import {
  CreateSessionExpensesSchema,
  GetSessionExpensesSchema,
  SessionExpensesSchema,
  UpdateSessionExpensesSchema,
} from "./sessionExpensesModel";
import { sessionExpensesController } from "./sessionExpensesController";

export const sessionExpensesRegistry = new OpenAPIRegistry();
export const sessionExpensesRouter: Router = express.Router();

sessionExpensesRegistry.register("Session Expenses", SessionExpensesSchema);

sessionExpensesRegistry.registerPath({
  method: "get",
  path: "/session-expenses",
  tags: ["Session Expenses"],
  responses: createApiResponse(z.array(SessionExpensesSchema), "Success"),
});

sessionExpensesRouter.get(
  "/",
  authMiddleware,
  sessionExpensesController.getSessionExpensess
);

sessionExpensesRegistry.registerPath({
  method: "get",
  path: "/session-expenses/{id}",
  tags: ["Session Expenses"],
  request: { params: GetSessionExpensesSchema.shape.params },
  responses: createApiResponse(SessionExpensesSchema, "Success"),
});

sessionExpensesRouter.get(
  "/:id",
  authMiddleware,
  validateRequest(GetSessionExpensesSchema),
  sessionExpensesController.getSessionExpenses
);

sessionExpensesRegistry.registerPath({
  method: "post",
  path: "/session-expenses",
  tags: ["Session Expenses"],
  request: {
    body: jsonRquestBody(CreateSessionExpensesSchema.shape.body),
  },
  responses: createApiResponse(SessionExpensesSchema, "Success"),
});

sessionExpensesRouter.post(
  "/",
  authMiddleware,
  validateRequest(CreateSessionExpensesSchema, true),
  sessionExpensesController.createSessionExpenses
);

sessionExpensesRegistry.registerPath({
  method: "put",
  path: "/session-expenses/{id}",
  tags: ["Session Expenses"],
  request: {
    params: GetSessionExpensesSchema.shape.params,
    body: jsonRquestBody(UpdateSessionExpensesSchema.shape.body),
  },
  responses: createApiResponse(SessionExpensesSchema, "Success"),
});

sessionExpensesRouter.put(
  "/:id",
  validateRequest(GetSessionExpensesSchema),
  validateRequest(UpdateSessionExpensesSchema, true),
  sessionExpensesController.updateSessionExpenses
);

sessionExpensesRegistry.registerPath({
  method: "delete",
  path: "/session-expenses/{id}",
  tags: ["Session Expenses"],
  request: {
    params: GetSessionExpensesSchema.shape.params,
  },
  responses: createApiResponse(z.object({}), "Success"),
});

sessionExpensesRouter.delete(
  "/:id",
  validateRequest(GetSessionExpensesSchema),
  sessionExpensesController.deleteSessionExpenses
);
