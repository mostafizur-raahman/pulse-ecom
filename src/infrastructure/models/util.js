const mongoose = require("mongoose");

const auditSchema = {
    states: [
        {
            // even though we had three states, we have been using only one here for ease of access
            state: {
                type: String,
                enum: ["CREATED", "UPDATED", "DELETED"],
                default: "UPDATED",
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            timestamp: {
                type: Date,
                default: Date.now,
            },
            payload: Object,
        },
    ],
    isDeleted: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
};

/**
 * Generates a Mongoose model dynamically based on the provided model name and schema.
 *
 * @param {object} options - The options object containing the modelName and schema.
 * @param {string} options.modelName - The name of the model.
 * @param {object} options.schema - The schema definition object for the model.
 * @param {boolean} options.hasStatus - Whether or not the model has a status field.
 * @param {boolean} options.hasAudit - Whether or not the model has the audit fields.
 * @param {mongoose.Connection} options.connection - The Mongoose connection to use.
 * @returns {mongoose.Model} The dynamically generated Mongoose model.
 */
const generateModel = ({
    modelName,
    schema,

    hasAudit = true,
    connection = mongoose,
}) => {
    const mergedSchema = new mongoose.Schema(
        {
            ...schema,
            ...(hasAudit ? auditSchema : {}),
            isDeleted: {
                type: Boolean,
                default: false,
            },
        },
        { timestamps: true }
    );

    return connection.model(modelName, mergedSchema);
};

/**
 * Validates a query object.
 *
 * @param {Object} query - The query object to validate.
 * @throws {Error} If the query is invalid.
 * @throws {Error} If the query is empty.
 * @throws {Error} If the query is null.
 * @throws {Error} If the query is undefined.
 * @throws {Error} If the query is not an object.
 * @throws {Error} If the query is an empty object.
 * @throws {Error} If the query is an object with only invalid keys.
 * @throws {Error} If the query is an object with only empty keys.
 * @throws {Error} If the query is an object with only null keys.
 * @throws {Error} If the query is an object with only undefined keys.
 * @throws {Error} If the query is an object with only non-string keys.
 */
const validateQuery = (query) => {
    if (!query) {
        throw new Error("Query cannot be empty.");
    }

    if (typeof query !== "object") {
        throw new Error("Query must be an object.");
    }

    if (Object.keys(query).length === 0) {
        throw new Error("Query cannot be empty.");
    }

    if (
        Object.keys(query).every(
            (key) =>
                !key ||
                key === null ||
                key === undefined ||
                key === "" ||
                typeof key !== "string"
        )
    ) {
        throw new Error("Query cannot be empty.");
    }
};

module.exports = {
    generateModel,
    validateQuery,
};
