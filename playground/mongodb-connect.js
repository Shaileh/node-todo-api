const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017/TodoApp';

// Database Name
const dbName = 'TodoApp';

// Use connect method to connect to the server
// MongoClient.connect(url, function(err, client) {
//   assert.equal(null, err);
//   console.log("Connected successfully to server");
//
//   const db = client.db(dbName);
//
//   db.collection(dbName).insertOne({text: "text todo",
//     completed: false},(error,res) => {
//       if(error){
//         return console.log("unable to wirte to db",error);
//       }
//       console.log(JSON.stringify(res.ops,undefined,2));
//     });
//
//   client.close();
//
// });

MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  db.collection("Users").insertOne({name: "shai",
    age: 25,
    location: "israel"},(error,res) => {
      if(error){
        return console.log("unable to wirte to db",error);
      }
      console.log(JSON.stringify(res.ops,undefined,2));
    });

  client.close();

});
