import { StatusCodes } from "http-status-codes";

import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { z } from "zod";
import {
  CreateSessionSchema,
  Session,
  UpdateSessionSchema,
} from "./sessionModel";
import { SessionRepository } from "./sessionRepository";

export class SessionService {
  private sessionRepository: SessionRepository;

  constructor(repository: SessionRepository = new SessionRepository()) {
    this.sessionRepository = repository;
  }

  // Retrieves all users from the database
  async findAll(): Promise<ServiceResponse<Session[] | null>> {
    try {
      const sessions = await this.sessionRepository.findAllAsync();
      if (!sessions) {
        return ServiceResponse.failure(
          "No Sessions found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<Session[]>("Sessions found", sessions);
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
  async findById(id: number): Promise<ServiceResponse<Session | null>> {
    try {
      const session = await this.sessionRepository.findByIdAsync(id);
      if (!session) {
        return ServiceResponse.failure(
          "Session not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<Session>("Session found", session);
    } catch (ex) {
      const errorMessage = `Error finding session with id ${id}:, ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding session.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async create(
    body: z.infer<typeof CreateSessionSchema.shape.body>
  ): Promise<ServiceResponse<Session | null>> {
    try {
      const session = await this.sessionRepository.createAsync(body);
      return ServiceResponse.success<Session>("Session created", session);
    } catch (ex) {
      const errorMessage = `Error creating session: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating session.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(
    id: number,
    body: z.infer<typeof UpdateSessionSchema.shape.body>
  ): Promise<ServiceResponse<Session | null>> {
    try {
      // check session exist in db with phone_number or username
      const session = await this.findById(id);
      if (session.success) {
        await this.sessionRepository.updateAsync(id, body);
        return ServiceResponse.success<Session>("Session updated", {
          ...session.responseObject,
          ...body,
        } as Session);
      } else {
        return ServiceResponse.failure(
          "Session with id not found",
          null,
          StatusCodes.CONFLICT
        );
      }
    } catch (ex) {
      const errorMessage = `Error creating session: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating session.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async delete(id: number): Promise<ServiceResponse<boolean>> {
    try {
      const session = await this.findById(id);
      if (session.success) {
        await this.sessionRepository.deleteAsync(id);
        return ServiceResponse.success<boolean>("Session deleted", true);
      } else {
        return ServiceResponse.failure(
          "Session with id not found",
          false,
          StatusCodes.CONFLICT
        );
      }
    } catch (error) {
      console.error("Error deleting session:", error);
      throw new Error("Failed to delete session");
    }
  }
}

export const sessionService = new SessionService();
