const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

class ConfigService {
    constructor() {
        this.loadEnvironment();
    }

    loadEnvironment() {
        const envPath = path.join(__dirname, "..", ".env");
        const envTestPath = path.join(__dirname, "..", ".env.test");

        // Load .env first (base configuration)
        if (fs.existsSync(envPath)) {
            dotenv.config({ path: envPath });
        }

        // Load .env.test with override=true (takes precedence)
        if (fs.existsSync(envTestPath)) {
            dotenv.config({ path: envTestPath, override: true });
        }

        // process.env now has the final merged values with correct precedence:
        // .env.test > .env > existing process.env
    }

    get(key, defaultValue = undefined) {
        return process.env[key] !== undefined ? process.env[key] : defaultValue;
    }

    getNumber(key, defaultValue = 0) {
        const value = this.get(key);
        return value !== undefined ? parseInt(value, 10) : defaultValue;
    }

    getBoolean(key, defaultValue = false) {
        const value = this.get(key);
        if (value === undefined) return defaultValue;
        return value === "true" || value === "1" || value === true;
    }

    has(key) {
        return process.env[key] !== undefined;
    }

    getAll() {
        return { ...process.env };
    }
}

// Export singleton instance
module.exports = new ConfigService();
