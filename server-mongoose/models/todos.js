const mongoose = require('mongoose');

var todo = mongoose.model('Todo',new mongoose.Schema({
  text: {
    type: String,
    require: true,
    minlength:1
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: 0
  }
}));

module.exports = {todo};
