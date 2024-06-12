const { Router } = require("express");

const createController = require("../utils/createController");

module.exports = () => {
    const router = new Router();

    router.get("/", createController("Role").read());

    router.post("/", createController("Role").create);

    router.delete("/", createController("Role").delete());

    return router;
};
