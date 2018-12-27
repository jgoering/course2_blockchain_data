/*
const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');

let address = '142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ'
let signature = 'IJtpSFiOJrw/xYeucFxsHvIRFJ85YSGP8S1AEZxM4/obS3xr9iz7H0ffD7aM2vugrRaCi/zxaPtkflNzt5ykbc0='
let message = '142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ:1532330740:starRegistry'

console.log(bitcoinMessage.verify(message, address, signature))

 */

const mempoolclass = require('./mempool.js');
const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./block.js');
const simpleChain = require('./simpleChain.js');

class ValidationController {
    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} app
     */
    constructor(app) {
        this.app = app;
        this.requestValidation();
        this.validate();
        this.mempool = new mempoolclass.MemPool();
        this.blockchain = new simpleChain.Blockchain();
    }

    requestValidation() {
        this.app.post("/requestValidation", (req, res) => {
            let body = req.body;
            if (body && body !== "") {
                let validationRequest = this.mempool.getOrAdd(body.address);
                res.setHeader('Content-Type', 'text/plain');
                res.end(JSON.stringify(validationRequest).toString());
            } else {
                res.sendStatus(422);
            }
        });
    }

    validate() {
        this.app.post("/validate", (req, res) => {
            let body = req.body;
            if (body && body !== "") {
                let validRequest = this.mempool.validateRequestByWallet(body.address, body.signature);
                if (validRequest) {
                    res.setHeader('Content-Type', 'text/plain');
                    res.end(JSON.stringify(validRequest).toString());
                } else {
                    res.sendStatus(401);
                }
            } else {
                res.sendStatus(422);
            }
        })
    }
}

/**
 * Exporting the ValidationController class
 * @param {*} app
 */
module.exports = (app) => { return new ValidationController(app);};