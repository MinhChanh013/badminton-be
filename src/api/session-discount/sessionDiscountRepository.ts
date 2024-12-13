import { z } from "zod";
import {
  CreateSessionDiscountSchema,
  SessionDiscount,
  SessionDiscountModel,
  UpdateSessionDiscountSchema,
} from "./sessionDiscountModel";

export class SessionDiscountRepository {
  async findAllAsync(): Promise<SessionDiscount[]> {
    try {
      const sessionDiscounts = await SessionDiscountModel.findAll({
        order: [["createdAt", "DESC"]],
      });

      return sessionDiscounts.map(
        (sessionDiscount) =>
          sessionDiscount.get({ plain: true }) as SessionDiscount
      );
    } catch (error) {
      console.error("Error fetching session Discounts:", error);
      throw new Error("Failed to fetch session Discounts");
    }
  }

  async findByIdAsync(id: number): Promise<SessionDiscount | null> {
    try {
      const sessionDiscount = await SessionDiscountModel.findByPk(id);

      return sessionDiscount
        ? (sessionDiscount.get({ plain: true }) as SessionDiscount)
        : null;
    } catch (error) {
      console.error("Error fetching session Discount:", error);
      throw new Error("Failed to fetch session Discount");
    }
  }

  async createAsync(
    sessionDiscount: z.infer<typeof CreateSessionDiscountSchema.shape.body>
  ): Promise<SessionDiscount> {
    try {
      const newSession = await SessionDiscountModel.create(sessionDiscount);
      return newSession.get({ plain: true }) as SessionDiscount;
    } catch (error) {
      console.error("Error creating session Discount:", error);
      throw new Error("Failed to create session Discount");
    }
  }

  async updateAsync(
    id: number,
    sessionDiscount: z.infer<typeof UpdateSessionDiscountSchema.shape.body>
  ): Promise<boolean> {
    try {
      await SessionDiscountModel.update(sessionDiscount, {
        where: { id },
      });
      return true;
    } catch (error) {
      console.error("Error creating session Discount:", error);
      throw new Error("Failed to create session Discount");
    }
  }

  async deleteAsync(id: number): Promise<boolean> {
    try {
      await SessionDiscountModel.destroy({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error("Error deleting session Discount:", error);
      throw new Error("Failed to delete session Discount");
    }
  }
}
