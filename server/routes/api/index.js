const express = require("express");
const router = express.Router();

const doorRoute = require("./door.route");

const defaultRoutes = [
  {
    path: "/door",
    route: doorRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/**
 * Middleware goes here
 */

module.exports = router;
