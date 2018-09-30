var {User} = require('./../models/users')

var authenticate = function (req,res,next){
  var token = req.header('x-auth');

  User.findByToken(token).then((user) => {
    if(!user){
       res.status(404).send();
    }
    // res.status(200).send(user);
    req.user = user;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).send();
  });

};

module.exports = {authenticate};
