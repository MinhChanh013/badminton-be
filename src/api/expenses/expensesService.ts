import { StatusCodes } from "http-status-codes";

import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { z } from "zod";
import {
  CreateExpensesSchema,
  Expenses,
  UpdateExpensesSchema,
} from "./expensesModel";
import { ExpensesRepository } from "./expensesRepository";

export class ExpensesService {
  private expeneseRepository: ExpensesRepository;

  constructor(repository: ExpensesRepository = new ExpensesRepository()) {
    this.expeneseRepository = repository;
  }

  // Retrieves all users from the database
  async findAll(): Promise<ServiceResponse<Expenses[] | null>> {
    try {
      const expensess = await this.expeneseRepository.findAllAsync();
      if (!expensess) {
        return ServiceResponse.failure(
          "No Expensess found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<Expenses[]>("Expensess found", expensess);
    } catch (ex) {
      const errorMessage = `Error finding all expensess: $${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving expensess.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Retrieves a single user by their ID
  async findById(id: number): Promise<ServiceResponse<Expenses | null>> {
    try {
      const expenses = await this.expeneseRepository.findByIdAsync(id);
      if (!expenses) {
        return ServiceResponse.failure(
          "Expenses not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<Expenses>("Expenses found", expenses);
    } catch (ex) {
      const errorMessage = `Error finding expenses with id ${id}:, ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding expenses.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async create(
    body: z.infer<typeof CreateExpensesSchema.shape.body>
  ): Promise<ServiceResponse<Expenses | null>> {
    try {
      const expenses = await this.expeneseRepository.createAsync(body);
      return ServiceResponse.success<Expenses>("Expenses created", expenses);
    } catch (ex) {
      const errorMessage = `Error creating expenses: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating expenses.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(
    id: number,
    body: z.infer<typeof UpdateExpensesSchema.shape.body>
  ): Promise<ServiceResponse<Expenses | null>> {
    try {
      // check expenses exist in db with phone_number or username
      const expenses = await this.findById(id);
      if (expenses.success) {
        await this.expeneseRepository.updateAsync(id, body);
        return ServiceResponse.success<Expenses>("Expenses updated", {
          ...expenses.responseObject,
          ...body,
        } as Expenses);
      } else {
        return ServiceResponse.failure(
          "Expenses with id not found",
          null,
          StatusCodes.CONFLICT
        );
      }
    } catch (ex) {
      const errorMessage = `Error creating expenses: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating expenses.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async delete(id: number): Promise<ServiceResponse<boolean>> {
    try {
      const expenses = await this.findById(id);
      if (expenses.success) {
        await this.expeneseRepository.deleteAsync(id);
        return ServiceResponse.success<boolean>("Expenses deleted", true);
      } else {
        return ServiceResponse.failure(
          "Expenses with id not found",
          false,
          StatusCodes.CONFLICT
        );
      }
    } catch (error) {
      console.error("Error deleting expenses:", error);
      throw new Error("Failed to delete expenses");
    }
  }
}

export const expensesService = new ExpensesService();
