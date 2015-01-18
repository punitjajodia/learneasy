var config = require('./config.js');

var fs = require('fs');
var bodyParser = require('body-parser')
var express = require('express');
var hbs = require('hbs');
var app = express();

app.listen(config.port);

//App.Use's 
app.use(express.static(config.frontendFolder));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended:true
}));
 
//View Engine 
app.set('view engine', config.viewEngineExt);
app.engine('html', hbs.__express);



//Main Thing
app.get('/', function (req, res) {
  //res.sendFile(config.mainFile)
  //console.log("Whaat!");
  console.log(config.mainFile);
  res.render(config.mainFile, {doctitle:config.mainTitle});
});

//Now APIs

//POST: /ls
//Request Params:
//  1. Path
app.post('/ls', function(req, res){
    var fullPath = "./" + config.contentsPath + "/" + req.body.path;
    fs.readdir(fullPath, function(a, dirs){
      res.send(JSON.stringify(dirs));
    });

});

//POST: /cat
// This reponds with the File contents if
//  1. Requested path is a file
//  2. The File type is in 'showable' list <-- TODO
// But responds with the Directory Details if
//  1. Requested path is a directory
// But, If it does not exist, It responds with an error message. 
app.post('/cat', function(req, res){
  var fullPath = "./"  + config.contentsPath + "/" + req.body.path;
  if(fs.statSync(fullPath).isDirectory()){
    res.send("{error:\"This is a directory\"}");
    return;
  }
  if(!fs.existsSync(fullPath)) {
    res.send("{error:\"Non-existant Path\"}");
    return; 
  }
  //It's a file and it rocks!
  res.sendFile(fullPath);
});

