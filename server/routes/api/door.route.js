const express = require("express");
const Gpio = require('onoff').Gpio
const router = express.Router();

router.route("/").post(async (req, res) => {

  const RELAY_PIN = process.env.RELAY_GPIO_PIN || 4
  const TIMEOUT = process.env.RELAY_TIMEOUT || 500
  const relay = new Gpio(RELAY_PIN, 'high');

  relay.write(1)
  setTimeout(() => {
    relay.write(0)
    setTimeout(() => {
      relay.unexport()
    }, TIMEOUT)
  }, TIMEOUT)
  res.status(200).json({ status: "ok", message: "Door triggered" })

});

module.exports = router