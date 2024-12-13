import { z } from "zod";
import {
  CreateExpensesSchema,
  Expenses,
  ExpensesModel,
  UpdateExpensesSchema,
} from "./expensesModel";

export class ExpensesRepository {
  async findAllAsync(): Promise<Expenses[]> {
    try {
      const expensess = await ExpensesModel.findAll({
        order: [["createdAt", "DESC"]],
      });

      return expensess.map(
        (expenses) => expenses.get({ plain: true }) as Expenses
      );
    } catch (error) {
      console.error("Error fetching expensess:", error);
      throw new Error("Failed to fetch expensess");
    }
  }

  async findByIdAsync(id: number): Promise<Expenses | null> {
    try {
      const expenses = await ExpensesModel.findByPk(id);

      return expenses ? (expenses.get({ plain: true }) as Expenses) : null;
    } catch (error) {
      console.error("Error fetching expenses:", error);
      throw new Error("Failed to fetch expenses");
    }
  }

  async createAsync(
    expenses: z.infer<typeof CreateExpensesSchema.shape.body>
  ): Promise<Expenses> {
    try {
      const newExpenses = await ExpensesModel.create(expenses);
      return newExpenses.get({ plain: true }) as Expenses;
    } catch (error) {
      console.error("Error creating expenses:", error);
      throw new Error("Failed to create expenses");
    }
  }

  async updateAsync(
    id: number,
    expenses: z.infer<typeof UpdateExpensesSchema.shape.body>
  ): Promise<boolean> {
    try {
      await ExpensesModel.update(expenses, {
        where: { id },
      });
      return true;
    } catch (error) {
      console.error("Error creating expenses:", error);
      throw new Error("Failed to create expenses");
    }
  }

  async deleteAsync(id: number): Promise<boolean> {
    try {
      await ExpensesModel.destroy({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error("Error deleting expenses:", error);
      throw new Error("Failed to delete expenses");
    }
  }
}
