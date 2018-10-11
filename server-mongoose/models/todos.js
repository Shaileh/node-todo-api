const mongoose = require('mongoose');

var Todo = mongoose.model('Todo',new mongoose.Schema({
  text: {
    type: String,
    required: true,
    minlength:1
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: 0
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
}));

module.exports = {Todo};
