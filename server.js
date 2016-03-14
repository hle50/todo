/**
 * Created by hoale on 3/13/2016.
 */

var express = require('express');
var app = express();
var _ = require('lodash');
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 3000;

var todoNextId = 1;
var todos = [];

app.use(bodyParser.json());

app.get('/todos', function (req, res) {
    res.json(todos);
});

app.get('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    console.log(todoId);
    var matchTodo = _.find(todos, {id: todoId});

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

app.post('/todos', function (req, res) {
    var body = req.body;
    console.log('description', body.description);
    body.id = todoNextId++;
    todos.push(body);
    res.json(body);
});

app.listen(PORT, function () {
    console.log('Express is running on ' + PORT);
});