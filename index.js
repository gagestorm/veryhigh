var express = require('express'),base_url='http://heisenberg.ziraffe.in/';
var app = express(),
    exphbs  = require('express-handlebars');
var request = require('request');
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var util = require('util'),
    EventEmitter = require('events').EventEmitter;


app.engine('.hbs', exphbs({defaultLayout: 'main',extname:'.hbs'}));
app.set('view engine', '.hbs'); 
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

var mongoose = require('mongoose');
var db = mongoose.connection;
db.on('error',console.error);
db.once('open',function(){
    
});

function createSlag(to,tags){
    to = 'Open Letter to '+to +' -'+ tags;
    return to.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
}

mongoose.connect('mongodb://localhost/heisenberg');

var ideaSchema  = new mongoose.Schema({
      idea : String
    , updated: { type: Date, default: Date.now }
    , email : String
});

var Idea    = mongoose.model('Idea', ideaSchema);

//Adding a link 
//var link1 = new Link({
//  title: 'This is my first mobiew'
//, unique_str : 'm45782kdkafjdkladfikj334'
//, url : 'http://t.co'
//, description : 'this is '
//});
//
//link1.save(function(err, thor) {
//  if (err) return console.error(err);
//  console.dir(thor);
//});
//

//Founder.remove({},function(err,founders){ });
app.use("/public", express.static(__dirname + "/public"));

//Basic application getting loaded : The web interface.
app.get('/',function(req,res){
    res.render('home', { data : { base_url : base_url } } );     
});


app.post('/submit/idea',function(req,res){
    
    // Perform the form testing here...
    var newIdea = new Idea({
          idea   : req.body.idea
        , email  : req.body.email
    });

    newIdea.save(function(err,t) {
      if (err) return console.error(err);
      console.log('A new Idea has been posted');
      console.log(t);
      res.send({ success: true });
    });      

});

app.get('/list/list/idea',function(req,res){


    Idea.find({},null, {sort: { updated: -1}},function(err,data){
        if(err) return console.error(err);
        var listData = [];
        data.forEach( function(value , index ){
            listData.push(
                { 
                    idea: value.idea,
                    email: value.email,
                    updated: value.updated
                }
            );
        });
        res.render('list.hbs', { data: { listData : listData , base_url: base_url } } ); 
    });

});



http.listen(3000,function(){
    console.log('Listening on *:3000');
});