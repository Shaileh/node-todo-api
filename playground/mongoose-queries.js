const {user} = require ('./../server-mongoose/models/users');
// const {mongoose} = require('./../db/mongoose');


var id = '5b8aa53cd31d361e4533a179'

user.findById(id).then((user)=>{
  if(!user){
    return console.log(`user not found`);
  }
  console.log(`this is the user you asked for ${user}`);
}).catch((e) => {
  console.log(e);
});
