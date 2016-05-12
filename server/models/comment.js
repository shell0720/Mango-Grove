var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//set up the comment info details for data embed purpose
var Comment = new Schema ({
  messageID: {type: String, required: true},
  name : {type: String, required: true},
  email : {type : String, required: true},
  content : {type: String, required: true},
  flag : {type: Number, required: false},
  like : {type: Number, required: false},
  date_created: {type: Date, default : Date.now}
});

module.exports = mongoose.model("Comment", Comment);
