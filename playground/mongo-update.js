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
  //findOneAndUpdate
  //for mongoDB operator list: https://docs.mongodb.com/manual/reference/operator/
  //http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#findOneAndUpdate
  //findOneAndUpdate(filter, update, options, callback) => {Promise}
  // db.collection('Todos').findOneAndUpdate({_id: new ObjectID('5b8573d6369f44291d44d1ff')},{$set: {complete: true}},{returnOriginal: false}).then((res) => {
  //   console.log(JSON.stringify(res,undefined,2));
  // }, (error) => {
  //   console.log(error);
  // });
  //challenge
  db.collection('Users').findOneAndUpdate({_id: new ObjectID('5b8437f03abfd076ff31c453')},{$set: {name: 'lili'},
    $inc: {age:1}},{returnOriginal: false}).then((res) => {
    console.log(JSON.stringify(res,undefined,2));
  }, (error) => {
    console.log(error);
  });

  client.close();


});
