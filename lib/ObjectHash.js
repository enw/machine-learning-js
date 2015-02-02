// returns SHA1 hash for an object
function getHash (obj) {
    var crypto = require('crypto');
    var shasum = crypto.createHash('sha1');
    shasum.update(JSON.stringify(obj));
    return shasum.digest('hex');
}

module.exports = getHash;

/*
console.log(getHash(123));
console.log(getHash(124));
console.log(getHash({foo:'123'}));
console.log(getHash({foo:'123', bar:'hello'}));
*/

