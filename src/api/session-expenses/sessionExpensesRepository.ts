import { z } from "zod";
import {
  CreateSessionExpensesSchema,
  SessionExpenses,
  SessionExpensesModel,
  UpdateSessionExpensesSchema,
} from "./sessionExpensesModel";

export class SessionExpensesRepository {
  async findAllAsync(): Promise<SessionExpenses[]> {
    try {
      const sessionExpensess = await SessionExpensesModel.findAll({
        order: [["createdAt", "DESC"]],
      });

      return sessionExpensess.map(
        (sessionExpenses) =>
          sessionExpenses.get({ plain: true }) as SessionExpenses
      );
    } catch (error) {
      console.error("Error fetching session Expensess:", error);
      throw new Error("Failed to fetch session Expensess");
    }
  }

  async findByIdAsync(id: number): Promise<SessionExpenses | null> {
    try {
      const sessionExpenses = await SessionExpensesModel.findByPk(id);

      return sessionExpenses
        ? (sessionExpenses.get({ plain: true }) as SessionExpenses)
        : null;
    } catch (error) {
      console.error("Error fetching session Expenses:", error);
      throw new Error("Failed to fetch session Expenses");
    }
  }

  async createAsync(
    sessionExpenses: z.infer<typeof CreateSessionExpensesSchema.shape.body>
  ): Promise<SessionExpenses> {
    try {
      const newSession = await SessionExpensesModel.create(sessionExpenses);
      return newSession.get({ plain: true }) as SessionExpenses;
    } catch (error) {
      console.error("Error creating session Expenses:", error);
      throw new Error("Failed to create session Expenses");
    }
  }

  async updateAsync(
    id: number,
    sessionExpenses: z.infer<typeof UpdateSessionExpensesSchema.shape.body>
  ): Promise<boolean> {
    try {
      await SessionExpensesModel.update(sessionExpenses, {
        where: { id },
      });
      return true;
    } catch (error) {
      console.error("Error creating session Expenses:", error);
      throw new Error("Failed to create session Expenses");
    }
  }

  async deleteAsync(id: number): Promise<boolean> {
    try {
      await SessionExpensesModel.destroy({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error("Error deleting session Expenses:", error);
      throw new Error("Failed to delete session Expenses");
    }
  }
}
