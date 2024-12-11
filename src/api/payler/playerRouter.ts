import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { jsonRquestBody, validateRequest } from "@/common/utils/httpHandlers";
import { playerController } from "./palyerController";
import {
  CreatePlayerSchema,
  GetPlayerSchema,
  PlayerSchema,
  UpdatePlayerSchema,
} from "./playerModel";

export const playerRegistry = new OpenAPIRegistry();
export const playerRouter: Router = express.Router();

playerRegistry.register("Player", PlayerSchema);

playerRegistry.registerPath({
  method: "get",
  path: "/players",
  tags: ["Player"],
  responses: createApiResponse(z.array(PlayerSchema), "Success"),
});

playerRouter.get("/", playerController.getPlayers);

playerRegistry.registerPath({
  method: "get",
  path: "/players/{id}",
  tags: ["Player"],
  request: { params: GetPlayerSchema.shape.params },
  responses: createApiResponse(PlayerSchema, "Success"),
});

playerRouter.get(
  "/:id",
  validateRequest(GetPlayerSchema),
  playerController.getPlayer
);

playerRegistry.registerPath({
  method: "post",
  path: "/players",
  tags: ["Player"],
  request: {
    body: jsonRquestBody(CreatePlayerSchema.shape.body),
  },
  responses: createApiResponse(PlayerSchema, "Success"),
});

playerRouter.post(
  "/",
  validateRequest(CreatePlayerSchema, true),
  playerController.createPlayer
);

playerRegistry.registerPath({
  method: "put",
  path: "/players/{id}",
  tags: ["Player"],
  request: {
    params: GetPlayerSchema.shape.params,
    body: jsonRquestBody(UpdatePlayerSchema.shape.body),
  },
  responses: createApiResponse(PlayerSchema, "Success"),
});

playerRouter.put(
  "/:id",
  validateRequest(GetPlayerSchema),
  validateRequest(UpdatePlayerSchema, true),
  playerController.updatePlayer
);
