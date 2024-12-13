import type { Request, RequestHandler, Response } from "express";

import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { sessionPlayerService } from "./sessionPlayerService";

class SessionPlayerController {
  public getSessionPlayers: RequestHandler = async (
    _req: Request,
    res: Response
  ) => {
    const serviceResponse = await sessionPlayerService.findAll();
    return handleServiceResponse(serviceResponse, res);
  };

  public getSessionPlayer: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await sessionPlayerService.findById(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public createSessionPlayer: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const serviceResponse = await sessionPlayerService.create(req.body);
    return handleServiceResponse(serviceResponse, res);
  };

  public updateSessionPlayer: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await sessionPlayerService.update(id, req.body);
    return handleServiceResponse(serviceResponse, res);
  };

  public deleteSessionPlayer: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await sessionPlayerService.delete(id);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const sessionPlayerController = new SessionPlayerController();
