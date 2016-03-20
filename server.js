/**
 * Created by hoale on 3/13/2016.
 */

var express = require('express');
var app = express();
var _ = require('underscore');
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 3000;
var todoNextId = 1;
var logger = require('./logger/logger');
var Todo = require('./models/todo');
var encrypt = require('./utils/encryptPassword');
logger.debug("Overriding 'Express' logger");
var mongoose = require('mongoose');
var User = require('./models/user');
var middleware = require('./middleware')(User);
app.use(require('morgan')({"stream": logger.stream}));
app.use(bodyParser.json());


app.get('/todos', middleware.requireAuthentication, function (req, res) {
    var queryParams = req.query;
    var filteredTodos = [];
    Todo.find({user: req.user._id}, function (err, result) {
        if (err) {
            return res.status(500).send();
        }
        else {
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
            var data = {
                data: filteredTodos,
                count: filteredTodos.length
            }
            res.json(data);
        }
    });


});

app.get('/todos/:id', middleware.requireAuthentication, function (req, res) {
    var todoId = req.params.id;
    console.log(todoId);
    Todo.findById(todoId, function (err, result) {

        if (err) {
            res.status(401).send();
        }
        else {
            res.json(result);
        }
    });

});

app.get('/', function (req, res) {
    res.send('TO DO API');
});

app.post('/todos', middleware.requireAuthentication, function (req, res) {
    var body = _.pick(req.body, 'description', 'completed');
    if (!_.isBoolean(body.completed) || !_.isString(body.description) || !body.description.trim().length) {
        return res.status(400).send();
    }

    body.description = body.description.trim();
    console.log(body);

    Todo.create({
        description: body.description,
        completed: body.completed,
        user:mongoose.mongo.ObjectId(req.user._id)
    }, function (err, todo) {
        if (err) {
            return res.status(500).send();
        }
        else {
            return res.json(todo);
        }
    });


});

app.delete('/todos/:id', middleware.requireAuthentication, function (req, res) {
    Todo.findById(req.params.id, function (err, todo) {
        if (err) {
            return res.status(400).send();
        }
        else {

            todo.remove(function (err) {
                if (err) {
                    return res.status(500).send();
                }
                else {
                    res.json({'message': 'item was removed'})
                }
            })

        }
    });


});

app.put('/todos/:id', middleware.requireAuthentication, function (req, res) {

    console.log(req.params.id);
    var body = _.pick(req.body, 'description', 'completed');
    console.log(body);
    var attributes = {};
    //req.params.id

    if (body.hasOwnProperty('completed')) {
        attributes.completed = body.completed;
    }
    else if (body.hasOwnProperty('completed')) {
        return res.status(400).send();
    }

    if (body.hasOwnProperty('description')) {
        attributes.description = body.description;
    }

    Todo.findById(req.params.id, function (err, todo) {
        if (err) {
            return res.status(400).send();
        }
        else {
            console.log(todo);
            todo.description = attributes.description;
            todo.completed = attributes.completed;

            todo.save(function (err) {
                if (err) {
                    return res.status(500).send();
                }
                else {
                    res.json(todo);
                }
            })

        }
    });
});

/**
 * create user
 */
app.post('/user', function (req, res) {
    var body = _.pick(req.body, 'email', 'password');
    if (!_.isString(body.email) || !body.email.trim().length || !_.isString(body.password) || !body.password.trim().length) {
        return res.status(400).send();
    }

    console.log(body);
    User.create({
        email: body.email,
        password: encrypt(body.password)
    }, function (err, user) {
        if (err) {
            return res.status(400).json(err);
        }
        else {

            return res.json(_.pick(user, '_id', 'email', 'dateCreated'));
        }
    });


});

app.post('/user/login', function (req, res) {
    var body = _.pick(req.body, 'email', 'password');
    var User = mongoose.model('User', User);
    var user = new User();
    user.authenticate(body).then(function (u) {

        res.header('Auth', user.generateToken('authentication', _.pick(u, '_id')._id)).json(_.pick(u, '_id', 'email', 'dateCreated'));
    }, function (err) {
        res.status(401).send();
    });
});


app.listen(PORT, function () {
    console.log('Express is running on ' + PORT);
});