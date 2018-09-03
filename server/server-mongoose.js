const mongoose = require('mongoose');

// Connection URL
const url = 'mongodb://localhost:27017/TodoApp';

// Database Name
const dbName = 'TodoApp';

mongoose.Promise = global.Promise;
mongoose.connect(url);
//https://mongoosejs.com/docs/guide.html
//https://mongoosejs.com/docs/schematypes.html
var Todo = mongoose.model('Todo',new mongoose.Schema({
  text:String,
  completed: Boolean,
  completedAt: Number
}));

var newTodo = new Todo({text: 'Cook diner'});

newTodo.save().then((doc) => {
  console.log(doc);
},(e) => {
  console.log(e);
});

var otherTodo = new Todo({text: 'learn nodejs',completed:false,completedAt:123}).save().then((doc) => {
  console.log(doc);
},(e) =>{
  console.log(e);
});

//https://mongoosejs.com/docs/validation.html
var user = mongoose.model('Users',new mongoose.Schema({
  email:{
      type: String,
      require: true,
      trim: true,
      minlength:1
    }}));

new user({email:'      sdfhk@shdkjf.com  '}).save().then((doc) => {
  console.log(JSON.stringify(doc,undefined,2));
}, (e) => {
  console.log(e);
});
