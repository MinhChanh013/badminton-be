import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { authMiddleware } from "@/common/middleware/authMiddleware";
import { jsonRquestBody, validateRequest } from "@/common/utils/httpHandlers";

import { expensesController } from "./expensesController";
import {
  CreateExpensesSchema,
  ExpensesSchema,
  GetExpensesSchema,
  UpdateExpensesSchema,
} from "./expensesModel";

export const expensesRegistry = new OpenAPIRegistry();
export const expensesRouter: Router = express.Router();

expensesRegistry.register("Expenses", ExpensesSchema);

expensesRegistry.registerPath({
  method: "get",
  path: "/expenses",
  tags: ["Expenses"],
  responses: createApiResponse(z.array(ExpensesSchema), "Success"),
});

expensesRouter.get("/", authMiddleware, expensesController.getExpensess);

expensesRegistry.registerPath({
  method: "get",
  path: "/expenses/{id}",
  tags: ["Expenses"],
  request: { params: GetExpensesSchema.shape.params },
  responses: createApiResponse(ExpensesSchema, "Success"),
});

expensesRouter.get(
  "/:id",
  authMiddleware,
  validateRequest(GetExpensesSchema),
  expensesController.getExpenses
);

expensesRegistry.registerPath({
  method: "post",
  path: "/expenses",
  tags: ["Expenses"],
  request: {
    body: jsonRquestBody(CreateExpensesSchema.shape.body),
  },
  responses: createApiResponse(ExpensesSchema, "Success"),
});

expensesRouter.post(
  "/",
  authMiddleware,
  validateRequest(CreateExpensesSchema, true),
  expensesController.createExpenses
);

expensesRegistry.registerPath({
  method: "put",
  path: "/expenses/{id}",
  tags: ["Expenses"],
  request: {
    params: GetExpensesSchema.shape.params,
    body: jsonRquestBody(UpdateExpensesSchema.shape.body),
  },
  responses: createApiResponse(ExpensesSchema, "Success"),
});

expensesRouter.put(
  "/:id",
  validateRequest(GetExpensesSchema),
  validateRequest(UpdateExpensesSchema, true),
  expensesController.updateExpenses
);

expensesRegistry.registerPath({
  method: "delete",
  path: "/expenses/{id}",
  tags: ["Expenses"],
  request: {
    params: GetExpensesSchema.shape.params,
  },
  responses: createApiResponse(z.object({}), "Success"),
});

expensesRouter.delete(
  "/:id",
  validateRequest(GetExpensesSchema),
  expensesController.deleteExpenses
);
