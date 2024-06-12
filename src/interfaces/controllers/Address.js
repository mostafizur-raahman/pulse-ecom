const { OK } = require("http-status");
const Factory = require("./Factory");

class AddressController extends Factory {
    constructor() {
        super({ moduleName: "Address" });
    }

    async create(req, res, next) {
        try {
            const doc = await req.container
                .resolve("createAddress")
                .execute(req.body);

            res.status(OK).send({
                message: "Address created successfully.",
                doc,
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AddressController;
