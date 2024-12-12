import { env } from "@/common/utils/envConfig";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { Player, PlayerModel } from "../payler/playerModel";
import {
  Auth,
  CreateRefreshToken,
  LoginSchema,
  RefreshToken,
  RefreshTokenModel,
} from "./authModel";
import { convertEnviromentToTime } from "@/common/utils/defineConvert";
import { Op } from "sequelize";

const { JWT_EXPIRATION, JWT_SECRET, JWT_REFRESH_TOKEN_EXPIRATION } = env;

export class AuthRepository {
  async getUsersAsync(
    body: z.infer<typeof LoginSchema.shape.body>
  ): Promise<Player | null> {
    try {
      const player = await PlayerModel.findOne({
        where: {
          userName: body.userName,
        },
        attributes: {
          exclude: ["updatedAt"],
        },
      });
      return player ? (player.get({ plain: true }) as Player) : null;
    } catch (error) {
      console.error("Error fetching get user:", error);
      throw new Error("Failed to fetch get user");
    }
  }

  async verifyPasswordAsync(
    body: z.infer<typeof LoginSchema.shape.body>,
    password: string
  ): Promise<boolean> {
    try {
      const encrypted = crypto
        .createHash("md5")
        .update(body.password)
        .digest("hex");
      return password === encrypted;
    } catch (error) {
      console.error("Error fetching verify password:", error);
      throw new Error("Failed to fetch verify password");
    }
  }

  async findRefreshTokenAsync(
    refreshToken: string
  ): Promise<RefreshToken | null> {
    try {
      const refreshTokenExists = await RefreshTokenModel.findOne({
        where: {
          refreshToken,
          expriresAt: {
            [Op.gt]: new Date(),
          },
        },
      });
      return refreshTokenExists
        ? (refreshTokenExists.get({ plain: true }) as RefreshToken)
        : null;
    } catch (error) {
      console.error("Error fetching find refresh token:", error);
      throw new Error("Failed to fetch find refresh token");
    }
  }

  async verifyRefreshTokenAsync(
    refreshToken: RefreshToken
  ): Promise<{ token: string } | null> {
    try {
      let newToken = null;
      jwt.verify(refreshToken.refreshToken, JWT_SECRET, (err, user) => {
        if (err || !user) {
          newToken = null;
          return;
        }
        const optionstToken = {
          expiresIn: JWT_EXPIRATION,
        };
        const token = jwt.sign(
          { id: (user as { id: string }).id },
          JWT_SECRET,
          optionstToken
        );
        newToken = { token };
        this.updateExpRefreshTokenAsync({
          id: refreshToken.id,
          refreshToken: refreshToken.refreshToken,
        });
        return;
      });
      return newToken;
    } catch (error) {
      console.error("Error fetching verify refresh token:", error);
      throw new Error("Failed to fetch verify refresh token");
    }
  }

  async createRefreshTokenAsync(
    body: z.infer<typeof CreateRefreshToken>
  ): Promise<RefreshToken> {
    try {
      const formRefreshToken = {
        playerId: body.playerId,
        refreshToken: body.refreshToken,
        ipAddress: body.ipAddress,
      };
      const refreshTokenExists = await this.checkExistsRefreshTokenAsync(
        formRefreshToken
      );
      if (refreshTokenExists) {
        const { expriresAt } = await this.updateExpRefreshTokenAsync({
          id: refreshTokenExists.id,
          ...formRefreshToken,
        });
        return {
          ...refreshTokenExists,
          expriresAt: expriresAt,
        };
      } else {
        const refreshToken = await RefreshTokenModel.create(body);
        return refreshToken.get({ plain: true }) as RefreshToken;
      }
    } catch (error) {
      console.error("Error fetching create token:", error);
      throw new Error("Failed to fetch create token");
    }
  }

  async checkExistsRefreshTokenAsync(body: {
    playerId: number;
    ipAddress: string;
  }): Promise<RefreshToken | null> {
    try {
      const { playerId, ipAddress } = body;
      const refreshTokenExists = await RefreshTokenModel.findOne({
        where: {
          playerId,
          ipAddress: ipAddress === "::1" ? "127.0.0.1" : ipAddress,
          expriresAt: {
            [Op.gt]: new Date(),
          },
        },
      });
      return refreshTokenExists
        ? (refreshTokenExists.get({ plain: true }) as RefreshToken)
        : null;
    } catch (error) {
      console.error("Error fetching check refresh token:", error);
      throw new Error("Failed to fetch check refresh token");
    }
  }

  async updateExpRefreshTokenAsync(body: {
    id: number;
    refreshToken: string;
  }): Promise<{ refreshToken: string; expriresAt: Date }> {
    try {
      const { refreshToken, id } = body;
      const now = new Date();
      const expriresAt = new Date(
        now.getTime() + convertEnviromentToTime(JWT_REFRESH_TOKEN_EXPIRATION)
      );
      await RefreshTokenModel.update(
        {
          expriresAt,
        },
        {
          where: {
            id,
          },
        }
      );
      return {
        refreshToken,
        expriresAt,
      };
    } catch (error) {
      console.error("Error fetching update refresh token:", error);
      throw new Error("Failed to fetch update refresh token");
    }
  }

  async loginAsync(auth: Player, ip?: string): Promise<Auth> {
    try {
      const optionstToken = {
        expiresIn: JWT_EXPIRATION,
      };

      const optionstRefreshToken = {
        expiresIn: JWT_REFRESH_TOKEN_EXPIRATION,
      };
      const token = jwt.sign({ id: auth.id }, JWT_SECRET, optionstToken);
      const refreshToken = jwt.sign(
        { id: auth.id },
        JWT_SECRET,
        optionstRefreshToken
      );
      const now = new Date();
      await this.createRefreshTokenAsync({
        playerId: auth.id,
        refreshToken,
        ipAddress: ip ? (ip === "::1" ? "127.0.0.1" : ip) : "",
        expriresAt: new Date(
          now.getTime() + convertEnviromentToTime(JWT_REFRESH_TOKEN_EXPIRATION)
        ),
      });
      return {
        ...auth,
        token,
        refreshToken,
      };
    } catch (error) {
      console.error("Error fetching auth login:", error);
      throw new Error("Failed to fetch auth login");
    }
  }

  async logoutAsync(body: { refreshToken: string }): Promise<boolean> {
    try {
      await RefreshTokenModel.destroy({
        where: {
          refreshToken: body.refreshToken,
        },
      });
      return true;
    } catch (error) {
      console.error("Error fetching auth logout:", error);
      throw new Error("Failed to fetch auth logout");
    }
  }
}
