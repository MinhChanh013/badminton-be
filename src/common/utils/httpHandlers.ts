import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { ZodError, ZodSchema } from "zod";

import { ServiceResponse } from "@/common/models/serviceResponse";

export const handleServiceResponse = (
  serviceResponse: ServiceResponse<any>,
  response: Response
) => {
  return response.status(serviceResponse.statusCode).send(serviceResponse);
};

export const validateRequest =
  (schema: ZodSchema, isFormatMessage: boolean = false) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({ body: req.body, query: req.query, params: req.params });
      next();
    } catch (err) {
      let errorMessage = "";
      if (!isFormatMessage)
        errorMessage = `Invalid input: ${(err as ZodError).errors
          .map((e) => e.message)
          .join(", ")}`;
      else
        errorMessage = `Invalid: ${(err as ZodError).errors
          .map((e) => `${e.path.at(-1)} is ${e.message}`)
          .join(", ")}`;
      const statusCode = StatusCodes.BAD_REQUEST;
      const serviceResponse = ServiceResponse.failure(
        errorMessage,
        null,
        statusCode
      );
      return handleServiceResponse(serviceResponse, res);
    }
  };

export const jsonRquestBody = (schema: ZodSchema) => ({
  content: {
    "application/json": { schema },
  },
});
