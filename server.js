/**
 * Created by hoale on 3/13/2016.
 */

var express = require('express');
var app = express();
var _ = require('underscore');
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 3000;
var td = require('./models/todo');
var todoNextId = 1;


var Todo = require('./models/todo');
app.use(bodyParser.json());

app.get('/todos', function (req, res) {
    var queryParams = req.query;
    var filteredTodos = [];
    Todo.find({}, function(err, result){
       if(err){
           return res.status(500).send();
       }
        else{
           filteredTodos = result;
           console.log(filteredTodos);
           if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
               filteredTodos = _.where(filteredTodos, {completed: true})
           }
           else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
               filteredTodos = _.where(filteredTodos, {completed: false})
           }

           if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
               filteredTodos = _.filter(filteredTodos, function (todo) {
                   return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
               });
           }
           console.log(filteredTodos);
           console.log(filteredTodos.length);
           var data ={
               data: filteredTodos,
               count:filteredTodos.length
           }
           res.json(data);
       }
    });


});

app.get('/todos/:id', function (req, res) {
    var todoId = req.params.id;
    console.log(todoId);
    Todo.findById(todoId, function(err, result){
       if(err){
           res.status(404).send();
       }
        else{
           res.json(result);
       }
    });

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
    console.log(body);
    Todo.create({
        description: body.description,
        completed: body.completed
    }, function (err, todo) {
        if (err) {
            return res.status(500).send();
        }
        else {
            return res.json(todo);
        }
    });


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

    var body = _.pick(req.body, 'description', 'completed');
    var attributes = {};
    var todoId = parseInt(req.params.id, 10);

    if (body.hasOwnProperty('completed')) {
        attributes.completed = body.completed;
    }
    else if (body.hasOwnProperty('completed')) {
        return res.status(400).send();
    }

    if (body.hasOwnProperty('description')) {
        attributes.description = body.description;
    }
});

app.listen(PORT, function () {
    console.log('Express is running on ' + PORT);
});