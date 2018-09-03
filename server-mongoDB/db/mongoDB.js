const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017/TodoApp';

// Database Name
const dbName = 'TodoApp';


var promise = MongoClient.connect(url,{ useNewUrlParser: true });
// MongoClient.connect(url,{ useNewUrlParser: true }, function(err, client) {
//   assert.equal(null, err);
//   console.log("Connected successfully to server");
//
//
//  // var todo = function(text,completed){
//  //   this.text= text;
//  //   this.completed= false;
//  //   this.completedAt= undefined;
//  // };
//   const db = client.db(dbName);
//   // console.log(db);
//   // console.log(client);
//   module.exports = {
//     db,
//     client
//   };
// });
module.exports = {
  promise
}
