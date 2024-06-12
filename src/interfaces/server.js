const compression = require("compression");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const Status = require("http-status");
const routes = require("./routes");
const morgan = require("morgan");
const path = require("path");
const _http = require("http");
const rfs = require("rotating-file-stream");

class Server {
    constructor({ config, DB, containerMiddleware }) {
        this.config = config;
        this.express = express();
        this.express.use(compression());
        this.DB = DB;
        this.containerMiddleware = containerMiddleware;
        this.express.use(containerMiddleware);
    }

    start() {
        this._configure();

        return new Promise((resolve) => {
            const server = _http.createServer(this.express);

            const http = server.listen(this.config.PORT, () => {
                const { port } = http.address();

                console.log(
                    `==> ${new Date()} \n${
                        this.config.APP_NAME
                    } App running on port ${port}`
                );
                resolve();
            });
        });
    }

    _configure() {
        const whitelist = this.config.IP_WHITELIST.split(",");

        console.log("Whitelisting: ", whitelist);

        const corsOptions = {
            origin: function (origin, cb) {
                if (whitelist.indexOf(origin) !== -1) {
                    cb(null, true);
                } else {
                    callback(new Error("Not allowed by CORS"));
                }
            },
        };

        if (this.config.NODE_ENV === "production") {
            this.express.use(cors(corsOptions));
        } else {
            this.express.use(cors());
        }

        this.express.use(helmet());
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: true }));

        const accessLogStream = rfs.createStream("access.log", {
            interval: "1d",
            path: path.join(__dirname, "log"),
        });

        this.express.use(morgan("combined", { stream: accessLogStream }));
        this.express.use(morgan("dev"));

        this.express.use("/", routes());

        this.DB.connect();

        // Handle invalid requests
        this.express.use((req, res) => {
            return res.status(404).json({ error: "Not found" });
        });

        // Handle errors
        this.express.use((error, req, res, next) => {
            console.error(error.stack);

            let message = error.message,
                status = Status.INTERNAL_SERVER_ERROR;

            if (error.code === 11000) {
                const value = this.getValueFromMongoDuplicateError(error);

                message = `${value} "already exists."`;
                status = Status.CONFLICT;
            }

            if (error.message === "Invalid date format")
                status = Status.BAD_REQUEST;

            res.status(error.status ? error.status : status).send({
                message: message,
            });
        });
    }
    getValueFromMongoDuplicateError = (error) => {
        const stringPattern = /"([^"]+)"/;
        const numberPattern = /(\w+): (\d+)/;

        let value = null;
        let matches = null;

        if (stringPattern.test(error.message)) {
            matches = error.message.match(stringPattern);
        } else if (numberPattern.test(error.message)) {
            matches = error.message.match(numberPattern);
        }

        if (matches && matches.length > 1) {
            value = matches[1];
        }

        return value;
    };
}

module.exports = Server;
