const crypto = require('crypto');

class Wallet {
    constructor() {
        const { privateKey, publicKey } = this.generateKeyPair();
        this.privateKey = privateKey;
        this.publicKey = publicKey;
    }

    generateKeyPair() {
        const keyPair = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase: ''
            }
        });

        return {
            privateKey: keyPair.privateKey,
            publicKey: keyPair.publicKey
        };
    }

    sign(data) {
        const sign = crypto.createSign('SHA256');
        sign.update(data);
        sign.end();
        return sign.sign(this.privateKey);
    }

    getWalletAddress() {
        // Normally you would hash the public key to create the wallet address
        // but for simplicity, we'll just use the public key
        return this.publicKey;
    }
}
module.exports = Wallet;