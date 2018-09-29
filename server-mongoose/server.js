require('./config/config.js');
const _ = require('lodash');
const {mongoose} = require('./db/mongoose');
const {ObjectID} = require('mongodb');
const {todo} = require('./models/todos');
const {User} = require('./models/users');
const bodyParser = require('body-parser');
const express = require('express')
const port = process.env.PORT || 3000;
var app = express()


// parse application/json
app.use(bodyParser.json());

app.post('/todos',(req , res) => {
  // console.log(req.body);
  new todo (req.body).save().then((doc) => {
    res.send(doc);
    // console.log(`This doc: ${doc} is saved to db`);
  },(e) => {
    res.status(400).send(e);
    // console.log(`error ${e}`);
  });
});


app.get('/todos',(req , res) => {
  todo.find({}).then((query) => {
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
  todo.findById(id).then((todo) => {
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
  todo.findByIdAndDelete(id).then((todo) => {
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

  // todo.findByIdAndUpdate(id,{$set: body},{new:true}).then((updatedTodo) => {
  //   if(!updatedTodo){
  //     return res.status(404).send();
  //   }
  //   res.status(200).send(updatedTodo);
  // },(e) => {res.status(400).send(e)});

  todo.findOneAndUpdate({_id:id},{$set: body},{new:true}).then((updatedTodo) => {
    if(!updatedTodo){
      return res.status(404).send();
    }
    res.status(200).send(updatedTodo);
  },(e) => {res.status(400).send(e)});
});

app.post('/users',(req,res) => {
  var body = _.pick(req.body,['email','password']);
  var user = new User(body);
  // new user(req.body).save().then((doc) => {
  //   res.status(200).send({doc});
  // },(e) => {
  //   res.status(400).send(e);
  // });

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth',token).send({user});
  }).catch((e) => {
    res.status(400).send(e);
  });

});


app.listen(port, () => {
  console.log(`listen to port ${port}`);

});



module.exports = {app};
