import config from "../../config";
import { sign, Jwt } from "jsonwebtoken";
import { User } from "../entity/User";
import { Response } from "express";

export const createAccessToken = (user: User) => {
  return sign({ id: user.id }, config.TOKEN_SECRET, {
    expiresIn: "5s",
  });
};

export const createRefreshToken = (user: User) => {
    return sign({ id: user.id, version: user.tokenVersion + 1 }, config.REFRESH_TOKEN_SECRET, {
      expiresIn: "1y",
    });
  };
  
export const sendRefreshToken = (res: Response, token: any) => {
    res.cookie("refreshToken", token, {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 365, // 365 days
        path: "/",
      })
  };