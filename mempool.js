const validationRequestClass = require('./validationRequest');
const TimeoutRequestsWindowTime = 5*60*1000;

class MemPool {
    constructor () {
        this.mempool = [];
        this.timeoutRequests = [];

    }

    getOrAdd(address) {
        let validationRequest;
        if (this.mempool[address]) {
            validationRequest = this.mempool[address];
        } else {
            validationRequest = new validationRequestClass.ValidationRequest(address);
            this.mempool[address] = validationRequest;
            this.timeoutRequests[address]=setTimeout(function(){ self.removeValidationRequest(address) }, TimeoutRequestsWindowTime );
        }
        validationRequest.updateValidationWindow(TimeoutRequestsWindowTime);
        return validationRequest;
    }
}

module.exports.MemPool = MemPool;