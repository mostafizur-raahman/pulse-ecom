const { Router } = require("express");

const defaultRoutes = require("./default");
const addressRoutes = require("./address");
const roleRoutes = require("./role");
const userRoutes = require("./user");

const routes = () => {
    const router = new Router();

    router.use("/v1", defaultRoutes());
    router.use("/v1/addresses", addressRoutes());
    router.use("/v1/roles", roleRoutes());
    router.use("/v1/users", userRoutes());

    return router;
};

module.exports = routes;
