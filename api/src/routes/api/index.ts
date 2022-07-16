import { Router } from "express";
import checkAuth from "../../middleware/auth";
import { Gpio } from "onoff";
const router = Router();

import authRoutes from './auth'

router.get("/", (req, res) => {
  return res.status(200).json({
    api: "Server API",
    version: "1.0",
  });
});

router.get("/door", checkAuth, async (req, res) => {
  const RELAY_PIN = Number(process.env.RELAY_GPIO_PIN) || 4;
  const TIMEOUT = Number(process.env.RELAY_TIMEOUT) || 500;
  const relay = new Gpio(RELAY_PIN, "high");

  relay.write(1);
  setTimeout(() => {
    relay.write(0);
    setTimeout(() => {
      relay.unexport();
    }, TIMEOUT);
  }, TIMEOUT);
  res.status(200).json({ status: "ok", message: "Door triggered" });
});

router.use("/auth", authRoutes);


export default router;
