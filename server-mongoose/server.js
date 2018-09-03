const {mongoose} = require('./db/mongoose.js');
const {todo} = require('./models/todos.js');
const {user} = require('./models/users.js');
const bodyParser = require('body-parser');
const express = require('express')
var app = express()


// parse application/json
app.use(bodyParser.json());

app.post('/saveTodo',(req , res) => {
  console.log(req.body);
  new todo (req.body).save().then((doc) => {
    res.send(doc);
    console.log(`This doc: ${doc} is saved to db`);
  },(e) => {
    res.status(400).send(e);
    console.log(`error ${e}`);
  });
});




app.listen(3000, () => {
  console.log('listen to port 3000');

})

module.exports = {app};
