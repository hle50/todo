var mongoose = require('mongoose');
//mongoose.connect('mongodb://hoale:1@ds013738.mlab.com:013738/todos');
mongoose.connect('mongodb://localhost/todo');
console.log(mongoose.connection.readyState);
var TotoSchema = new mongoose.Schema({
    description: String,
    completed: Boolean,
    user:  mongoose.Schema.Types.ObjectId
});
module.exports = mongoose.model('Todo', TotoSchema);
