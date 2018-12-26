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