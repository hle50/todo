/**
 * Created by hoale on 3/13/2016.
 */

var express = require('express');
var app = express();
var _ = require('lodash');
var PORT = process.env.PORT || 3000;

var todos = [
    {
        id: 1,
        description: 'Meeting with client',
        complete: true
    },
    {
        id: 2,
        description: 'Go to bank',
        complete: true
    },
    {
        id: 3,
        description: 'Go to the zoo',
        complete: false
    }
];

app.get('/todos', function (req, res) {
    res.json(todos);
});
app.get('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    console.log(todoId);
    var matchTodo = _.find(todos,{id: todoId});

    if (matchTodo) {
        res.json(matchTodo);
    }
    else {
        res.status(404).send();
    }

});

app.get('/', function (req, res) {
    res.send('TO DO API');
});

app.listen(PORT, function () {
    console.log('Express is running on ' + PORT);
});