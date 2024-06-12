const { default: mongoose } = require("mongoose");
const { generateModel } = require("./util");

module.exports = generateModel({
    modelName: "User",
    schema: {
        name: {
            type: String,
            required: true,
            minLength: 2,
            maxLength: 20,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            minLength: 6,
        },
        roleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role",
            required: true,
        },
    },
    hasAudit: true,
});
