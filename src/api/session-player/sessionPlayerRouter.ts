import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { authMiddleware } from "@/common/middleware/authMiddleware";
import { jsonRquestBody, validateRequest } from "@/common/utils/httpHandlers";

import { sessionPlayerController } from "./sessionPlayerController";
import {
  CreateSessionPlayerSchema,
  GetSessionPlayerSchema,
  SessionPlayerSchema,
  UpdateSessionPlayerSchema,
} from "./sessionPlayerModel";

export const sessionPlayerRegistry = new OpenAPIRegistry();
export const sessionPlayerRouter: Router = express.Router();

sessionPlayerRegistry.register("SessionPlayer", SessionPlayerSchema);

sessionPlayerRegistry.registerPath({
  method: "get",
  path: "/session-player",
  tags: ["Session Player"],
  responses: createApiResponse(z.array(SessionPlayerSchema), "Success"),
});

sessionPlayerRouter.get(
  "/",
  authMiddleware,
  sessionPlayerController.getSessionPlayers
);

sessionPlayerRegistry.registerPath({
  method: "get",
  path: "/session-player/{id}",
  tags: ["Session Player"],
  request: { params: GetSessionPlayerSchema.shape.params },
  responses: createApiResponse(SessionPlayerSchema, "Success"),
});

sessionPlayerRouter.get(
  "/:id",
  authMiddleware,
  validateRequest(GetSessionPlayerSchema),
  sessionPlayerController.getSessionPlayer
);

sessionPlayerRegistry.registerPath({
  method: "post",
  path: "/session-player",
  tags: ["Session Player"],
  request: {
    body: jsonRquestBody(CreateSessionPlayerSchema.shape.body),
  },
  responses: createApiResponse(SessionPlayerSchema, "Success"),
});

sessionPlayerRouter.post(
  "/",
  authMiddleware,
  validateRequest(CreateSessionPlayerSchema, true),
  sessionPlayerController.createSessionPlayer
);

sessionPlayerRegistry.registerPath({
  method: "put",
  path: "/session-player/{id}",
  tags: ["Session Player"],
  request: {
    params: GetSessionPlayerSchema.shape.params,
    body: jsonRquestBody(UpdateSessionPlayerSchema.shape.body),
  },
  responses: createApiResponse(SessionPlayerSchema, "Success"),
});

sessionPlayerRouter.put(
  "/:id",
  validateRequest(GetSessionPlayerSchema),
  validateRequest(UpdateSessionPlayerSchema, true),
  sessionPlayerController.updateSessionPlayer
);

sessionPlayerRegistry.registerPath({
  method: "delete",
  path: "/session-player/{id}",
  tags: ["Session Player"],
  request: {
    params: GetSessionPlayerSchema.shape.params,
  },
  responses: createApiResponse(z.object({}), "Success"),
});

sessionPlayerRouter.delete(
  "/:id",
  validateRequest(GetSessionPlayerSchema),
  sessionPlayerController.deleteSessionPlayer
);
