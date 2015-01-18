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
  res.render(config.mainFile, {
    doctitle:config.mainTitle,
    config: config
  });
});

//Now APIs

app.post('/ls', function(req, res){
  console.log(req.body.path);
  var fullPath = req.body.path;
  if(!fs.existsSync(fullPath)) {
    res.send(JSON.stringify({type:'error', error:'Non-existant Path'}));
    return; 
  }
  if(fs.statSync(fullPath).isDirectory()){
    //console.log("Yap, this is it!");
    fs.readdir(fullPath, function(a, dirs){
      //console.log(dirs);
      res.send(JSON.stringify({type:'dirs', list:dirs}));
    });
    return;
  }
  //It's a file and it rocks!
  res.send(JSON.stringify({type:'file', filename:fullPath}));
});

app.post('/cat', function(req, res){
  var fullPath = req.body.path;
  if(!fs.existsSync(fullPath)) {
    res.send("Whoops! The File Does not Exist! Or It's content is exact same ;)");
    return;
  }
  res.sendFile(fullPath, {"root":__dirname});
});
