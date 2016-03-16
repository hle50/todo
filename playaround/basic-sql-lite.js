var Sequelize = require('Sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/basic-sql-lite.sqlite'
});

var Todo = sequelize.define('todo',
    {
        description: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                len: [1, 250]
            }
        },
        completed: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });

sequelize.sync().then(function () {
    console.log('Everything is synced');
    Todo.create({
        description: 'go to the zoo',
    }).then(function (todo) {
        console.log('Finished');
        console.log('Todo');
    }).then(function () {
        return Todo.findById(1);
    }).then(function (todo) {
            if (todo) {
                console.log(todo.toJSON());
            }
            else {
                console.log('no todo found');
            }
        })
        .catch(function (e) {
            console.log(e)
        });
});