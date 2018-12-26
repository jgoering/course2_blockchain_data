const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./block.js');
const simpleChain = require('./simpleChain.js');

const blockchain = new simpleChain.Blockchain();

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} app
     */
    constructor(app) {
        this.app = app;
        this.getBlockByIndex();
        this.postNewBlock();
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    getBlockByIndex() {
        this.app.get("/block/:index", (req, res) => {
            blockchain.getBlock(req.params.index)
                .then(result => res.send(JSON.stringify(result).toString()));
        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     * example for http request body: {"body":"Testing block with test string data"}
     */
    postNewBlock() {
        this.app.post("/block", (req, res) => {
            let block = req.body;
            if (block.body && block.body !== "") {
                blockchain.addBlock(new BlockClass.Block(block.body))
                    .then(result => {
                        res.setHeader('Content-Type', 'text/plain');
                        res.end(JSON.stringify(result).toString());
                    })
            } else {
                res.sendStatus(422);
            }
        });
    }
}

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app) => { return new BlockController(app);};