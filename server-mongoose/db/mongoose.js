const mongoose = require('mongoose');

// Connection URL
const url = process.env.MONGODB_URI;


mongoose.Promise = global.Promise;
// mongoose.connect(url, {autoIndex: false, useNewUrlParser: true});
mongoose.connect(url, {useNewUrlParser: true});


module.exports = {
  mongoose
};
