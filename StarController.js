/*
const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');

let address = '142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ'
let signature = 'IJtpSFiOJrw/xYeucFxsHvIRFJ85YSGP8S1AEZxM4/obS3xr9iz7H0ffD7aM2vugrRaCi/zxaPtkflNzt5ykbc0='
let message = '142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ:1532330740:starRegistry'

console.log(bitcoinMessage.verify(message, address, signature))

 */

const mempoolclass = require('./mempool.js');
const BlockClass = require('./block.js');
const simpleChain = require('./simpleChain.js');
const hex2ascii = require('hex2ascii');

class StarController {
    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} app
     */
    constructor(app) {
        this.app = app;
        this.requestValidation();
        this.validate();
        this.addStar();
        this.getStarByHash();
        this.getStarsByWalletAddress();
        this.mempool = new mempoolclass.MemPool();
        this.blockchain = new simpleChain.Blockchain();
    }

    requestValidation() {
        this.app.post("/requestValidation", (req, res) => {
            let body = req.body;
            if (body && body !== "") {
                let validationRequest = this.mempool.getOrAdd(body.address);
                res.setHeader('Content-Type', 'application/json');
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

    addStar() {
        this.app.post("/stars", (req, res) => {
            let body = req.body;
            if (body && body !== "") {
                if (this.mempool.verifyAddressRequest(body.address)) {
                    let blockBody = {
                        address: body.address,
                        star: {
                            ra: body.star.ra,
                            dec: body.star.dec,
                            mag: body.star.mag,
                            cen: body.star.cen,
                            story: Buffer.from(body.star.story).toString('hex')
                        }
                    };
                    let block = new BlockClass.Block(blockBody);
                    this.blockchain.addBlock(block)
                        .then(block => {
                            block.body.star.storyDecoded = hex2ascii(block.body.star.story);
                            res.setHeader('Content-Type', 'text/plain');
                            res.end(JSON.stringify(block).toString());
                        });
                } else {
                    res.sendStatus(401);
                }
            } else {
                res.sendStatus(422);
            }
        });
    }

    getStarByHash() {
        this.app.get("/stars/hash::hash", (req, res) => {
            this.blockchain.getBlockByHash(req.params.hash)
                .then(block => {
                    if (block) {
                        block.body.star.storyDecoded = hex2ascii(block.body.star.story);
                        res.setHeader('Content-Type', 'text/plain');
                        res.end(JSON.stringify(block).toString());
                    } else {
                        res.sendStatus(404);
                    }
                })
        });
    }
    getStarsByWalletAddress() {
        this.app.get("/stars/address::address", (req, res) => {
            this.blockchain.getBlocksByWalletAddress(req.params.address)
                .then(result => {
                    result = result.map(block => {
                        block.body.star.storyDecoded = hex2ascii(block.body.star.story);
                        return block;
                    });
                    res.setHeader('Content-Type', 'text/plain');
                    res.end(JSON.stringify(result).toString());
                })
        });
    }
}

/**
 * Exporting the StarController class
 * @param {*} app
 */
module.exports = (app) => { return new StarController(app);};