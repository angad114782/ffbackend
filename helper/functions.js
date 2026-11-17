exports.dataNotFound = (model, statusCode, message) => {
  if (!model) {
    const error = new Error(message);
    error.statusCode = statusCode;
    throw error;
  }
};

exports.dataFound = (model, statusCode, message) => {
  if (model) {
    const error = new Error(message);
    error.statusCode = statusCode;
    throw error;
  }
};

const crypto = require("crypto");
const secretKeyHex = process.env.CRYPTO_SECRET;
const secretKey = Buffer.from(secretKeyHex, "hex");

exports.encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", secretKey, iv);
  let encrypted = cipher.update(text, "utf-8", "hex");
  encrypted += cipher.final("hex");
  const combined = encrypted + iv.toString("hex");
  return combined;
};

exports.decrypt = (shortenedCombined) => {
  const extractedEncryptedText = shortenedCombined.substring(0, 32);
  const extractedIV = shortenedCombined.substring(32);
  const ivForDecryption = Buffer.from(extractedIV, "hex");

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    secretKey,
    ivForDecryption,
  );
  let decrypted = decipher.update(extractedEncryptedText, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
};

exports.getAuthHeaderConfig = (req) => {
  let config = {
    headers: {
      Authorization: "Bearer " + req.token,
      "Accept-Language": "en",
    },
  };
  return config;
};

// exports.getAuthHeaderConfig = (req, options = {}) => {
//   const localUrl = process.env.LOCAL_URL || '';
//   const treatLocalAsUnauthenticated = options.treatLocalAsUnauthenticated ?? true;

//   const isLocal = !!localUrl && /(localhost|127\.0\.0\.1)/i.test(localUrl);

//   const headers = {
//     "Accept-Language": "en",
//   };

//   if (!(treatLocalAsUnauthenticated && isLocal)) {
//     headers.Authorization = "Bearer " + (req && req.token ? req.token : '');
//   }

//   return { headers };
// };


exports.getAuthHeaderConfig = (req) => {
  let token = '';

  if (req && req.headers && req.headers.authorization) {
    // "Bearer abc123" → extract only token
    const parts = req.headers.authorization.split(' ');
    token = parts.length === 2 ? parts[1] : '';
  }

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      "Accept-Language": "en",
    },
  };
};