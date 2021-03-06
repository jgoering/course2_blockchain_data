const validationRequestClass = require('./validationRequest');
const validRequestClass = require('./validRequest');
const TimeoutRequestsWindowTime = 5*60*1000;
const bitcoinMessage = require('bitcoinjs-message');

class MemPool {
    constructor () {
        this.mempool = [];
        this.timeoutRequests = [];
        this.mempoolValid = [];
    }

    getOrAdd(address) {
        let validationRequest;
        if (this.mempool[address]) {
            validationRequest = this.mempool[address];
        } else {
            validationRequest = new validationRequestClass.ValidationRequest(address);
            this.mempool[address] = validationRequest;
            let self = this;
            this.timeoutRequests[address]=setTimeout(function(){ self.removeValidationRequest(address) }, TimeoutRequestsWindowTime );
        }
        validationRequest.updateValidationWindow(TimeoutRequestsWindowTime);
        return validationRequest;
    }

    removeValidationRequest(address) {
        delete this.mempool[address];
        delete this.timeoutRequests[address];
    }
    validateRequestByWallet(address, signature) {
        let validationRequest = this.mempool[address];
        if (validationRequest && validationRequest.stillValid(TimeoutRequestsWindowTime)) {
            if (bitcoinMessage.verify(validationRequest.message, address, signature)) {
                this.removeValidationRequest(address);
                let validRequest = new validRequestClass.ValidRequest(validationRequest);
                this.mempoolValid[address] = validRequest;
                return validRequest;
            }
        }
    }
    verifyAddressRequest(address) {
        let validRequest = this.mempoolValid[address];
        if (validRequest) {
            delete this.mempoolValid[address];
            return validRequest.status.messageSignature === 'valid';
        }
        return false;
    }
}

module.exports.MemPool = MemPool;