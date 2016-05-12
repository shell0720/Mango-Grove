var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var BlockedUsers = new Schema ({
  list : {type: Array, default: []}
});


module.exports = mongoose.model("BlockedUsers", BlockedUsers);
