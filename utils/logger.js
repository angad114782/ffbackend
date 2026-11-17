const { createStandaloneLogger } = require("@technoease/logger");
const path = require("path");
const config = require("./config");
const Log = require("../model/log");

const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
        if (typeof value === "bigint") {
            return value.toString();
        }
        if (value instanceof Error) {
            return {
                message: value.message,
                stack: value.stack,
                ...value
            };
        }
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return "[Circular]";
            }
            seen.add(value);
        }
        return value;
    };
};

const sanitize = (obj, maxDepth = 10) => {
    const seen = new WeakSet();

    const walk = (val, depth) => {
        if (depth > maxDepth) return "[Max Depth Reached]";

        if (val === null || val === undefined) return val;

        if (typeof val === "bigint") return val.toString();

        if (val instanceof Error) {
            const errorObj = {
                message: val.message,
                stack: val.stack
            };
            // Copy enumerable properties, but skip huge/circular ones if we know them
            for (const key in val) {
                if (key !== 'message' && key !== 'stack') {
                    errorObj[key] = walk(val[key], depth + 1);
                }
            }
            return errorObj;
        }

        if (typeof val !== "object") return val;

        // Use toJSON if available (for Sequelize instances, Dates, etc.)
        if (typeof val.toJSON === 'function' && !(val instanceof Error)) {
            try {
                const json = val.toJSON();
                if (json !== val) {
                    return walk(json, depth + 1);
                }
            } catch (e) {
                // Fallback to manual walk
            }
        }

        if (seen.has(val)) return "[Circular]";
        seen.add(val);

        if (Array.isArray(val)) {
            return val.map(item => walk(item, depth + 1));
        }

        // Handle typical objects
        const clone = {};

        // Use a try-catch for property access as some objects (like Socket/Parser) 
        // might throw or behave weirdly on certain keys
        const keys = Object.keys(val);
        for (const key of keys) {
            try {
                clone[key] = walk(val[key], depth + 1);
            } catch (e) {
                clone[key] = `[Error accessing property: ${e.message}]`;
            }
        }
        return clone;
    };

    try {
        return walk(obj, 0);
    } catch (e) {
        return `[Serialization Error: ${e.message}]`;
    }
};



const baseLogger = createStandaloneLogger({
    level: config.get('LOG_LEVEL', 'info'),
    console: false, // Disable console logging by default
}, {
    model: Log,
    fallback: {
        path: config.get('LOG_PATH')
            ? (path.isAbsolute(config.get('LOG_PATH'))
                ? config.get('LOG_PATH')
                : path.join(__dirname, '..', config.get('LOG_PATH')))
            : path.join(__dirname, '..', 'logs'),
        filename: config.get('LOG_FILENAME', 'combined.log'),
        errorFilename: config.get('LOG_ERROR_FILENAME', 'error.log')
    }
});

const logger = {
    log: (msg, meta, storage) => {
        return baseLogger.log(sanitize(msg), sanitize(meta), storage);
    },
    info: (msg, meta, storage) => {
        return logger.log(msg, meta, storage);
    },
    error: (msg, meta, storage) => {
        // If the first argument is an Error object, extract message and meta
        if (msg instanceof Error) {
            return baseLogger.error(msg.message, sanitize({
                stack: msg.stack,
                ...meta,
                ...(typeof msg === 'object' ? msg : {})
            }), storage);
        }
        return baseLogger.error(sanitize(msg), sanitize(meta), storage);
    },
    warn: (msg, meta, storage) => baseLogger.warn(sanitize(msg), sanitize(meta), storage),
    debug: (msg, meta, storage) => baseLogger.debug(sanitize(msg), sanitize(meta), storage),
    verbose: (msg, meta, storage) => baseLogger.verbose(sanitize(msg), sanitize(meta), storage),
};

module.exports = {
    logger,
    getCircularReplacer
};


