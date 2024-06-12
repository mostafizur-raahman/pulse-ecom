const { OK } = require("http-status");
const Factory = require("./Factory");

class RoleController extends Factory {
    constructor() {
        super({ moduleName: "Role" });
    }

    async create(req, res, next) {
        try {
            const doc = await req.container
                .resolve("createRole")
                .execute(req.body);

            res.status(OK).send({
                message: "Role created successfully.",
                doc,
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = RoleController;
