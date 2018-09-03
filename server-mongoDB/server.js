
const mongoDBpromise = require('./db/mongoDB.js').promise;
mongoDBpromise.then((client) => {
  console.log('sdfsdf');
  client.close();
})
