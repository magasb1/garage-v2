
const path = require('path')
const Gpio = require('onoff').Gpio
require('dotenv').config()

module.exports = {
  activateRelay: async (req, res, next) => {
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

    return { "Status": "Ok", "Message": "Door triggered" }
  },

  sensorStatus: async (req, res, next) => {
    const SENSOR_PIN = process.env.SENSOR_GPIO_PIN || 15
    const sensor = new Gpio(SENSOR_PIN, 'in', 'both');
    let doorStatus

    await sensor.read()
      .then((value) => { 
        let doorStatus = value ? "Closed" : "Open"
        return res.json({ "Status": "Ok", "Message": doorStatus })
      })
      .catch((err) => {
        return res.json({ "Status": "Error", "Message": err })
      })  
  }


}
