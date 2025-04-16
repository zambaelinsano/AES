// aes.js
const crypto = require('crypto');

function encrypt(text, key) {
    const cipher = crypto.createCipheriv('aes-128-ecb', Buffer.from(key, 'utf-8'), null);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

function decrypt(encryptedText, key) {
    const decipher = crypto.createDecipheriv('aes-128-ecb', Buffer.from(key, 'utf-8'), null);
    let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

module.exports = { encrypt, decrypt };
