const { Router } = require("express");

const { twitchRoutes } = require("./twitch");
const { usersRoutes } = require("./users");

const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/twitch", twitchRoutes);

module.exports = { routes };
