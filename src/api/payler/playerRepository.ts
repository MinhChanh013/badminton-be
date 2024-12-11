import { z } from "zod";
import {
  CreatePlayerSchema,
  Player,
  PlayerModel,
  UpdatePlayerSchema,
} from "./playerModel";
import { Op } from "sequelize";

export class PlayerRepository {
  async findAllAsync(): Promise<Player[]> {
    try {
      const players = await PlayerModel.findAll({
        attributes: ["id", "name", "phoneNumber", "email", "userName"],
        order: [["createdAt", "DESC"]],
      });

      return players.map((player) => player.get({ plain: true }) as Player);
    } catch (error) {
      console.error("Error fetching players:", error);
      throw new Error("Failed to fetch players");
    }
  }

  async findByIdAsync(id: number): Promise<Player | null> {
    try {
      const player = await PlayerModel.findByPk(id, {
        attributes: ["id", "name", "phoneNumber", "email", "userName"],
      });

      return player ? (player.get({ plain: true }) as Player) : null;
    } catch (error) {
      console.error("Error fetching player:", error);
      throw new Error("Failed to fetch player");
    }
  }

  async checkPlayerExistAsync<
    T extends { phoneNumber?: string; userName?: string; email?: string }
  >(body: T, id?: number): Promise<boolean> {
    try {
      const listCheck = [];
      const checkId: any = {};
      body.phoneNumber && listCheck.push({ phoneNumber: body.phoneNumber });
      body.userName && listCheck.push({ userName: body.userName });
      body.email && listCheck.push({ email: body.email });
      if (id) {
        checkId["id"] = {
          [Op.ne]: id,
        };
      }
      const players = await PlayerModel.findAll({
        where: {
          [Op.or]: listCheck,
          ...checkId,
        },
      });

      return players.length > 0;
    } catch (error) {
      console.error("Error check exist player:", error);
      throw new Error("Failed to check exist player");
    }
  }

  async createAsync(
    player: z.infer<typeof CreatePlayerSchema.shape.body>
  ): Promise<Player> {
    try {
      const newPlayer = await PlayerModel.create(player);
      return newPlayer.get({ plain: true }) as Player;
    } catch (error) {
      console.error("Error creating player:", error);
      throw new Error("Failed to create player");
    }
  }

  async updateAsync(
    id: number,
    player: z.infer<typeof UpdatePlayerSchema.shape.body>
  ): Promise<boolean> {
    try {
      const newPlayer = await PlayerModel.update(player, {
        where: { id },
      });
      return true;
    } catch (error) {
      console.error("Error creating player:", error);
      throw new Error("Failed to create player");
    }
  }
}
