var mongoose = require('mongoose');
var _ = require('underscore');
var encrypt = require('./../utils/encryptPassword');

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
user.statics.authenticate = function (body) {
    return new Promise(function(resolve, reject){
        if (typeof body.email !== 'string' || typeof body.password !== 'string') {
            return reject();
        }
        mongoose.model('User').findOne({email: body.email, password:  encrypt(body.password)}, function(err, user){
            if(err){
               return reject();
            }
            else{
                if(!user){
                    return reject();
                }
                return resolve(user);
            }
        })
    })
};
module.exports = mongoose.model('User', user);
