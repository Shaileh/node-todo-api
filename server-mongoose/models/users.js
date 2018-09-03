const mongoose = require('mongoose');


var user = mongoose.model('Users',new mongoose.Schema({
  email:{
      type: String,
      require: true,
      trim: true,
      minlength:1
    }}));

    module.exports = {user};
