var mongoose = require('mongoose');
mongoose.connect('mongodb://hle50:1@ds013579.mlab.com:13579/todo');
//mongoose.connect('mongodb://localhost/todo');
console.log(mongoose.connection.readyState);
var TotoSchema = new mongoose.Schema({
    description: String,
    completed: Boolean
});
module.exports = mongoose.model('Todo', TotoSchema);
