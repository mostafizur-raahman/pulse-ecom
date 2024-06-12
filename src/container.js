const { createContainer, Lifetime, asClass, asValue } = require("awilix");
const { scopePerRequest } = require("awilix-express");

const config = require("../config");
const DB = require("./infrastructure/database");
const Fault = require("./shared/Fault");
const models = require("./infrastructure/models");
const Server = require("./interfaces/server");

const container = createContainer();

container.register({
    config: asValue(config),
    DB: asValue(DB),
    Fault: asValue(Fault),
    models: asValue(models),
    server: asClass(Server).singleton(),
});

container.loadModules(
    [
        "application/**/*.js",
        "infrastructure/authentication/*.js",
        "infrastructure/repositories/*!(BaseRepository).js",
        "infrastructure/RequestValidator.js",
        "infrastructure/Encryption.js",
    ],
    {
        formatName: "camelCase",
        resolverOptions: {
            lifetime: Lifetime.SINGLETON,
        },
        cwd: __dirname,
    }
);

container.register({
    containerMiddleware: asValue(scopePerRequest(container)),
});

module.exports = container;
