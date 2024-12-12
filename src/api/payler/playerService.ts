import { StatusCodes } from "http-status-codes";

import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { z } from "zod";
import { CreatePlayerSchema, Player, UpdatePlayerSchema } from "./playerModel";
import { PlayerRepository } from "./playerRepository";

export class PlayerService {
  private playerRepository: PlayerRepository;

  constructor(repository: PlayerRepository = new PlayerRepository()) {
    this.playerRepository = repository;
  }

  // Retrieves all users from the database
  async findAll(): Promise<ServiceResponse<Player[] | null>> {
    try {
      const players = await this.playerRepository.findAllAsync();
      if (!players || players.length === 0) {
        return ServiceResponse.failure(
          "No Players found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<Player[]>("Players found", players);
    } catch (ex) {
      const errorMessage = `Error finding all players: $${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving players.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Retrieves a single user by their ID
  async findById(id: number): Promise<ServiceResponse<Player | null>> {
    try {
      const player = await this.playerRepository.findByIdAsync(id);
      if (!player) {
        return ServiceResponse.failure(
          "Player not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<Player>("Player found", player);
    } catch (ex) {
      const errorMessage = `Error finding player with id ${id}:, ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding player.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
  async create(
    body: z.infer<typeof CreatePlayerSchema.shape.body>
  ): Promise<ServiceResponse<Player | null>> {
    try {
      // check player exist in db with phone_number or username
      const existingPlayer = await this.playerRepository.checkPlayerExistAsync(
        body
      );
      if (existingPlayer) {
        return ServiceResponse.failure(
          "Player with the same phone number, username or email already exists",
          null,
          StatusCodes.CONFLICT
        );
      }
      const player = await this.playerRepository.createAsync(body);
      return ServiceResponse.success<Player>("Player created", player);
    } catch (ex) {
      const errorMessage = `Error creating player: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating player.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(
    id: number,
    body: z.infer<typeof UpdatePlayerSchema.shape.body>
  ): Promise<ServiceResponse<Player | null>> {
    try {
      // check player exist in db with phone_number or username
      const player = await this.findById(id);
      if (player.success) {
        const existingPlayer =
          await this.playerRepository.checkPlayerExistAsync(body, id);

        if (existingPlayer) {
          return ServiceResponse.failure(
            "Player with the same phone number, username or email already exists",
            null,
            StatusCodes.CONFLICT
          );
        }

        await this.playerRepository.updateAsync(id, body);
        return ServiceResponse.success<Player>("Player updated", {
          ...player.responseObject,
          ...body,
        } as Player);
      } else {
        return ServiceResponse.failure(
          "Player with id not found",
          null,
          StatusCodes.CONFLICT
        );
      }
    } catch (ex) {
      const errorMessage = `Error creating player: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating player.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async delete(id: number): Promise<ServiceResponse<boolean>> {
    try {
      const player = await this.findById(id);
      if (player.success) {
        await this.playerRepository.deleteAsync(id);
        return ServiceResponse.success<boolean>("Player deleted", true);
      } else {
        return ServiceResponse.failure(
          "Player with id not found",
          false,
          StatusCodes.CONFLICT
        );
      }
    } catch (error) {
      console.error("Error deleting player:", error);
      throw new Error("Failed to delete player");
    }
  }
}

export const playerService = new PlayerService();
