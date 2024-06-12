const { generateModel } = require("./util");

module.exports = generateModel({
    modelName: "Address",
    schema: {
        name: String,
        street: String,
        houseNo: Number,
    },
});
