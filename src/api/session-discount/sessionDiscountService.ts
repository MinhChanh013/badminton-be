import { StatusCodes } from "http-status-codes";

import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { z } from "zod";
import {
  CreateSessionDiscountSchema,
  SessionDiscount,
  UpdateSessionDiscountSchema,
} from "./sessionDiscountModel";
import { SessionDiscountRepository } from "./sessionDiscountRepository";
import { DiscountRepository } from "../discount/discountRepository";
import { PlayerRepository } from "../payler/playerRepository";
import { SessionRepository } from "../session/sessionRepository";

export class SessionDiscountService {
  private sessionDiscountRepository: SessionDiscountRepository;
  private discountRepository: DiscountRepository;
  private playerRepository: PlayerRepository;
  private sessionRepository: SessionRepository;

  constructor(
    repository: SessionDiscountRepository = new SessionDiscountRepository()
  ) {
    this.sessionDiscountRepository = repository;
    this.discountRepository = new DiscountRepository();
    this.playerRepository = new PlayerRepository();
    this.sessionRepository = new SessionRepository();
  }

  // Retrieves all users from the database
  async findAll(): Promise<ServiceResponse<SessionDiscount[] | null>> {
    try {
      const sessionDiscounts =
        await this.sessionDiscountRepository.findAllAsync();
      if (!sessionDiscounts) {
        return ServiceResponse.failure(
          "No Session Discounts found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<SessionDiscount[]>(
        "Session Discounts found",
        sessionDiscounts
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
  async findById(id: number): Promise<ServiceResponse<SessionDiscount | null>> {
    try {
      const sessionDiscount =
        await this.sessionDiscountRepository.findByIdAsync(id);
      if (!sessionDiscount) {
        return ServiceResponse.failure(
          "Session Discount not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<SessionDiscount>(
        "Session Discount found",
        sessionDiscount
      );
    } catch (ex) {
      const errorMessage = `Error finding session Discount with id ${id}:, ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding session Discount.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async create(
    body: z.infer<typeof CreateSessionDiscountSchema.shape.body>
  ): Promise<ServiceResponse<SessionDiscount | null>> {
    try {
      if (typeof body.playerId === "number" || body.playerId) {
        const player = await this.playerRepository.findByIdAsync(body.playerId);
        if (!player) {
          return ServiceResponse.failure(
            "Player not found",
            null,
            StatusCodes.NOT_FOUND
          );
        }
      }
      const [discount, session] = await Promise.all([
        this.discountRepository.findByIdAsync(body.discountId),
        this.sessionRepository.findByIdAsync(body.sessionId),
      ]);
      if (!discount) {
        return ServiceResponse.failure(
          "Discount not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      if (!session) {
        return ServiceResponse.failure(
          "Session not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }

      const sessionDiscount = await this.sessionDiscountRepository.createAsync(
        body
      );
      return ServiceResponse.success<SessionDiscount>(
        "Session Discount created",
        sessionDiscount
      );
    } catch (ex) {
      const errorMessage = `Error creating session Discount: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating session Discount.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(
    id: number,
    body: z.infer<typeof UpdateSessionDiscountSchema.shape.body>
  ): Promise<ServiceResponse<SessionDiscount | null>> {
    try {
      // check session Discount exist in db with phone_number or username
      const sessionDiscount = await this.findById(id);
      if (sessionDiscount.success) {
        await this.sessionDiscountRepository.updateAsync(id, body);
        return ServiceResponse.success<SessionDiscount>(
          "Session Discount updated",
          {
            ...sessionDiscount.responseObject,
            ...body,
          } as SessionDiscount
        );
      } else {
        return ServiceResponse.failure(
          "Session Discount with id not found",
          null,
          StatusCodes.CONFLICT
        );
      }
    } catch (ex) {
      const errorMessage = `Error creating session Discount: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating session Discount.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async delete(id: number): Promise<ServiceResponse<boolean>> {
    try {
      const sessionDiscount = await this.findById(id);
      if (sessionDiscount.success) {
        await this.sessionDiscountRepository.deleteAsync(id);
        return ServiceResponse.success<boolean>(
          "Session Discount deleted",
          true
        );
      } else {
        return ServiceResponse.failure(
          "Session Discount with id not found",
          false,
          StatusCodes.CONFLICT
        );
      }
    } catch (error) {
      console.error("Error deleting session Discount:", error);
      throw new Error("Failed to delete session Discount");
    }
  }
}

export const sessionDiscountService = new SessionDiscountService();
