const { Router } = require("express");

const createController = require("../utils/createController");

module.exports = () => {
    const router = new Router();

    router.get("/", createController("Default").index);

    return router;
};
