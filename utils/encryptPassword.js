var crypto = require('crypto');
module.exports = function (password) {
    var encrypt = crypto.createHmac('sha256', password)
        .update('I love cupcakes')
        .digest('hex');
    console.log(encrypt);
    return encrypt;
};
