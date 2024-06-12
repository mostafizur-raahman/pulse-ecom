// dependencies
const jwt = require("jsonwebtoken");

class JWT {
    decode(token) {
        return jwt.decode(token);
    }

    sign(data, key, ttl = 3600) {
        return jwt.sign(data, key, {
            expiresIn: ttl,
        });
    }

    verify(token, key) {
        return jwt.verify(token, key);
    }
}

module.exports = JWT;
