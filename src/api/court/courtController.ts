import type { Request, RequestHandler, Response } from "express";

import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { courtService } from "./courtService";

class CourtController {
  public getCourts: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await courtService.findAll();
    return handleServiceResponse(serviceResponse, res);
  };

  public getCourt: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await courtService.findById(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public createCourt: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await courtService.create(req.body);
    return handleServiceResponse(serviceResponse, res);
  };

  public updateCourt: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await courtService.update(id, req.body);
    return handleServiceResponse(serviceResponse, res);
  };

  public deleteCourt: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await courtService.delete(id);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const courtController = new CourtController();
