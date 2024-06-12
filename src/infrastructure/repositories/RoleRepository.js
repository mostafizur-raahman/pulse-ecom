const BaseRepository = require("./BaseRepository");

class RoleRepository extends BaseRepository {
    constructor({ models }) {
        super(models.Role);
    }
}

module.exports = RoleRepository;
