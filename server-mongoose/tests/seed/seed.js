const {ObjectID} = require('mongodb');
const {todo} = require('./../../models/todos');
const {User} = require('./../../models/users');
const jwt = require('jsonwebtoken');

const userOneID = new ObjectID();
const userTwoID = new ObjectID();

const users = [{
  _id: userOneID ,
  email: 'userOne@test.com' ,
  password: 'useronepassword',
  tokens:[{
    access: 'auth',
    token: jwt.sign({_id:userOneID, access: 'auth'},'abc123').toString()
  }]
},{
  _id: userTwoID ,
  email: 'userTwo@test.com' ,
  password: 'usertwopassword',
}];


const todosForTest = [{
  _id : new ObjectID(),
  text: "test Text"
}, {
  id : new ObjectID(),
  text: "test Text 2"
}];

var populateTodos = (done) => {
  todo.remove({}).then(() => {
    todo.insertMany(todosForTest).then((docs) => {
      done();
    });
  });
};

var populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne,userTwo]).then(() => done());
  })
};

module.exports = {populateTodos, todosForTest, users, populateUsers}
