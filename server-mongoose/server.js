require('./config/config.js');
const _ = require('lodash');
const {mongoose} = require('./db/mongoose');
const {ObjectID} = require('mongodb');
const {Todo} = require('./models/todos');
const {User} = require('./models/users');
const {authenticate} = require('./middleware/authenticate');
const bodyParser = require('body-parser');
const express = require('express')
const bcrypt = require('bcryptjs');
const port = process.env.PORT || 3000;
var app = express()


// parse application/json
app.use(bodyParser.json());

app.post('/todos',authenticate, (req , res) => {
  var todo = new Todo ({
    text: req.body.text,
    _creator: req.user._id
  })
  todo.save().then((doc) => {
    res.send(doc);
    // console.log(`This doc: ${doc} is saved to db`);
  },(e) => {
    res.status(400).send(e);
    // console.log(`error ${e}`);
  });
});


app.get('/todos',authenticate, (req , res) => {
  Todo.find({
    _creator: req.user._id
  }).then((query) => {
    res.send({query});
  },(e) => {
    res.status(400).send(e);
    console.log(`error ${e}`);
  });
});

app.get('/todos/:id',(req , res) => {
  var {id} = req.params;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  Todo.findById(id).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
    res.send(todo);
  },(e) => {res.status(400).send(e)})
});


app.delete('/todos/:id',(req,res) => {
  var {id} = req.params;
  if(!ObjectID.isValid(id)){
    return res.status(404).send({error: "inValid ID"});
  }
  Todo.findByIdAndDelete(id).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
    res.status(200).send(todo);

  },(e) => {res.status(400).send()});


});

app.patch('/todos/:id',(req,res) => {
  var {id} = req.params; // the same as var id = req.params.id
  var body = _.pick(req.body,['text','completed']);//its take to paramters from the object to new object.

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  }else{
    // console.log(`the res is: ${_.isBoolean(body.completed)}, ${body.completed},the body.completed ${typeof body.completed}`);
    body.completed = false;
    body.completedAt = null;
  }

  // Todo.findByIdAndUpdate(id,{$set: body},{new:true}).then((updatedTodo) => {
  //   if(!updatedTodo){
  //     return res.status(404).send();
  //   }
  //   res.status(200).send(updatedTodo);
  // },(e) => {res.status(400).send(e)});

  Todo.findOneAndUpdate({_id:id},{$set: body},{new:true}).then((updatedTodo) => {
    if(!updatedTodo){
      return res.status(404).send();
    }
    res.status(200).send(updatedTodo);
  },(e) => {res.status(400).send(e)});
});

app.post('/users',(req,res) => {
  var body = _.pick(req.body,['email','password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth',token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  });


});


app.get('/users/me', authenticate ,(req,res) => {

  res.send(req.user);

});

app.post('/users/login', (req,res) => {
  // debugger;
  if(req.body.email && req.body.password){
    var body = _.pick(req.body,['email','password']);
  }
  else{
    return res.status(401).send({error:'missing fields'});
  }
  User.findByCredentials(body.email,body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth',token).send(user);
    });
  }).catch((e) =>{
    res.status(401).send(e);
  });
});

app.delete('/users/me/token',authenticate, (req,res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  },() => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`listen to port ${port}`);

});



module.exports = {app};
