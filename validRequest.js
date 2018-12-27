
class ValidRequest{
    constructor(validationRequest){
        this.registerStar = true;
        this.status = {
            walletAddress: validationRequest.address,
            requestTimeStamp: validationRequest.requestTimeStamp,
            message: validationRequest.message,
            validationWindow: validationRequest.validationWindow,
            messageSignature: 'valid'
        }
    }
}
module.exports.ValidRequest = ValidRequest;