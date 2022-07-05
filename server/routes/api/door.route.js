const express = require("express");
const gpioService = require("../../services/gpio.service")
const router = express.Router();

router.route("/").post(async (req, res) => {
  //res.status(200).json({ status: "ok", message: "demo reply" });
  gpioService.activateRelay
});

module.exports = router