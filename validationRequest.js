
class ValidationRequest{
    constructor(address){
        this.walletAddress = address;
        this.requestTimeStamp = Date.now();
    }

    updateValidationWindow(timeout){
        let timeElapse = Date.now() - this.requestTimeStamp;
        this.validationWindow = Math.floor((timeout - timeElapse) / 1000);
    }

}
module.exports.ValidationRequest = ValidationRequest;