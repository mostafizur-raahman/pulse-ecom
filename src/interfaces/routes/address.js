const { Router } = require("express");

const createController = require("../utils/createController");

module.exports = () => {
    const router = new Router();

    router.post("/", createController("Address").create);

    return router;
};
