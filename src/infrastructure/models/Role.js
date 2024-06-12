const { generateModel } = require("./util");

module.exports = generateModel({
    modelName: "Role",
    schema: {
        name: {
            type: String,
            required: true,
        },
    },
    hasAudit: true,
});
