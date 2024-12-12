import type { Request, RequestHandler, Response } from "express";

import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { playerService } from "./playerService";

class PlayerController {
  public getPlayers: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await playerService.findAll();
    return handleServiceResponse(serviceResponse, res);
  };

  public getPlayer: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await playerService.findById(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public createPlayer: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await playerService.create(req.body);
    return handleServiceResponse(serviceResponse, res);
  };

  public updatePlayer: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await playerService.update(id, req.body);
    return handleServiceResponse(serviceResponse, res);
  };

  public deletePlayer: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await playerService.delete(id);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const playerController = new PlayerController();
