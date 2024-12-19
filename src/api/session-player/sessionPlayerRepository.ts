import { z } from "zod";
import {
  CreateSessionPlayerSchema,
  SessionPlayer,
  SessionPlayerModel,
  UpdateSessionPlayerSchema,
} from "./sessionPlayerModel";

export class SessionPlayerRepository {
  async findAllAsync(): Promise<SessionPlayer[]> {
    try {
      const sessionPlayers = await SessionPlayerModel.findAll({
        order: [["createdAt", "DESC"]],
      });

      return sessionPlayers.map(
        (sessionPlayer) => sessionPlayer.get({ plain: true }) as SessionPlayer
      );
    } catch (error) {
      console.error("Error fetching session players:", error);
      throw new Error("Failed to fetch session players");
    }
  }

  async findByIdAsync(id: number): Promise<SessionPlayer | null> {
    try {
      const sessionPlayer = await SessionPlayerModel.findByPk(id);

      return sessionPlayer
        ? (sessionPlayer.get({ plain: true }) as SessionPlayer)
        : null;
    } catch (error) {
      console.error("Error fetching session player:", error);
      throw new Error("Failed to fetch session player");
    }
  }

  async createAsync(
    sessionPlayer: z.infer<typeof CreateSessionPlayerSchema.shape.body>
  ): Promise<SessionPlayer> {
    try {
      const newSession = await SessionPlayerModel.create(sessionPlayer);
      return newSession.get({ plain: true }) as SessionPlayer;
    } catch (error) {
      console.error("Error creating session player:", error);
      throw new Error("Failed to create session player");
    }
  }

  async updateAsync(
    id: number,
    sessionPlayer: z.infer<typeof UpdateSessionPlayerSchema.shape.body>
  ): Promise<boolean> {
    try {
      await SessionPlayerModel.update(sessionPlayer, {
        where: { id },
      });
      return true;
    } catch (error) {
      console.error("Error creating session player:", error);
      throw new Error("Failed to create session player");
    }
  }

  async deleteAsync(id: number): Promise<boolean> {
    try {
      await SessionPlayerModel.destroy({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error("Error deleting session player:", error);
      throw new Error("Failed to delete session player");
    }
  }

  async getUserExistSessionAsync(idUser: number, idSession: number) {
    try {
      const sessionPlayer = await SessionPlayerModel.findOne({
        where: { playerId: idUser, sessionId: idSession },
      });
      return sessionPlayer
        ? (sessionPlayer.get({ plain: true }) as SessionPlayer)
        : null;
    } catch (error) {
      console.error("Error get session player:", error);
      throw new Error("Failed to get session player");
    }
  }
}
