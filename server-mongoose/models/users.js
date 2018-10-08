const mongoose = require('mongoose');
// const {mongoose} = require('./../db/mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash')
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email:{
      type: String,
      require: true,
      trim: true,
      minlength:1,
      unique: true,
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
// var UserSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//     trim: true,
//     minlength: 1,
//     unique: true,
//     validate: {
//       validator: validator.isEmail,
//       message: '{VALUE} is not a valid email'
//     }
//   },
//   password: {
//     type: String,
//     require: true,
//     minlength: 6
//   },
//   tokens: [{
//     access: {
//       type: String,
//       required: true
//     },
//     token: {
//       type: String,
//       required: true
//     }
//   }]
// });

UserSchema.methods.generateAuthToken = function (){
  var user = this;
  var access = 'auth';
  var token  = jwt.sign({_id:user._id.toHexString(), access },'abc123').toString();

  // user.tokens = user.tokens.concat({access,token});
  user.tokens.push({access, token});

  return user.save().then(() => {
    return token;
  });

};
UserSchema.methods.toJSON = function(){
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject,['_id','email']);
};

UserSchema.statics.findByCredentials = function (email, password){
  var User = this;
  return User.findOne({email}).then((user) =>{
    if(!user){
      return Promise.reject();
    }

    return bcrypt.compare(password,user.password).then((val) =>{// check the password with promise
      return Promise.resolve(user);
    },(e) => {return Promise.reject(e)});

    // return new Promise ((resolve,reject) => {
    //   bcrypt.compare(password,user.password,(err,res) => {//check the password with callback function.
    //     if(err){
    //       reject();
    //     }
    //     if(res){
    //       resolve(user);
    //     }
    //   });
    // });
  });
}

UserSchema.statics.findByToken = function (token){
  var User = this;
  var decoded;

  try{
    decoded = jwt.verify(token,'abc123');
  }catch(e){
    // return new Promise ((resolve,reject) => {
    //   reject({});
    // });
    return Promise.reject({});
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.pre('save', function(next){
  var user = this;

  if(user.isModified('password')){
    bcrypt.hash(user.password, 10).then((hash) => {
      user.password = hash;
      next();
    },(e) => {
      console.log('cant hash passord');
    });
  }else{
    next();
  }
});

var User = mongoose.model('User',UserSchema);

module.exports = {User};
