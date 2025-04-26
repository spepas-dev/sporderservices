const { logger } = require("../logs/winston");
const crypto = require('crypto');

let ussd = {};

const algorithm = 'aes-256-cbc';
// Assuming your key and iv are stored as hex strings
const key = Buffer.from(process.env.AES_ENCRYPTION_KEY, 'hex'); // 64 hex chars = 32 bytes
const iv = Buffer.from(process.env.AES_ENCRYPTION_IV, 'hex'); // 32 hex chars = 16 bytes




ussd.AESEncrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
   };






ussd.AESDecrypt = (encryptedData) => {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
   };



module.exports = ussd