const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017/TodoApp';

// Database Name
const dbName = 'TodoApp';


MongoClient.connect(url,{ useNewUrlParser: true }, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");


 var todo = function(text,completed){
   this.text= text;
   this.completed= false;
   this.completedAt= undefined;
 };
  const db = client.db(dbName);
  db.createCollection('TodoApp' ,{
      validator: {
        //https://docs.mongodb.com/manual/reference/operator/query/jsonSchema/#op._S_jsonSchema
        $jsonSchema: {
           bsonType: "object",
           required: [ "text", "completed", "completedAt"],
           minProperties: 4,
           maxProperties: 4,
           properties: {
              text: {
                 bsonType: "string",
                 description: "must be a string and is required"
              },
              completed: {
                 bsonType: "bool",
                 description: "must be a boolean and is required"
              },
              // completedAt: {
              //    bsonType: "timestamp",
              //    description: "must be a timestamp and is required"
              // }
           }
        }
     }
   }).then((collection)=>{
    console.log('good');
    console.log(`we try to insert ${JSON.stringify(new todo('walk the dog'),undefined,2)}`);
      collection.insertOne(new todo('walk the dog'),(error,res) => {
          if(error){
            return console.log("unable to wirte to db",error);
          }
          console.log(JSON.stringify(res.ops,undefined,2));
        });
      client.close();
  },(error)=>{
    console.log('bad',error);
  });




});
