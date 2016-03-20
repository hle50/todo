/**
 * Created by hoale on 3/19/2016.
 */
var User = require('./models/user');
module.exports = function(){
    return{
        requireAuthentication: function(req, res, next){
            var token = req.get('Auth');

            User.findByToken(token).then(function(user){
                req.user = user;
                next();
            }, function(){
                res.status(401).send();
            })
        }
    }
}
