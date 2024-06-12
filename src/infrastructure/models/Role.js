const { generateModel } = require("./util");

module.exports = generateModel({
    modelName: "Role",
    schema: {
        name: {
            type: String,
            enum: ["ADMIN", "CUSTOMER", "MERCHENT"],
            required: true,
        },
    },
    hasAudit: true,
});
