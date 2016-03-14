/**
 * Created by hoale on 3/13/2016.
 */

var express = require('express');
var app = express();
var _ = require('underscore');
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
    var matchTodo = _.findWhere(todos, {id: todoId});

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
    var body = _.pick(req.body, 'description', 'completed');
    if (!_.isBoolean(body.completed) || !_.isString(body.description) || !body.description.trim().length) {
        return res.status(400).send();
    }
    body.description = body.description.trim();
    body.id = todoNextId++;
    todos.push(body);
    res.json(body);
});

app.delete('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    console.log(todoId);
    var matchTodo = _.findWhere(todos, {id: todoId});
    if (!matchTodo) {
        return res.status(404).json({"error": "item not existed"});
    }
    todos = _.without(todos, matchTodo);
    res.json(matchTodo);


});

app.put('/todos/:id', function (req, res) {
    console.log('put put');
    var body = _.pick(req.body, 'description', 'completed');
    var validAttributes = {};
    var todoId = parseInt(req.params.id, 10);
    console.log(todoId);
    var matchTodo = _.findWhere(todos, {id: todoId});
    if (!matchTodo) {
        return res.status(404).send();
    }
    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed;
    }
    else if (body.hasOwnProperty('completed')) {
        return res.status(400).send();
    }

    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length) {
        validAttributes.description = body.description;
    }
    else if (body.hasOwnProperty('description')) {
        return res.status(400).send();
    }

    _.extend(matchTodo, validAttributes);
    res.json(matchTodo);
});

app.listen(PORT, function () {
    console.log('Express is running on ' + PORT);
});