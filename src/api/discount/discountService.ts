import { StatusCodes } from "http-status-codes";

import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { DiscountRepository } from "./discountRepository";
import { z } from "zod";
import {
  CreateDiscountSchema,
  Discount,
  UpdateDiscountSchema,
} from "./discountModel";

export class DiscountService {
  private discountRepository: DiscountRepository;

  constructor(repository: DiscountRepository = new DiscountRepository()) {
    this.discountRepository = repository;
  }

  // Retrieves all users from the database
  async findAll(): Promise<ServiceResponse<Discount[] | null>> {
    try {
      const discounts = await this.discountRepository.findAllAsync();
      if (!discounts) {
        return ServiceResponse.failure(
          "No Discounts found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<Discount[]>("Discounts found", discounts);
    } catch (ex) {
      const errorMessage = `Error finding all discounts: $${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving discounts.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Retrieves a single user by their ID
  async findById(id: number): Promise<ServiceResponse<Discount | null>> {
    try {
      const discount = await this.discountRepository.findByIdAsync(id);
      if (!discount) {
        return ServiceResponse.failure(
          "Discount not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<Discount>("Discount found", discount);
    } catch (ex) {
      const errorMessage = `Error finding discount with id ${id}:, ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding discount.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async create(
    body: z.infer<typeof CreateDiscountSchema.shape.body>
  ): Promise<ServiceResponse<Discount | null>> {
    try {
      const discount = await this.discountRepository.createAsync(body);
      return ServiceResponse.success<Discount>("Discount created", discount);
    } catch (ex) {
      const errorMessage = `Error creating discount: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating discount.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(
    id: number,
    body: z.infer<typeof UpdateDiscountSchema.shape.body>
  ): Promise<ServiceResponse<Discount | null>> {
    try {
      // check discount exist in db with phone_number or username
      const discount = await this.findById(id);
      if (discount.success) {
        await this.discountRepository.updateAsync(id, body);
        return ServiceResponse.success<Discount>("Discount updated", {
          ...discount.responseObject,
          ...body,
        } as Discount);
      } else {
        return ServiceResponse.failure(
          "Discount with id not found",
          null,
          StatusCodes.CONFLICT
        );
      }
    } catch (ex) {
      const errorMessage = `Error creating discount: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating discount.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async delete(id: number): Promise<ServiceResponse<boolean>> {
    try {
      const discount = await this.findById(id);
      if (discount.success) {
        await this.discountRepository.deleteAsync(id);
        return ServiceResponse.success<boolean>("Discount deleted", true);
      } else {
        return ServiceResponse.failure(
          "Discount with id not found",
          false,
          StatusCodes.CONFLICT
        );
      }
    } catch (error) {
      console.error("Error deleting discount:", error);
      throw new Error("Failed to delete discount");
    }
  }
}

export const discountService = new DiscountService();
