var mongoose = require('mongoose');
var _ = require('underscore');
var encrypt = require('./../utils/encryptPassword');
var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');

var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};
var user = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    password: {
        type: String,
        require: true
    }
});
user.methods.authenticate = function (body) {
    return new Promise(function (resolve, reject) {
        if (typeof body.email !== 'string' || typeof body.password !== 'string') {
            return reject();
        }
        mongoose.model('User').findOne({email: body.email, password: encrypt(body.password)}, function (err, user) {
            if (err) {
                return reject();
            }
            else {
                if (!user) {
                    return reject();
                }
                return resolve(user);
            }
        })
    })
};
user.methods.generateToken = function (type, id) {
    console.log(id);
    if (!_.isString(type)) {
        return undefined;
    }
    try {
        var stringData = JSON.stringify({id: id, type: type});
        var encryptedData = cryptojs.AES.encrypt(stringData, 'abc123!#').toString();
        var token = jwt.sign(
            {
                token: encryptedData
            }, 'qwerty098'
        );
        console.log(token);
        return token;
    } catch (e) {
        console.log(e);
        return undefined;
    }

};
user.statics.findByToken = function (token) {
    console.log(token);
    return new Promise(function (resolve, reject) {
        try {
            var decodeJWT = jwt.verify(token, 'qwerty098');
            var bytes = cryptojs.AES.decrypt(decodeJWT.token, 'abc123!#');
            var tokenData = JSON.parse(bytes.toString(cryptojs.enc.Utf8));
            console.log(tokenData.id);
            console.log(user);
            mongoose.model('User').findById(tokenData.id, function (err, user) {
                console.log(err);
                console.log(user);
                if (err) {
                    reject();
                }
                else {
                    if (!user) {
                        reject();
                    }
                    else {
                        resolve(user);
                    }
                }
            });

        } catch (err) {
            reject();
        }
    })

};
module.exports = mongoose.model('User', user);
