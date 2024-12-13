import { StatusCodes } from "http-status-codes";

import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { z } from "zod";
import {
  CreateSessionPlayerSchema,
  SessionPlayer,
  UpdateSessionPlayerSchema,
} from "./sessionPlayerModel";
import { SessionPlayerRepository } from "./sessionPlayerRepository";

export class SessionPlayerService {
  private sessionPlayerRepository: SessionPlayerRepository;

  constructor(
    repository: SessionPlayerRepository = new SessionPlayerRepository()
  ) {
    this.sessionPlayerRepository = repository;
  }

  // Retrieves all users from the database
  async findAll(): Promise<ServiceResponse<SessionPlayer[] | null>> {
    try {
      const sessionPlayers = await this.sessionPlayerRepository.findAllAsync();
      if (!sessionPlayers) {
        return ServiceResponse.failure(
          "No Session Players found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<SessionPlayer[]>(
        "Session Players found",
        sessionPlayers
      );
    } catch (ex) {
      const errorMessage = `Error finding all sessions: $${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving sessions.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Retrieves a single user by their ID
  async findById(id: number): Promise<ServiceResponse<SessionPlayer | null>> {
    try {
      const sessionPlayer = await this.sessionPlayerRepository.findByIdAsync(
        id
      );
      if (!sessionPlayer) {
        return ServiceResponse.failure(
          "Session Player not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<SessionPlayer>(
        "Session Player found",
        sessionPlayer
      );
    } catch (ex) {
      const errorMessage = `Error finding session player with id ${id}:, ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding session player.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async create(
    body: z.infer<typeof CreateSessionPlayerSchema.shape.body>
  ): Promise<ServiceResponse<SessionPlayer | null>> {
    try {
      const sessionPlayer = await this.sessionPlayerRepository.createAsync(
        body
      );
      return ServiceResponse.success<SessionPlayer>(
        "Session Player created",
        sessionPlayer
      );
    } catch (ex) {
      const errorMessage = `Error creating session player: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating session player.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(
    id: number,
    body: z.infer<typeof UpdateSessionPlayerSchema.shape.body>
  ): Promise<ServiceResponse<SessionPlayer | null>> {
    try {
      // check session player exist in db with phone_number or username
      const sessionPlayer = await this.findById(id);
      if (sessionPlayer.success) {
        await this.sessionPlayerRepository.updateAsync(id, body);
        return ServiceResponse.success<SessionPlayer>(
          "Session Player updated",
          {
            ...sessionPlayer.responseObject,
            ...body,
          } as SessionPlayer
        );
      } else {
        return ServiceResponse.failure(
          "Session Player with id not found",
          null,
          StatusCodes.CONFLICT
        );
      }
    } catch (ex) {
      const errorMessage = `Error creating session player: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating session player.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async delete(id: number): Promise<ServiceResponse<boolean>> {
    try {
      const sessionPlayer = await this.findById(id);
      if (sessionPlayer.success) {
        await this.sessionPlayerRepository.deleteAsync(id);
        return ServiceResponse.success<boolean>("Session Player deleted", true);
      } else {
        return ServiceResponse.failure(
          "Session Player with id not found",
          false,
          StatusCodes.CONFLICT
        );
      }
    } catch (error) {
      console.error("Error deleting session player:", error);
      throw new Error("Failed to delete session player");
    }
  }
}

export const sessionPlayerService = new SessionPlayerService();
