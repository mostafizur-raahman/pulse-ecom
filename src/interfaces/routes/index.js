const { Router } = require("express");

const defaultRoutes = require("./default");
const addressRoutes = require("./address");
const routes = () => {
    const router = new Router();

    router.use("/v1", defaultRoutes());
    router.use("/v1/addresses", addressRoutes());

    return router;
};

module.exports = routes;
