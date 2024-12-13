import type { Request, RequestHandler, Response } from "express";

import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { sessionDiscountService } from "./sessionDiscountService";

class SessionDiscountsController {
  public getSessionDiscounts: RequestHandler = async (
    _req: Request,
    res: Response
  ) => {
    const serviceResponse = await sessionDiscountService.findAll();
    return handleServiceResponse(serviceResponse, res);
  };

  public getSessionDiscount: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await sessionDiscountService.findById(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public createSessionDiscount: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const serviceResponse = await sessionDiscountService.create(req.body);
    return handleServiceResponse(serviceResponse, res);
  };

  public updateSessionDiscount: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await sessionDiscountService.update(id, req.body);
    return handleServiceResponse(serviceResponse, res);
  };

  public deleteSessionDiscount: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await sessionDiscountService.delete(id);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const sessionDiscountController = new SessionDiscountsController();
