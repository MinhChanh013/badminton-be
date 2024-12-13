import type { Request, RequestHandler, Response } from "express";

import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { expensesService } from "./expensesService";

class ExpensesController {
  public getExpensess: RequestHandler = async (
    _req: Request,
    res: Response
  ) => {
    const serviceResponse = await expensesService.findAll();
    return handleServiceResponse(serviceResponse, res);
  };

  public getExpenses: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await expensesService.findById(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public createExpenses: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const serviceResponse = await expensesService.create(req.body);
    return handleServiceResponse(serviceResponse, res);
  };

  public updateExpenses: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await expensesService.update(id, req.body);
    return handleServiceResponse(serviceResponse, res);
  };

  public deleteExpenses: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await expensesService.delete(id);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const expensesController = new ExpensesController();
