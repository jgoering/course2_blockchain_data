/*
const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');

let address = '142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ'
let signature = 'IJtpSFiOJrw/xYeucFxsHvIRFJ85YSGP8S1AEZxM4/obS3xr9iz7H0ffD7aM2vugrRaCi/zxaPtkflNzt5ykbc0='
let message = '142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ:1532330740:starRegistry'

console.log(bitcoinMessage.verify(message, address, signature))

 */

const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./block.js');
const simpleChain = require('./simpleChain.js');

const blockchain = new simpleChain.Blockchain();
const TimeoutRequestsWindowTime = 5*60*1000;

class ValidationController {
    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} app
     */
    constructor(app) {
        this.app = app;
        this.requestValidation();
        this.mempool = [];
        this.timeoutRequests = [];
    }

    requestValidation() {
        let self = this;
        this.app.post("/requestValidation", (req, res) => {
            let body = req.body;
            if (body && body !== "") {
                if (this.mempool.indexOf(body.address) === -1) {
                    this.mempool.push(body.address);
                    self.timeoutRequests[body.address]=setTimeout(function(){ self.removeValidationRequest(body.address) }, TimeoutRequestsWindowTime );
                }
                res.setHeader('Content-Type', 'text/plain');
                res.end(JSON.stringify(body).toString());
            } else {
                res.sendStatus(422);
            }
        });
    }

    removeValidationRequest(address) {
        this.mempool = this.mempool.filter(value => {return value !== address});
        delete this.timeoutRequests[address];
    }
}

/**
 * Exporting the ValidationController class
 * @param {*} app
 */
module.exports = (app) => { return new ValidationController(app);};