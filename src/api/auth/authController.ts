import type { Request, RequestHandler, Response } from "express";

import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { playerService } from "./authService";

class AuthController {
  public login: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await playerService.login(
      req.body,
      req.connection.remoteAddress
    );
    return handleServiceResponse(serviceResponse, res);
  };

  public logout: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await playerService.logout(req.body);
    return handleServiceResponse(serviceResponse, res);
  };

  public refreshToken: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await playerService.refreshToken(req.body);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const authController = new AuthController();
