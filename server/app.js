var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

//ROUTES
var router = require('./modules/index.js');
var messageRouter = require('./modules/messageRouter.js');
var adminRouter = require('./modules/adminRouter.js');

var db = require('./modules/db');
var router = require('./modules/index.js');

// Models
var Message = require('./models/messages.js');


//BODYPARSER
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



app.use('/message', messageRouter);
app.use('/admin', adminRouter);
app.use('/', router);


app.set("port",(process.env.PORT || 3000));
app.listen(app.get("port"),function(){
  console.log("Listening on port: ", app.get("port"));
});

module.exports = app;
