import type { Request, RequestHandler, Response } from "express";

import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { sessionService } from "./sessionService";

class SessionController {
  public getSessions: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await sessionService.findAll();
    return handleServiceResponse(serviceResponse, res);
  };

  public getSession: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await sessionService.findById(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public createSession: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const serviceResponse = await sessionService.create(req.body);
    return handleServiceResponse(serviceResponse, res);
  };

  public updateSession: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await sessionService.update(id, req.body);
    return handleServiceResponse(serviceResponse, res);
  };

  public deleteSession: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await sessionService.delete(id);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const sessionController = new SessionController();
