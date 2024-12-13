import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { authMiddleware } from "@/common/middleware/authMiddleware";
import { jsonRquestBody, validateRequest } from "@/common/utils/httpHandlers";

import { sessionController } from "./sessionController";
import {
  CreateSessionSchema,
  SessionSchema,
  GetSessionSchema,
  UpdateSessionSchema,
} from "./sessionModel";

export const sessionRegistry = new OpenAPIRegistry();
export const sessionRouter: Router = express.Router();

sessionRegistry.register("Sessions", SessionSchema);

sessionRegistry.registerPath({
  method: "get",
  path: "/sessions",
  tags: ["Session"],
  responses: createApiResponse(z.array(SessionSchema), "Success"),
});

sessionRouter.get("/", authMiddleware, sessionController.getSessions);

sessionRegistry.registerPath({
  method: "get",
  path: "/sessions/{id}",
  tags: ["Session"],
  request: { params: GetSessionSchema.shape.params },
  responses: createApiResponse(SessionSchema, "Success"),
});

sessionRouter.get(
  "/:id",
  authMiddleware,
  validateRequest(GetSessionSchema),
  sessionController.getSession
);

sessionRegistry.registerPath({
  method: "post",
  path: "/sessions",
  tags: ["Session"],
  request: {
    body: jsonRquestBody(CreateSessionSchema.shape.body),
  },
  responses: createApiResponse(SessionSchema, "Success"),
});

sessionRouter.post(
  "/",
  authMiddleware,
  validateRequest(CreateSessionSchema, true),
  sessionController.createSession
);

sessionRegistry.registerPath({
  method: "put",
  path: "/sessions/{id}",
  tags: ["Session"],
  request: {
    params: GetSessionSchema.shape.params,
    body: jsonRquestBody(UpdateSessionSchema.shape.body),
  },
  responses: createApiResponse(SessionSchema, "Success"),
});

sessionRouter.put(
  "/:id",
  validateRequest(GetSessionSchema),
  validateRequest(UpdateSessionSchema, true),
  sessionController.updateSession
);

sessionRegistry.registerPath({
  method: "delete",
  path: "/sessions/{id}",
  tags: ["Session"],
  request: {
    params: GetSessionSchema.shape.params,
  },
  responses: createApiResponse(z.object({}), "Success"),
});

sessionRouter.delete(
  "/:id",
  validateRequest(GetSessionSchema),
  sessionController.deleteSession
);
