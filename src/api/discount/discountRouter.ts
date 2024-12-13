import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { authMiddleware } from "@/common/middleware/authMiddleware";
import { jsonRquestBody, validateRequest } from "@/common/utils/httpHandlers";

import { discountController } from "./discountController";
import {
  CreateDiscountSchema,
  DiscountSchema,
  GetDiscountSchema,
  UpdateDiscountSchema,
} from "./discountModel";

export const discountRegistry = new OpenAPIRegistry();
export const discountRouter: Router = express.Router();

discountRegistry.register("Discount", DiscountSchema);

discountRegistry.registerPath({
  method: "get",
  path: "/discounts",
  tags: ["Discount"],
  responses: createApiResponse(z.array(DiscountSchema), "Success"),
});

discountRouter.get("/", authMiddleware, discountController.getDiscounts);

discountRegistry.registerPath({
  method: "get",
  path: "/discounts/{id}",
  tags: ["Discount"],
  request: { params: GetDiscountSchema.shape.params },
  responses: createApiResponse(DiscountSchema, "Success"),
});

discountRouter.get(
  "/:id",
  authMiddleware,
  validateRequest(GetDiscountSchema),
  discountController.getDiscount
);

discountRegistry.registerPath({
  method: "post",
  path: "/discounts",
  tags: ["Discount"],
  request: {
    body: jsonRquestBody(CreateDiscountSchema.shape.body),
  },
  responses: createApiResponse(DiscountSchema, "Success"),
});

discountRouter.post(
  "/",
  authMiddleware,
  validateRequest(CreateDiscountSchema, true),
  discountController.createDiscount
);

discountRegistry.registerPath({
  method: "put",
  path: "/discounts/{id}",
  tags: ["Discount"],
  request: {
    params: GetDiscountSchema.shape.params,
    body: jsonRquestBody(UpdateDiscountSchema.shape.body),
  },
  responses: createApiResponse(DiscountSchema, "Success"),
});

discountRouter.put(
  "/:id",
  validateRequest(GetDiscountSchema),
  validateRequest(UpdateDiscountSchema, true),
  discountController.updateDiscount
);

discountRegistry.registerPath({
  method: "delete",
  path: "/discounts/{id}",
  tags: ["Discount"],
  request: {
    params: GetDiscountSchema.shape.params,
  },
  responses: createApiResponse(z.object({}), "Success"),
});

discountRouter.delete(
  "/:id",
  validateRequest(GetDiscountSchema),
  discountController.deleteDiscount
);
