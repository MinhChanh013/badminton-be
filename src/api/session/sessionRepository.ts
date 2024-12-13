import { z } from "zod";
import {
  CreateSessionSchema,
  Session,
  SessionModel,
  UpdateSessionSchema,
} from "./sessionModel";

export class SessionRepository {
  async findAllAsync(): Promise<Session[]> {
    try {
      const sessions = await SessionModel.findAll({
        order: [["createdAt", "DESC"]],
      });

      return sessions.map((session) => session.get({ plain: true }) as Session);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      throw new Error("Failed to fetch sessions");
    }
  }

  async findByIdAsync(id: number): Promise<Session | null> {
    try {
      const session = await SessionModel.findByPk(id);

      return session ? (session.get({ plain: true }) as Session) : null;
    } catch (error) {
      console.error("Error fetching session:", error);
      throw new Error("Failed to fetch session");
    }
  }

  async createAsync(
    session: z.infer<typeof CreateSessionSchema.shape.body>
  ): Promise<Session> {
    try {
      const newSession = await SessionModel.create(session);
      return newSession.get({ plain: true }) as Session;
    } catch (error) {
      console.error("Error creating session:", error);
      throw new Error("Failed to create session");
    }
  }

  async updateAsync(
    id: number,
    session: z.infer<typeof UpdateSessionSchema.shape.body>
  ): Promise<boolean> {
    try {
      await SessionModel.update(session, {
        where: { id },
      });
      return true;
    } catch (error) {
      console.error("Error creating session:", error);
      throw new Error("Failed to create session");
    }
  }

  async deleteAsync(id: number): Promise<boolean> {
    try {
      await SessionModel.destroy({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error("Error deleting session:", error);
      throw new Error("Failed to delete session");
    }
  }
}
