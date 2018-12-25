const simpleChain = require('./simpleChain.js');
const blockchain = new simpleChain.Blockchain();

(function theLoop (i) {
    setTimeout(function () {
        let blockTest = new simpleChain.Block("Test Block - " + (i + 1));
        blockchain.addBlock(blockTest).then(blockchain.validateChain()).then((result) => {
            console.log(result);
            i++;
            if (i < 10) theLoop(i);
        });
    }, 1000);
})(0);


