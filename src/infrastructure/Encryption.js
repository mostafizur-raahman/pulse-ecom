// dependencies
const bcrypt = require("bcrypt");

class Encryption {
    compare(password, encodedPassword) {
        return bcrypt.compareSync(password, encodedPassword);
    }

    encrypt(password) {
        const salt = bcrypt.genSaltSync();
        return bcrypt.hashSync(password, salt);
    }
}

module.exports = Encryption;
