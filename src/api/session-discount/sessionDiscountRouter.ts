import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { authMiddleware } from "@/common/middleware/authMiddleware";
import { jsonRquestBody, validateRequest } from "@/common/utils/httpHandlers";

import {
  CreateSessionDiscountSchema,
  GetSessionDiscountSchema,
  SessionDiscountSchema,
  UpdateSessionDiscountSchema,
} from "./sessionDiscountModel";
import { sessionDiscountController } from "./sessionDiscountController";

export const sessionDiscountRegistry = new OpenAPIRegistry();
export const sessionDiscountRouter: Router = express.Router();

sessionDiscountRegistry.register("Session Discount", SessionDiscountSchema);

sessionDiscountRegistry.registerPath({
  method: "get",
  path: "/session-discount",
  tags: ["Session Discount"],
  responses: createApiResponse(z.array(SessionDiscountSchema), "Success"),
});

sessionDiscountRouter.get(
  "/",
  authMiddleware,
  sessionDiscountController.getSessionDiscounts
);

sessionDiscountRegistry.registerPath({
  method: "get",
  path: "/session-discount/{id}",
  tags: ["Session Discount"],
  request: { params: GetSessionDiscountSchema.shape.params },
  responses: createApiResponse(SessionDiscountSchema, "Success"),
});

sessionDiscountRouter.get(
  "/:id",
  authMiddleware,
  validateRequest(GetSessionDiscountSchema),
  sessionDiscountController.getSessionDiscount
);

sessionDiscountRegistry.registerPath({
  method: "post",
  path: "/session-discount",
  tags: ["Session Discount"],
  request: {
    body: jsonRquestBody(CreateSessionDiscountSchema.shape.body),
  },
  responses: createApiResponse(SessionDiscountSchema, "Success"),
});

sessionDiscountRouter.post(
  "/",
  authMiddleware,
  validateRequest(CreateSessionDiscountSchema, true),
  sessionDiscountController.createSessionDiscount
);

sessionDiscountRegistry.registerPath({
  method: "put",
  path: "/session-discount/{id}",
  tags: ["Session Discount"],
  request: {
    params: GetSessionDiscountSchema.shape.params,
    body: jsonRquestBody(UpdateSessionDiscountSchema.shape.body),
  },
  responses: createApiResponse(SessionDiscountSchema, "Success"),
});

sessionDiscountRouter.put(
  "/:id",
  validateRequest(GetSessionDiscountSchema),
  validateRequest(UpdateSessionDiscountSchema, true),
  sessionDiscountController.updateSessionDiscount
);

sessionDiscountRegistry.registerPath({
  method: "delete",
  path: "/session-discount/{id}",
  tags: ["Session Discount"],
  request: {
    params: GetSessionDiscountSchema.shape.params,
  },
  responses: createApiResponse(z.object({}), "Success"),
});

sessionDiscountRouter.delete(
  "/:id",
  validateRequest(GetSessionDiscountSchema),
  sessionDiscountController.deleteSessionDiscount
);
