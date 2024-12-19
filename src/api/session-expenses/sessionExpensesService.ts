import { StatusCodes } from "http-status-codes";

import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { z } from "zod";
import {
  CreateSessionExpensesSchema,
  SessionExpenses,
  UpdateSessionExpensesSchema,
} from "./sessionExpensesModel";
import { SessionExpensesRepository } from "./sessionExpensesRepository";
import { PlayerRepository } from "../payler/playerRepository";
import { ExpensesRepository } from "../expenses/expensesRepository";
import { SessionRepository } from "../session/sessionRepository";

export class SessionExpensesService {
  private sessionExpensesRepository: SessionExpensesRepository;
  private playerRepository: PlayerRepository;
  private expensesRepository: ExpensesRepository;
  private sessionRepository: SessionRepository;

  constructor(
    repository: SessionExpensesRepository = new SessionExpensesRepository()
  ) {
    this.sessionExpensesRepository = repository;
    this.playerRepository = new PlayerRepository();
    this.expensesRepository = new ExpensesRepository();
    this.sessionRepository = new SessionRepository();
  }

  // Retrieves all users from the database
  async findAll(): Promise<ServiceResponse<SessionExpenses[] | null>> {
    try {
      const sessionExpensess =
        await this.sessionExpensesRepository.findAllAsync();
      if (!sessionExpensess) {
        return ServiceResponse.failure(
          "No Session Expensess found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<SessionExpenses[]>(
        "Session Expensess found",
        sessionExpensess
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
  async findById(id: number): Promise<ServiceResponse<SessionExpenses | null>> {
    try {
      const sessionExpenses =
        await this.sessionExpensesRepository.findByIdAsync(id);
      if (!sessionExpenses) {
        return ServiceResponse.failure(
          "Session Expenses not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<SessionExpenses>(
        "Session Expenses found",
        sessionExpenses
      );
    } catch (ex) {
      const errorMessage = `Error finding session Expenses with id ${id}:, ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding session Expenses.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async create(
    body: z.infer<typeof CreateSessionExpensesSchema.shape.body>
  ): Promise<ServiceResponse<SessionExpenses | null>> {
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
      // check session exist in db with phone_number or username
      const [expenses, sessiuion] = await Promise.all([
        this.expensesRepository.findByIdAsync(body.expensesId),
        this.sessionRepository.findByIdAsync(body.sessionId),
      ]);
      if (!expenses) {
        return ServiceResponse.failure(
          "Expenses not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      if (!sessiuion) {
        return ServiceResponse.failure(
          "Session not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }

      const sessionExpenses = await this.sessionExpensesRepository.createAsync(
        body
      );
      return ServiceResponse.success<SessionExpenses>(
        "Session Expenses created",
        sessionExpenses
      );
    } catch (ex) {
      const errorMessage = `Error creating session Expenses: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating session Expenses.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(
    id: number,
    body: z.infer<typeof UpdateSessionExpensesSchema.shape.body>
  ): Promise<ServiceResponse<SessionExpenses | null>> {
    try {
      // check session Expenses exist in db with phone_number or username
      const sessionExpenses = await this.findById(id);
      if (sessionExpenses.success) {
        await this.sessionExpensesRepository.updateAsync(id, body);
        return ServiceResponse.success<SessionExpenses>(
          "Session Expenses updated",
          {
            ...sessionExpenses.responseObject,
            ...body,
          } as SessionExpenses
        );
      } else {
        return ServiceResponse.failure(
          "Session Expenses with id not found",
          null,
          StatusCodes.CONFLICT
        );
      }
    } catch (ex) {
      const errorMessage = `Error creating session Expenses: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating session Expenses.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async delete(id: number): Promise<ServiceResponse<boolean>> {
    try {
      const sessionExpenses = await this.findById(id);
      if (sessionExpenses.success) {
        await this.sessionExpensesRepository.deleteAsync(id);
        return ServiceResponse.success<boolean>(
          "Session Expenses deleted",
          true
        );
      } else {
        return ServiceResponse.failure(
          "Session Expenses with id not found",
          false,
          StatusCodes.CONFLICT
        );
      }
    } catch (error) {
      console.error("Error deleting session Expenses:", error);
      throw new Error("Failed to delete session Expenses");
    }
  }
}

export const sessionExpensessService = new SessionExpensesService();
