const mongoose = require("mongoose");

function decodeBase64(base64String) {
    // Use Buffer.from() to create a buffer from the Base64 string
    const buffer = Buffer.from(base64String, "base64");
    // Convert the buffer to a string using toString()
    const decodedString = buffer.toString("utf-8");
    // Return the decoded string
    return decodedString;
}

function toObjectId(id) {
    try {
        return new mongoose.Types.ObjectId(id);
    } catch (error) {
        // Add status and return in Bengali
        throw new Error("Invalid id");
    }
}

/**
 * Deletes properties from an object
 *
 * @param {Object} obj object to be cleaned
 * @param {Array} props properties to be deleted
 * @returns {Object} clean object
 */
const deletePropertiesFromObject = (obj, props) => {
    // Deep clone the obj._doc using JSON.stringify and JSON.parse
    const newObj = JSON.parse(JSON.stringify(obj));

    props.forEach((prop) => {
        if (newObj.hasOwnProperty(prop)) {
            delete newObj[prop];
        }
    });

    return newObj;
};

/**
 * Trims the properties of an object
 *
 * @param {Object} obj The object to be trimmed
 * @returns {Object} The trimmed object
 */
const trimObjectProperties = (obj) => {
    if (typeof obj !== "object" || obj === null) {
        // If the object is not an object or is null, return it as-is
        return obj;
    }

    if (Array.isArray(obj)) {
        // If the object is an array, iterate through its elements
        return obj.map((item) => trimObjectProperties(item));
    }

    // If the object is an object, iterate through its properties
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            let value = obj[key];

            // Check if the property value is a string and trim it
            if (typeof value === "string") {
                value = value.trim();

                // Set the property value to null if it's an empty string after trimming
                if (value === "") {
                    value = null;
                }
            } else if (typeof value === "object" && value !== null) {
                // If the property value is an object, recursively trim its properties
                value = trimObjectProperties(value);
            }

            obj[key] = value;
        }
    }

    return obj;
};

function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
}

function toMaxAvailableTimeOfDay(date) {
    return new Date(date).setHours(23, 59, 59, 999);
}

function toMinAvailableTimeOfDay(date) {
    return new Date(date).setHours(0, 0, 0, 0);
}

function toYesterdayMaxAvailableTimeOfDay(date) {
    const yesterday = new Date(date);
    yesterday.setDate(yesterday.getDate() - 1);

    return toMaxAvailableTimeOfDay(yesterday);
}

function increaseDateByOneDay(date) {
    const tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return tomorrow;
}

module.exports = {
    decodeBase64,
    toObjectId,
    deletePropertiesFromObject,
    trimObjectProperties,
    isEmptyObject,
    toMaxAvailableTimeOfDay,
    toMinAvailableTimeOfDay,
    toYesterdayMaxAvailableTimeOfDay,
    increaseDateByOneDay,
};
