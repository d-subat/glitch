
'use strict';

var fs = require('fs');
var express = require('express');
var cors = require('cors');
var app = express();
app.use(cors());
if (!process.env.DISABLE_XORIGIN) {
  app.use(function(req, res, next) {
    var allowedOrigins = ['https://bbx-whoami.glitch.com', 'https://www.freecodecamp.com'];
    var origin = req.headers.origin || '*';
    if(!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1){
         console.log(origin);
         res.setHeader('Access-Control-Allow-Origin', origin);
         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
    next();
  });
}

app.use('/public', express.static(process.cwd() + '/public'));

app.route('/_api/package.json')
  .get(function(req, res, next) {
    console.log('requested');
    fs.readFile(__dirname + '/package.json', function(err, data) {
      if(err) return next(err);
      res.type('txt').send(data.toString());
    });
  });
  
app.route('/')
    .get(function(req, res) {
		  res.sendFile(process.cwd() + '/views/index.html');
    })



//#### request header  api
app.get("/:request", function (req, res) {

var request = req.params.request;
  var useragent = req.headers['user-agent'];
  var useragent = useragent.match(/[(](.*?)[)]/g);
  var userip = req.headers['x-forwarded-for'].split(",");
  var userlang = req.headers['accept-language'].split(",");
  var userObj = {  ipaddress	:null,language	:null,software	:null};
  userObj.ipaddress = userip[0];
  userObj.language = userlang[0];
  userObj.software = useragent[0];
     var header ="test";
     
      res.send(userObj);
  
    });




// Respond not found to all the wrong routes
app.use(function(req, res, next){
  res.status(404);
  res.type('txt').send('Not found');
});



// Error Middleware
app.use(function(err, req, res, next) {
  if(err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }  
})

app.listen(process.env.PORT, function () {
  console.log('Node.js listening ...');
});

