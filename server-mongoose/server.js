const _ = require('lodash');
const {mongoose} = require('./db/mongoose');
const {ObjectID} = require('mongodb');
const {todo} = require('./models/todos');
const {user} = require('./models/users');
const bodyParser = require('body-parser');
const express = require('express')
const port = process.env.PORT || 3000;
var app = express()


// parse application/json
app.use(bodyParser.json());

app.post('/todos',(req , res) => {
  console.log(req.body);
  new todo (req.body).save().then((doc) => {
    res.send(doc);
    console.log(`This doc: ${doc} is saved to db`);
  },(e) => {
    res.status(400).send(e);
    console.log(`error ${e}`);
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

  todo.findByIdAndUpdate(id,{$set: body},{new:true}).then((updatedTodo) => {
    if(!updatedTodo){
      return res.status(404).send();
    }
    res.status(200).send(updatedTodo);
  },(e) => {res.status(400).send()});
});
app.listen(port, () => {
  console.log(`listen to port ${port}`);

});



module.exports = {app};
