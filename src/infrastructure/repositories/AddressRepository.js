const BaseRepository = require("./BaseRepository");

class AddressRepository extends BaseRepository {
    constructor({ models }) {
        super(models.Address);
    }
}

module.exports = AddressRepository;
