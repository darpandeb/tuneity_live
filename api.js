var express = require('express');
var app = express();
var dotenv = require('dotenv');
var mongo = require('mongodb')
var MongoClient=mongo.MongoClient;
dotenv.config()
var mongourl = 'mongodb://testuser:userpass@cluster0-shard-00-00.tu5oi.mongodb.net:27017,cluster0-shard-00-01.tu5oi.mongodb.net:27017,cluster0-shard-00-02.tu5oi.mongodb.net:27017/edureka?ssl=true&replicaSet=atlas-86s3em-shard-0&authSource=admin&retryWrites=true&w=majority';
var port = process.env.PORT || 3001;
var db;
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.send("Welcome to the Tuneity Api");
})

// Get a genre by name //
app.get('/genre/:gname', function(req,res){
    db.collection('genre').find({"category": req.params.gname}).toArray(function(err,result){
        if(err) throw err;
        res.send(result)
    })
})
// get songs wrt genre // 
app.get('/songlist/:gname', function(req,res){
    db.collection('songs').find({"genre": req.params.gname}).toArray(function(err,result){
        if(err) throw err;
        res.send(result)
    })
})

// get song details by id//
app.get('/songdetails/:songid', function(req,res){
    db.collection('songs').find({"id": req.params.songid}).toArray(function(err,result){
        if(err) throw err;
        res.send(result)
    })
})
// get songs in genre sorted by year (latest ones first) //
app.get('/latestfirst/:genreid', function(req,res){
    var sort={"year":-1}
    db.collection('songs').find({"category_id": Number(req.params.genreid)}).sort(sort).toArray(function(err,result){
        if(err) throw err;
        res.send(result)

  })
})
// get songs in genre sorted by year (oldest ones first)
app.get('/oldestfirst/:genreid', function(req,res){
    var sort={"year":1}
    db.collection('songs').find({"category_id": Number(req.params.genreid)}).sort(sort).toArray(function(err,result){
        if(err) throw err;
        res.send(result)

  })
})
// query params //
// songs wrt to artist
app.get('/artistsong',(req,res) => {
    var query = {};
    if(req.query.artist){
        query={"artist.art_id":Number(req.query.artist)}
    }
    db.collection('songs').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})



// post method practise // --------> working
/*app.post('/postany', function(req,res){
    console.log(req.body)
    db.collection('order').insert(req.body,function(err,result){
        if(err) throw err
        res.send("order placed")
        
    })
    console.log(req.body)
})*/


// connection code//
MongoClient.connect(mongourl,function(err,client) {
    if(err) console.log("Unable to connect");
    db=client.db('edureka')
    app.listen(port, function(){
        console.log(`Connected to port ${port}`)
    })
})
