/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');

const levelSandbox = require('./levelSandbox.js');
const block = require('./block.js');


/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/
class Blockchain{
  constructor(){
    this.levelSandbox = new levelSandbox.LevelSandbox();
    this.getBlockHeight()
        .then(height => {
          if (height === 0) {
              this.addBlock(new block.Block("First block in the chain - Genesis block"));
          }
        });
  }

  // Add new block
  addBlock(newBlock){
    let self = this;
    return self.getBlockHeight()
        .then(
            function (height) {
                // Block height
                newBlock.height = height;
                // UTC timestamp
                newBlock.time = new Date().getTime().toString().slice(0, -3);
                // previous block hash
                if (newBlock.height > 0) {
                     return self.getBlock(newBlock.height-1);
                }
                else {
                  return null;
                }

            }
        )
        .then(
            function(result) {
              if (result != null) {
                  newBlock.previousBlockHash = result.hash;
              }
                // Block hash with SHA256 using newBlock and converting to a string
                newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
                // Adding block object to chain
                return self.levelSandbox.addDataToLevelDB(JSON.stringify(newBlock).toString())
            }
        );
  }

  // Get block height
    getBlockHeight(){
      return  this.levelSandbox.getLevelDBCount();
  }

    // get block
     getBlock(blockHeight){
      return this.levelSandbox.getLevelDBData(blockHeight)
          .then(result => JSON.parse(result));
    }
    // validate block
    validateBlock(block){
      // get block hash
      let blockHash = block.hash;
      // remove block hash to test block integrity
      let clone = JSON.parse(JSON.stringify(block));
      clone.hash = '';
      // generate block hash
      let validBlockHash = SHA256(JSON.stringify(clone)).toString();
      // Compare
      if (blockHash===validBlockHash) {
          return true;
        } else {
          console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
          return false;
        }
    }

   // Validate blockchain
    validateChain() {
        return this.getBlockHeight()
            .then(height => {
                let errorLog = [];
                let promises = [];
                for (let i = 0; i < height - 1; i++) {
                    promises.push(this.getBlock(i)
                        .then(block => {
                            if (!this.validateBlock(block)) {
                                errorLog.push(i)
                            }
                            let previous = block.hash;
                            return this.getBlock(i+1)
                                .then (block => {
                                    if (typeof block !== "undefined" && block.previousBlockHash !== previous) {
                                        errorLog.push(i)
                                    }
                                });
                        })
                    );
                }
                return Promise.all(promises)
                    .then(results => {
                        if (errorLog.length > 0) {
                            console.log('Block errors = ' + errorLog.length);
                            console.log('Blocks: ' + errorLog);
                        } else {
                            console.log('No errors detected');
                        }
                    });
            });
    }
}

// Exporting the class Block to be reuse in other files
module.exports.Blockchain = Blockchain;