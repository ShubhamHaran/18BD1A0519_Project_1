var express=require("express");
var app=express();
const bodyParser = require("body-parser");
let middleware = require('./middleware');
const server=require('./server');


const MongoClient=require('mongodb').MongoClient;

const url='mongodb://localhost:27017';
const dbName='hospital';
const err="Error 404 not found...";
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
let db
MongoClient.connect(url,{
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },(err,client)=>{
if(err) return console.log(err);
db=client.db(dbName);
console.log(`Connected Database: ${url}`);
console.log(`Database: ${dbName}`);
});

//HOSPITALINFO
app.get('/hospitaldetails',middleware.checkToken,function(req,res){
console.log("Fetching data from Hospital Info Collection...");
db.collection('hospitalInfo',function(err,collection){
    collection.find().toArray(function(err,items){
if (err) throw err;
console.log(items);
res.send(items);
res.end();
});
});});

//VENTILATOR INFO
app.get('/ventilatordetails',middleware.checkToken,function(req,res){
console.log("Fetching data from ventilator Info Collection...");
db.collection('ventilatorInfo',function(err,collection){
collection.find().toArray(function(err,items){
if (err) throw err;
console.log(items);
res.send(items);
res.end();
    });
    });});

//FIND Hospital by name 
app.post('/hospitaldetails/gethosbyname',middleware.checkToken,function(req,res){
console.log("Finding hospital by name...");
db.collection('hospitalInfo',function(err,collection){
console.log(req.body.name);
var q={name:new RegExp(req.body.name,'i')};
collection.find(q).toArray(function(err,items){
if (err) throw err;
console.log(items);
res.send(items);
res.end();
    });
    });});
//FIND ventilator by status 
app.post('/ventilatordetails/getventbystatus',middleware.checkToken,function(req,res){
console.log("Finding ventilator by status...");
db.collection('ventilatorInfo',function(err,collection){
var q={status:new RegExp(req.body.status,'i')};
collection.find(q).toArray(function(err,items){
if (err) throw err;
console.log(items);
res.send(items);
res.end();
        });
        });});
//getventilatorbyhospitalname
app.post('/ventilatordetails/getventbyname',middleware.checkToken,function(req,res){
    console.log("Finding ventilator by name...");
    db.collection('ventilatorInfo',function(err,collection){
    var q={name:new RegExp(req.body.name,'i')};
    collection.find(q).toArray(function(err,items){
    if (err) throw err;
    console.log(items);
    res.send(items);
    res.end();
            });
            });});
//update ventilator details
app.put('/updatevent',middleware.checkToken,function(req,res){
console.log("Updating ventilator details...");
var v=req.body.vid;
var s=req.body.status;
var myquery = { vid: new RegExp(v,'i')};
var newvalues = { $set: {status:s} };
db.collection('ventilatorInfo',function(err,collection){
collection.updateOne(myquery, newvalues,function(err,items){
if (err) throw err;
console.log("1 ventilator updated...");
res.end("1 ventilator updated..") ;
res.end();
});
});});
//add ventilator details
app.post('/addvent',middleware.checkToken,function(req,res){
console.log("Adding ventilator details...");
var vid=req.body.vid;
var hid=req.body.hid;
var status=req.body.status;
var name=req.body.name;
var query={"vid":vid,"hid":hid,"status":status,"name":name};
db.collection('ventilatorInfo',function(err,collection){
collection.insertOne(query,function(err,items){
if (err) throw err;
console.log("1 ventilator added...");
res.end("1 ventilator added.."+items) ;
res.end();
    });
    });});
//delete ventilator by ventilator id
app.delete('/deletevent',middleware.checkToken,function(req,res){
console.log("Deleting ventilator details...");
var d=req.body.vid;
db.collection('ventilatorInfo',function(err,collection){
    var q={vid:new RegExp(d,'i')};
collection.deleteMany(q,function(err,items){
if (err) throw err;
console.log("1 ventilator deleted..");   
res.end("1 ventilator deleted.."+items) ;
res.end();
    });
});});
app.listen(8004);



