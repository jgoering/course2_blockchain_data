/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);
class LevelSandbox {
    // Add data to levelDB with key/value pair
    addLevelDBData(key, value) {
        return new Promise(function (resolve, reject) {
            db.put(key, value, err => {
                if (err) {
                    console.log('Block' + key + ' submission failed', err);
                    reject(err);
                } else {
                    resolve(value);
                }
            })
        });
    }

    // Get data from levelDB with key
    getLevelDBData(key) {
        return new Promise(function (resolve, reject) {
            db.get(key, (err, value) => {
                if (err) {
                    if (err.type === 'NotFoundError') {
                        resolve('undefined');
                    } else {
                        console.log('Block' + key + ' get failed', err);
                        reject(err);
                    }
                } else {
                    resolve(value);
                }
            });
        });
    }

    getLevelDBCount() {
        return new Promise(function (resolve, reject) {
            let i = 0;
            db.createReadStream()
                .on('data', function (data) {
                    i++;
                })
                .on('error', function (err) {
                    console.log('Unable to read data stream!', err);
                    reject(err)
                })
                .on('close', function () {
                    resolve(i);
                });
        });
    }


    // Add data to levelDB with value
    addDataToLevelDB(value) {
        let self = this;
        return this.getLevelDBCount()
            .then(count => self.addLevelDBData(count, value));
    }
}

module.exports.LevelSandbox = LevelSandbox;
