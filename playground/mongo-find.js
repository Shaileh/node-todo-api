const {MongoClient , ObjectID} = require('mongodb');
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017/TodoApp';

// Database Name
const dbName = 'TodoApp';
MongoClient.connect('mongodb://localhost:27017/TodoApp',(error, client) => {
  assert.equal(null, error);

  console.log("Connected successfully to server");

  const db = client.db('TodoApp');
  // console.log(db.collection('Todos').find({name:'shai'}));
  db.collection('Todos').find({name:'shai'}).toArray().then((db) => {
    console.log(JSON.stringify(db,undefined,2));
  }, (error) => {

  });
  client.close();


});
