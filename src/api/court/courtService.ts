import { StatusCodes } from "http-status-codes";

import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { Court, CreateCourtSchema, UpdateCourtSchema } from "./courtModel";
import { CourtRepository } from "./courtRepository";
import { z } from "zod";

export class CourtService {
  private courtRepository: CourtRepository;

  constructor(repository: CourtRepository = new CourtRepository()) {
    this.courtRepository = repository;
  }

  // Retrieves all users from the database
  async findAll(): Promise<ServiceResponse<Court[] | null>> {
    try {
      const courts = await this.courtRepository.findAllAsync();
      if (!courts) {
        return ServiceResponse.failure(
          "No Courts found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<Court[]>("Courts found", courts);
    } catch (ex) {
      const errorMessage = `Error finding all courts: $${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving courts.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Retrieves a single user by their ID
  async findById(id: number): Promise<ServiceResponse<Court | null>> {
    try {
      const court = await this.courtRepository.findByIdAsync(id);
      if (!court) {
        return ServiceResponse.failure(
          "Court not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<Court>("Court found", court);
    } catch (ex) {
      const errorMessage = `Error finding court with id ${id}:, ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding court.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async create(
    body: z.infer<typeof CreateCourtSchema.shape.body>
  ): Promise<ServiceResponse<Court | null>> {
    try {
      const court = await this.courtRepository.createAsync(body);
      return ServiceResponse.success<Court>("Court created", court);
    } catch (ex) {
      const errorMessage = `Error creating court: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating court.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(
    id: number,
    body: z.infer<typeof UpdateCourtSchema.shape.body>
  ): Promise<ServiceResponse<Court | null>> {
    try {
      // check court exist in db with phone_number or username
      const court = await this.findById(id);
      if (court.success) {
        await this.courtRepository.updateAsync(id, body);
        return ServiceResponse.success<Court>("Court updated", {
          ...court.responseObject,
          ...body,
        } as Court);
      } else {
        return ServiceResponse.failure(
          "Court with id not found",
          null,
          StatusCodes.CONFLICT
        );
      }
    } catch (ex) {
      const errorMessage = `Error creating court: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating court.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async delete(id: number): Promise<ServiceResponse<boolean>> {
    try {
      const court = await this.findById(id);
      if (court.success) {
        await this.courtRepository.deleteAsync(id);
        return ServiceResponse.success<boolean>("Court deleted", true);
      } else {
        return ServiceResponse.failure(
          "Court with id not found",
          false,
          StatusCodes.CONFLICT
        );
      }
    } catch (error) {
      console.error("Error deleting court:", error);
      throw new Error("Failed to delete court");
    }
  }
}

export const courtService = new CourtService();
