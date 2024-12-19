import { StatusCodes } from "http-status-codes";

import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { z } from "zod";
import {
  CreateSessionSchema,
  ReponseCreateSessionSchema,
  Session,
  UpdateSessionSchema,
} from "./sessionModel";
import { SessionRepository } from "./sessionRepository";
import { PlayerRepository } from "../payler/playerRepository";
import { DiscountRepository } from "../discount/discountRepository";
import { ExpensesRepository } from "../expenses/expensesRepository";
import { SessionPlayerRepository } from "../session-player/sessionPlayerRepository";
import { SessionDiscountRepository } from "../session-discount/sessionDiscountRepository";
import { SessionExpensesRepository } from "../session-expenses/sessionExpensesRepository";
import { CourtRepository } from "../court/courtRepository";

export class SessionService {
  private sessionRepository: SessionRepository;
  private playerRepository: PlayerRepository;
  private courtRepository: CourtRepository;
  private distcountRepository: DiscountRepository;
  private expensesReponsitory: ExpensesRepository;
  private sessionPlayerRepository: SessionPlayerRepository;
  private sessionDiscountRepository: SessionDiscountRepository;
  private sessionExpensesRepository: SessionExpensesRepository;

  constructor(repository: SessionRepository = new SessionRepository()) {
    this.sessionRepository = repository;
    this.courtRepository = new CourtRepository();
    this.playerRepository = new PlayerRepository();
    this.distcountRepository = new DiscountRepository();
    this.expensesReponsitory = new ExpensesRepository();
    this.sessionPlayerRepository = new SessionPlayerRepository();
    this.sessionDiscountRepository = new SessionDiscountRepository();
    this.sessionExpensesRepository = new SessionExpensesRepository();
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
  ): Promise<
    ServiceResponse<z.infer<
      typeof ReponseCreateSessionSchema.shape.body
    > | null>
  > {
    try {
      if (body.length === 0) {
        return ServiceResponse.failure(
          "Body is empty",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      const sessionResponse: z.infer<
        typeof ReponseCreateSessionSchema.shape.body
      > = [];
      for (const sessionBody of body) {
        const {
          players = [],
          discounts = [],
          expenses = [],
          ...formSession
        } = sessionBody;
        // check exist id in body player, discount and expenses
        const listIdPlayer: number[] = [];
        const listIdDiscount: number[] = [];
        const listIdExpense: number[] = [];
        if (typeof formSession.courtId === "number" || formSession.courtId) {
          const court = await this.courtRepository.findByIdAsync(
            formSession.courtId
          );
          if (!court) {
            return ServiceResponse.failure(
              `Court with id ${formSession.courtId} not found`,
              null,
              StatusCodes.BAD_REQUEST
            );
          }
        }
        players.forEach((player) => {
          if (typeof player.playerId === "number" || player.playerId) {
            listIdPlayer.push(player.playerId);
          }
        });

        discounts.forEach((discount) => {
          if (typeof discount.discountId === "number" || discount.discountId) {
            listIdDiscount.push(discount.discountId);
          }
          if (typeof discount.playerId === "number" || discount.playerId) {
            listIdPlayer.push(discount.playerId);
          }
        });

        expenses.forEach((expense) => {
          if (typeof expense.expensesId === "number" || expense.expensesId) {
            listIdExpense.push(expense.expensesId);
          }
          if (typeof expense.playerId === "number" || expense.playerId) {
            listIdPlayer.push(expense.playerId);
          }
        });
        const idsPlayerUnExist = [];
        for (const idPlayer of [...new Set(listIdPlayer)]) {
          const player = await this.playerRepository.findByIdAsync(idPlayer);
          if (!player) {
            idsPlayerUnExist.push(idPlayer);
          }
        }
        if (idsPlayerUnExist.length > 0) {
          return ServiceResponse.failure(
            `Player with id ${idsPlayerUnExist.join(", ")} not found`,
            null,
            StatusCodes.BAD_REQUEST
          );
        }
        const idsDiscountUnExist = [];
        for (const idDiscount of [...new Set(listIdDiscount)]) {
          const discount = await this.distcountRepository.findByIdAsync(
            idDiscount
          );
          if (!discount) {
            idsDiscountUnExist.push(idDiscount);
          }
        }
        if (idsDiscountUnExist.length > 0) {
          return ServiceResponse.failure(
            `Discount with id ${idsDiscountUnExist.join(", ")} not found`,
            null,
            StatusCodes.BAD_REQUEST
          );
        }
        const idsExpensesUnExist = [];
        for (const idExpenses of [...new Set(listIdExpense)]) {
          const expenses = await this.expensesReponsitory.findByIdAsync(
            idExpenses
          );
          if (!expenses) {
            idsExpensesUnExist.push(idExpenses);
          }
        }
        if (idsExpensesUnExist.length > 0) {
          return ServiceResponse.failure(
            `Expenses with id ${idsExpensesUnExist.join(", ")} not found`,
            null,
            StatusCodes.BAD_REQUEST
          );
        }
        let formResponse: z.infer<
          typeof ReponseCreateSessionSchema.shape.body
        > = [];
        const session = await this.sessionRepository.createAsync(formSession);
        if (!session) {
          return ServiceResponse.failure(
            "Session not created",
            null,
            StatusCodes.INTERNAL_SERVER_ERROR
          );
        } else
          formResponse.push({
            ...session,
            players: [],
            discounts: [],
            expenses: [],
          });

        // create session player
        for (const player of players) {
          const playerReponse = await this.sessionPlayerRepository.createAsync({
            ...player,
            sessionId: session.id,
          });
          if (playerReponse) {
            formResponse[0].players.push(playerReponse);
          } else {
            return ServiceResponse.failure(
              "Session player not created",
              null,
              StatusCodes.INTERNAL_SERVER_ERROR
            );
          }
        }
        // create session discount
        for (const discount of discounts) {
          const discountReponse =
            await this.sessionDiscountRepository.createAsync({
              ...discount,
              sessionId: session.id,
            });
          if (discountReponse) {
            formResponse[0].discounts.push(discountReponse);
          } else {
            return ServiceResponse.failure(
              "Session discount not created",
              null,
              StatusCodes.INTERNAL_SERVER_ERROR
            );
          }
        }

        // create session expenses
        for (const expense of expenses) {
          const expensesReponse =
            await this.sessionExpensesRepository.createAsync({
              ...expense,
              sessionId: session.id,
            });
          if (expensesReponse) {
            formResponse[0].expenses.push(expensesReponse);
          } else {
            return ServiceResponse.failure(
              "Session expenses not created",
              null,
              StatusCodes.INTERNAL_SERVER_ERROR
            );
          }
        }
        sessionResponse.push(...formResponse);
      }
      return ServiceResponse.success<
        z.infer<typeof ReponseCreateSessionSchema.shape.body>
      >("Session created", sessionResponse);
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
