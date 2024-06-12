require("dotenv").config();

module.exports = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || "development",
    APP_NAME: process.env.APP_NAME || "Node Backend",
    HOST: process.env.HOST || "localhost",
    MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017",
    jwt: {
        secret: process.env.APP_KEY,
        ttl: process.env.APP_JWT_TTL,
    },
    IP_WHITELIST: process.env.IP_WHITELIST || "http://localhost:3000",
    CUSTOMER_SITE_URL: process.env.CUSTOMER_SITE_URL,
};
