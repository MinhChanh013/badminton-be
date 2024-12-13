import { z } from "zod";
import {
  CreateDiscountSchema,
  Discount,
  DiscountModel,
  UpdateDiscountSchema,
} from "./discountModel";

export class DiscountRepository {
  async findAllAsync(): Promise<Discount[]> {
    try {
      const discounts = await DiscountModel.findAll({
        order: [["createdAt", "DESC"]],
      });

      return discounts.map(
        (discount) => discount.get({ plain: true }) as Discount
      );
    } catch (error) {
      console.error("Error fetching discounts:", error);
      throw new Error("Failed to fetch discounts");
    }
  }

  async findByIdAsync(id: number): Promise<Discount | null> {
    try {
      const discount = await DiscountModel.findByPk(id);

      return discount ? (discount.get({ plain: true }) as Discount) : null;
    } catch (error) {
      console.error("Error fetching discount:", error);
      throw new Error("Failed to fetch discount");
    }
  }

  async createAsync(
    discount: z.infer<typeof CreateDiscountSchema.shape.body>
  ): Promise<Discount> {
    try {
      const newDiscount = await DiscountModel.create(discount);
      return newDiscount.get({ plain: true }) as Discount;
    } catch (error) {
      console.error("Error creating discount:", error);
      throw new Error("Failed to create discount");
    }
  }

  async updateAsync(
    id: number,
    discount: z.infer<typeof UpdateDiscountSchema.shape.body>
  ): Promise<boolean> {
    try {
      await DiscountModel.update(discount, {
        where: { id },
      });
      return true;
    } catch (error) {
      console.error("Error creating discount:", error);
      throw new Error("Failed to create discount");
    }
  }

  async deleteAsync(id: number): Promise<boolean> {
    try {
      await DiscountModel.destroy({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error("Error deleting discount:", error);
      throw new Error("Failed to delete discount");
    }
  }
}
