# Blockchain API

This is a API wrapper around the persistent blockchain developed in the last project. It is using express framework.

## Running

node app.js

## Testing

To create a block:

curl -X POST \
  http://localhost:8000/block \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: c72dfa2f-b958-49e8-9589-01ab39f8f9cb' \
  -H 'cache-control: no-cache' \
  -d '{"body":"Testing block with test string data"}'
  
To read the newly created block:

curl -X GET \
  http://localhost:8000/block/1 \
  -H 'Postman-Token: 2c2dea6c-4903-4d7d-8a64-2b77650cb5c4' \
  -H 'cache-control: no-cache'
  
# Star registry API
to request a validation:

curl -X POST \
  http://localhost:8000/requestValidation \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 1156a162-4f6b-4ca7-a303-4296838ca685' \
  -H 'cache-control: no-cache' \
  -d '{
    "address":"1Dt8tykatvF9gauRdFXNgxb35eYZAZH1V5"
}' 

to validate:

curl -X POST \
  http://localhost:8000/message-signature/validate \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 45d7e221-757b-42e2-9a02-ecea7c37b39c' \
  -H 'cache-control: no-cache' \
  -d '{
    "address":"1Dt8tykatvF9gauRdFXNgxb35eYZAZH1V5",
    "signature":"IPTehtCBekaSDmP6Y/iYJNGTkEOMpxtdhb62lFojUesHMi3+ByqCnioEcC2R7/edwLvCnQlWsqvoWI2wG9bxHH0="
}'

to post star data:

curl -X POST \
  http://localhost:8000/stars \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 08226993-c857-4a4c-b3d7-b24046037fa2' \
  -H 'cache-control: no-cache' \
  -d '{
"address": "1Dt8tykatvF9gauRdFXNgxb35eYZAZH1V5",
    "star": {
            "dec": "68° 52'\'' 56.9",
            "ra": "16h 29m 1.0s",
            "story": "Found star using https://www.google.com/sky/"
        }
}'

to get star data by hash:

curl -X GET \
  http://localhost:8000/stars/hash:8ca9fbc706794ae0ab76b0cb389c7d51ac387f5d1413adb203209fe18c74b7bc \
  -H 'Postman-Token: 7444fd7a-d664-42fe-9821-ae7e7bc20de1' \
  -H 'cache-control: no-cache'
  
to list stars for wallet address:

curl -X GET \
  http://localhost:8000/stars/address:1Dt8tykatvF9gauRdFXNgxb35eYZAZH1V5 \
  -H 'Postman-Token: f8520a08-d4f7-4d8f-b7bd-8a618006e8aa' \
  -H 'cache-control: no-cache'