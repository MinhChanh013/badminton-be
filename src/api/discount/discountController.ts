import type { Request, RequestHandler, Response } from "express";

import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { discountService } from "./discountService";

class DiscountController {
  public getDiscounts: RequestHandler = async (
    _req: Request,
    res: Response
  ) => {
    const serviceResponse = await discountService.findAll();
    return handleServiceResponse(serviceResponse, res);
  };

  public getDiscount: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await discountService.findById(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public createDiscount: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const serviceResponse = await discountService.create(req.body);
    return handleServiceResponse(serviceResponse, res);
  };

  public updateDiscount: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await discountService.update(id, req.body);
    return handleServiceResponse(serviceResponse, res);
  };

  public deleteDiscount: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await discountService.delete(id);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const discountController = new DiscountController();
