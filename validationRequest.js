
class ValidationRequest{
    constructor(address){
        this.walletAddress = address;
        this.requestTimeStamp = Date.now();
        this.message = this.walletAddress + ":" + this.requestTimeStamp + ":starRegistry";
    }

    updateValidationWindow(timeout){
        let timeElapse = Date.now() - this.requestTimeStamp;
        this.validationWindow = Math.floor((timeout - timeElapse) / 1000);
    }

    stillValid(timeout){
        let timeElapse = Date.now() - this.requestTimeStamp;
        return (timeElapse < timeout);
    }
}
module.exports.ValidationRequest = ValidationRequest;