//MONGO
var mongoose = require("mongoose");
var mongoURI =
  // process.env.MONGOLAB_URI ||
  // process.env.MONGOHQ_URL ||
  'mongodb://localhost/mango_grove' ||
  'mongodb://admin:MangoGrove@ds013212.mlab.com:13212/heroku_btq31zn7';

mongoose.connect(mongoURI);

var MongoDB = mongoose.connection;

MongoDB.on("error", function(err){
    console.log("Mongo Connection Error: ", err);
});

MongoDB.once("open", function(err){
    console.log("Mongo Connection Open on: ", mongoURI);
});

module.exports = MongoDB;
