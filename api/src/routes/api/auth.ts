import { Router } from "express";
import { register } from "../../controllers/users";
import {
  sendRefreshToken,
  createRefreshToken,
  createAccessToken
} from "../../lib/auth";
import passport from "../../passport";
import config from "../../../config";
import { verify } from "jsonwebtoken";
import { AppDataSource } from "../../data-source";
import { User } from "../../entity/User";

const router = Router();
const userRepository = AppDataSource.getRepository(User);

router.get("/refresh", async (req, res) => {
  const unauhenticated = () => res.status(400).json({ ok: false, payload: null });

  if (!req.cookies) return unauhenticated();
  const token = req.cookies["refreshToken"];
  if (!token) return unauhenticated();

  verify(token, config.REFRESH_TOKEN_SECRET, async (err: any, decoded: any) => {
    if (err) return unauhenticated();

    try {
      const user = await userRepository.findOneBy({ id: decoded.id });
      if (!user) return unauhenticated();

      sendRefreshToken(res, createRefreshToken(user));
      const accessToken = createAccessToken(user);

      const userToClient = {
        id: user.id,
        username: user.username,
      };

      return res.json({
        ok: true,
        payload: {
          token: accessToken,
          user: userToClient,
        },
      });

    } catch (e) {
      console.log(e);
      return unauhenticated();
    }
  });
});

router.post("/register", async (req, res) => register(req, res));

router.post("/signin", async (req, res) => {
  return passport.authenticate("local", (error: any, user: User, token: any ) => {
    if (error !== null) {
      return res.json({
        errors: {
          [error.code === "INCORRECT_CREDENTIALS" ? "password" : ""]: error,
        },
      });
    }

    const userToClient = {
      id: user.id,
      username: user.username,
    };

    sendRefreshToken(res, createRefreshToken(user));
    return res.json({
      payload: {
        token,
        user: userToClient,
      },
    });
  })(req, res);
});

export default router;
