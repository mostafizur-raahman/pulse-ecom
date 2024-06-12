const { OK } = require("http-status");
const Factory = require("./Factory");

class RoleController extends Factory {
    constructor() {
        super({ moduleName: "Role" });
    }

    read = () => async (req, res, next) => {
        const _read = this.createRead(
            { sortOrder: "desc", sortField: "createdAt" },
            "readRole"
        );

        await _read(req, res, next);
    };

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

    delete = () => async (req, res, next) => {
        const _delete = this.createDelete(req.query?.id, "deleteRole");

        return await _delete(req, res, next);
    };
}

module.exports = RoleController;
