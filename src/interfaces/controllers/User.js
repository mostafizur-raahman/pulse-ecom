const { OK } = require("http-status");
const Factory = require("./Factory");

class UserController extends Factory {
    constructor() {
        super({ moduleName: "Address" });
    }

    async create(req, res, next) {
        try {
            const doc = await req.container
                .resolve("createUser")
                .execute(req.body);

            res.status(OK).send({
                message: "User created successfully.",
                doc,
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = UserController;
