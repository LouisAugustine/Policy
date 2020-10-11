var express = require('express');
var app = express();
var url = require("url");
var router = express.Router();
var bodyParser = require('body-parser'); 

app.use('/public', express.static('public'));
 
app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})

app.get('/db', function (req, res) {
   res.sendFile( __dirname + "/" + "db.html" );
})

var data = null;
// Load the AWS SDK for Node.js
var AWS = require("aws-sdk");
AWS.config.update({
   alias: "",
   region: "",
   endpoint: '',
   // accessKeyId default can be used while using the downloadable version of DynamoDB.
   accessKeyId: "",
   // secretAccessKey default can be used while using the downloadable version of DynamoDB.
   secretAccessKey: ""
});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient();
//DynamoDB table parameters
var params = {
   TableName: ''
};

// Get data of table from the DynamoDB through Post 
app.post('/tableList', function(req, res, next){
   // Call DynamoDB to retrieve the list of tables
   docClient.scan(params, function(err, data) {
      if (err) {
         //console.log("Error", err.code);
         console.log("Unable to query. Error:", JSON.stringify(err, undefined, 2));
      } else {
         console.log("Table names are ", data.Items);
         res.send(data.Items);
      }
   });
});

//The drop-down list selects the data after the start event and gets the data after the query from DynamoDB
app.post('/selectByCompanyName', function(req, res, next){
    var param = req.query || req.params;
    var CompanyName = null;
    if(param.CompanyName != null){
      CompanyName = param.CompanyName;
    }
    var params = {
       TableName: '',
       KeyConditionExpression: "CompanyName =:name",
       ExpressionAttributeValues: {
          ":name": CompanyName
       }
    };
    // Call DynamoDB to retrieve the list of tables
    docClient.query(params, function(err, data) {
       if (err) {
          //Print the error message in the background if there is an error in the query.
          console.log("Unable to query. Error:", JSON.stringify(err, undefined, 2));
       } else {
          res.send(data.Items);
       }
    });
});

 
var server = app.listen(8880, function () { 
var host = server.address().address
var port = server.address().port 
console.log("http://localhost:8880", host, port) 
})
