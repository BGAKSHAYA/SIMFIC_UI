var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
const request = require('request');

var cors = require("cors");

app.use(cors());

// configuration =================

mongoose.connect("<<Insert MONGO_DB_URL here>>",{ useNewUrlParser: true, useUnifiedTopology: true});     // connect to mongoDB database on modulus.io

app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

var schema = new mongoose.Schema({
    rank: Number,
    browser: String,
    os :String,
    query: String,
    resultBookClicked : String,
    os_version: String,
    sessionTime: String,
    systemName: String
}, {collection:'Fiction'});

const path = require('path');

var FictionModel = mongoose.model('Fiction', schema, "UserTracking");
// Create link to Angular build directory

app.use(express.static('./dist/fictionUI'));

app.get('fiction/', (req, res) => {
    request('http://localhost:8080/fiction/search?bookID=' + req.query.bookID + '&language=' + req.query.language,
        (error, response, body) => {
          if (error || response.statusCode !== 200) {
            return res.send(error);
          }
          res.send(body);
        }
      )
})

app.get('/*', function(req,res) {
    if(req.url === '/') {
      res.sendFile(path.join(__dirname,'/dist/fictionUI/index.html'));
    }
    else if(req.url.includes('fiction/search')) {
    request('<<Insert backend URL>>?bookID=' + req.query.bookID + '&language=' + req.query.language + '&systemName=' +req.query.systemName,
        (error, response, body) => {
          if (error || response.statusCode !== 200) {
            return res.send(error);
          }
          res.send(body);
        }
      )
    }
    else{
      res.sendFile(path.join(__dirname, '/dist/fictionUI' + req.url))
    }  
});


const port = process.env.PORT || 4500;


app.post('*',function(request,response){
    var book1 = new FictionModel(request.body);
    book1.save(function (err, book1) {
        if (err) return console.error(err);
        console.log(book1 , " saved to bookstore collection.");
    response.send('')
  })
})

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
  });

app.listen(port ,function(){
    console.log("Started on PORT ", port);
})
