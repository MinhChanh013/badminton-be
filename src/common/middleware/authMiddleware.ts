import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../utils/envConfig";
import { z } from "zod";
import { PlayerSchema } from "../../api/payler/playerModel";
import { handleServiceResponse } from "../utils/httpHandlers";
import { ServiceResponse } from "../models/serviceResponse";
import { StatusCodes } from "http-status-codes";
const { JWT_SECRET } = env;

type User = z.infer<typeof PlayerSchema>;

declare module "express-serve-static-core" {
  interface Request {
    user: User;
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      handleServiceResponse(
        ServiceResponse.failure(
          "Access token missing",
          null,
          StatusCodes.UNAUTHORIZED
        ),
        res
      );
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      handleServiceResponse(
        ServiceResponse.failure(
          "Access token malformed",
          null,
          StatusCodes.UNAUTHORIZED
        ),
        res
      );
      return;
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        handleServiceResponse(
          ServiceResponse.failure(
            "Invalid or expired token",
            null,
            StatusCodes.FORBIDDEN
          ),
          res
        );
        return;
      }

      if (!user) {
        handleServiceResponse(
          ServiceResponse.failure(
            "Invalid or expired token",
            null,
            StatusCodes.FORBIDDEN
          ),
          res
        );
        return;
      }
      req.user = user as User;
      next();
    });
  } catch (error) {
    console.error("Authentication error:", error);
    handleServiceResponse(
      ServiceResponse.failure(
        "Internal server error",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      ),
      res
    );
  }
};
