const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todos');
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
  tokens:[{
    access: 'auth',
    token: jwt.sign({_id:userTwoID, access: 'auth'},'abc123').toString()
  }]
}];


const todosForTest = [{
  _id : new ObjectID(),
  text: "test Text",
  _creator: userOneID
}, {
  _id : new ObjectID(),
  text: "test Text 2",
  _creator: userTwoID
}];

var populateTodos = (done) => {
  Todo.deleteMany({}).then(() => {
    Todo.insertMany(todosForTest).then((docs) => {
      done();
    });
  });
};

var populateUsers = (done) => {
  User.deleteMany({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne,userTwo]).then(() => done());
  })
};

module.exports = {populateTodos, todosForTest, users, populateUsers}
