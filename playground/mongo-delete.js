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
  // deleteMany
  // db.collection('Users').deleteMany({name:'shai'}).then((res) => {
  //   console.log(JSON.stringify(res,undefined,2));
  // }, (error) => {
  //
  // });
  //deleteOne
  // db.collection('Users').deleteOne({name:'shai'}).then((res) => {
  //   console.log(JSON.stringify(res,undefined,2));
  // }, (error) => {
  //
  // });
  //findOneAndDelete
  db.collection('Users').findOneAndDelete({_id: new ObjectID('5b8437b43abfd076ff31c44a')}).then((res) => {
    console.log(JSON.stringify(res,undefined,2));
  }, (error) => {

  });
  client.close();


});
