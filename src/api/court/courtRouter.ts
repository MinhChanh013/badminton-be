import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { authMiddleware } from "@/common/middleware/authMiddleware";
import { jsonRquestBody, validateRequest } from "@/common/utils/httpHandlers";
import {
  CourtSchema,
  CreateCourtSchema,
  GetCourtSchema,
  UpdateCourtSchema,
} from "./courtModel";
import { courtController } from "./courtController";

export const courtRegistry = new OpenAPIRegistry();
export const courtRouter: Router = express.Router();

courtRegistry.register("Court", CourtSchema);

courtRegistry.registerPath({
  method: "get",
  path: "/courts",
  tags: ["Court"],
  responses: createApiResponse(z.array(CourtSchema), "Success"),
});

courtRouter.get("/", authMiddleware, courtController.getCourts);

courtRegistry.registerPath({
  method: "get",
  path: "/courts/{id}",
  tags: ["Court"],
  request: { params: GetCourtSchema.shape.params },
  responses: createApiResponse(CourtSchema, "Success"),
});

courtRouter.get(
  "/:id",
  authMiddleware,
  validateRequest(GetCourtSchema),
  courtController.getCourt
);

courtRegistry.registerPath({
  method: "post",
  path: "/courts",
  tags: ["Court"],
  request: {
    body: jsonRquestBody(CreateCourtSchema.shape.body),
  },
  responses: createApiResponse(CourtSchema, "Success"),
});

courtRouter.post(
  "/",
  authMiddleware,
  validateRequest(CreateCourtSchema, true),
  courtController.createCourt
);

courtRegistry.registerPath({
  method: "put",
  path: "/courts/{id}",
  tags: ["Court"],
  request: {
    params: GetCourtSchema.shape.params,
    body: jsonRquestBody(UpdateCourtSchema.shape.body),
  },
  responses: createApiResponse(CourtSchema, "Success"),
});

courtRouter.put(
  "/:id",
  validateRequest(GetCourtSchema),
  validateRequest(UpdateCourtSchema, true),
  courtController.updateCourt
);

courtRegistry.registerPath({
  method: "delete",
  path: "/courts/{id}",
  tags: ["Court"],
  request: {
    params: GetCourtSchema.shape.params,
  },
  responses: createApiResponse(z.object({}), "Success"),
});

courtRouter.delete(
  "/:id",
  validateRequest(GetCourtSchema),
  courtController.deleteCourt
);
