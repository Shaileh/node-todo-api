// const mongoose = require('mongoose');
const {mongoose} = require('./../db/mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash')


var UserSchema = new mongoose.Schema({
  email:{
      type: String,
      require: true,
      trim: true,
      minlength:1,
      unique: true,
      // validate: (value) => { //use Promise function to validate email (async).
      //   return new Promise((resolve , reject) => {
      //        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      //       if(re.test(String(value).toLowerCase())){
      //         resolve(true);
      //       }else{
      //         reject(false);
      //       }
      //   });
      // }
      validate: (value) => validator.isEmail(value)
    },
  password:{
    type: String,
    require: true,
    minlength:6
  },
  tokens:[{
    access:{
      type: String,
      require: true
    },
    token:{
      type: String,
      require: true
    }
  }]
});

UserSchema.methods.generateAuthToken = function (){
  var user = this;
  var access = 'auth';
  var token  = jwt.sign({_id:user._id.toHexString(), access },'abc123').toString();

  user.tokens = user.tokens.concat({access,token});

  return user.save().then(() => {
    return token;
  });

};
UserSchema.methods.toJSON = function(){
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject,['_id','email']);
};


var User = mongoose.model('Users',UserSchema);

module.exports = {User};
