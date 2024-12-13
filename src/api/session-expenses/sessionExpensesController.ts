import type { Request, RequestHandler, Response } from "express";

import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { sessionExpensessService } from "./sessionExpensesService";

class SessionExpensessController {
  public getSessionExpensess: RequestHandler = async (
    _req: Request,
    res: Response
  ) => {
    const serviceResponse = await sessionExpensessService.findAll();
    return handleServiceResponse(serviceResponse, res);
  };

  public getSessionExpenses: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await sessionExpensessService.findById(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public createSessionExpenses: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const serviceResponse = await sessionExpensessService.create(req.body);
    return handleServiceResponse(serviceResponse, res);
  };

  public updateSessionExpenses: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await sessionExpensessService.update(id, req.body);
    return handleServiceResponse(serviceResponse, res);
  };

  public deleteSessionExpenses: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await sessionExpensessService.delete(id);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const sessionExpensesController = new SessionExpensessController();
