import { z } from "zod";
import {
  Court,
  CourtModel,
  CreateCourtSchema,
  UpdateCourtSchema,
} from "./courtModel";

export class CourtRepository {
  async findAllAsync(): Promise<Court[]> {
    try {
      const courts = await CourtModel.findAll({
        order: [["createdAt", "DESC"]],
      });

      return courts.map((court) => court.get({ plain: true }) as Court);
    } catch (error) {
      console.error("Error fetching courts:", error);
      throw new Error("Failed to fetch courts");
    }
  }

  async findByIdAsync(id: number): Promise<Court | null> {
    try {
      const court = await CourtModel.findByPk(id);

      return court ? (court.get({ plain: true }) as Court) : null;
    } catch (error) {
      console.error("Error fetching court:", error);
      throw new Error("Failed to fetch court");
    }
  }

  async createAsync(
    court: z.infer<typeof CreateCourtSchema.shape.body>
  ): Promise<Court> {
    try {
      const newCourt = await CourtModel.create(court);
      return newCourt.get({ plain: true }) as Court;
    } catch (error) {
      console.error("Error creating court:", error);
      throw new Error("Failed to create court");
    }
  }

  async updateAsync(
    id: number,
    court: z.infer<typeof UpdateCourtSchema.shape.body>
  ): Promise<boolean> {
    try {
      await CourtModel.update(court, {
        where: { id },
      });
      return true;
    } catch (error) {
      console.error("Error creating court:", error);
      throw new Error("Failed to create court");
    }
  }

  async deleteAsync(id: number): Promise<boolean> {
    try {
      await CourtModel.destroy({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error("Error deleting court:", error);
      throw new Error("Failed to delete court");
    }
  }
}
