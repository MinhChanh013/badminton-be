import { StatusCodes } from "http-status-codes";

import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { z } from "zod";
import {
  Auth,
  LoginSchema,
  logoutSchema,
  refreshTokenSchema,
} from "./authModel";
import { AuthRepository } from "./authRepository";

export class PlayerService {
  private authRepository: AuthRepository;

  constructor(repository: AuthRepository = new AuthRepository()) {
    this.authRepository = repository;
  }

  async login(
    body: z.infer<typeof LoginSchema.shape.body>,
    ip?: string
  ): Promise<ServiceResponse<Auth | null>> {
    try {
      const auth = await this.authRepository.getUsersAsync(body);
      if (!auth) {
        return ServiceResponse.failure(
          "Auth is not exist in system",
          null,
          StatusCodes.NOT_FOUND
        );
      }

      const isPasswordValid = await this.authRepository.verifyPasswordAsync(
        body,
        auth.password
      );
      if (!isPasswordValid) {
        return ServiceResponse.failure(
          "Password is incorrect",
          null,
          StatusCodes.UNAUTHORIZED
        );
      }
      const authToken = await this.authRepository.loginAsync(auth, ip);
      return ServiceResponse.success<Auth>("Login sucess", authToken);
    } catch (ex) {
      const errorMessage = `Error finding auth: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving auth.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async logout(
    body: z.infer<typeof logoutSchema.shape.body>
  ): Promise<ServiceResponse<boolean | null>> {
    try {
      await this.authRepository.logoutAsync(body);
      return ServiceResponse.success<boolean>("Logout sucess", true);
    } catch (ex) {
      const errorMessage = `Error finding auth: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving auth.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async refreshToken(
    body: z.infer<typeof refreshTokenSchema.shape.body>
  ): Promise<ServiceResponse<{ token: string } | null>> {
    try {
      const refreshToken = await this.authRepository.findRefreshTokenAsync(
        body.refreshToken
      );
      if (!refreshToken) {
        return ServiceResponse.failure(
          "Refresh token is not exist in system",
          null,
          StatusCodes.FORBIDDEN
        );
      }

      const newToken = await this.authRepository.verifyRefreshTokenAsync(
        refreshToken
      );

      if (!newToken) {
        return ServiceResponse.failure(
          "Refresh Token is invalid",
          null,
          StatusCodes.FORBIDDEN
        );
      }

      return ServiceResponse.success<{ token: string }>(
        "Refresh token sucess",
        {
          token: newToken.token,
        }
      );
    } catch (ex) {
      const errorMessage = `Error finding auth: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving auth.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const playerService = new PlayerService();