var express = require('express');
var app = express();
var url = require("url");
var router = express.Router();
var bodyParser = require('body-parser'); 

app.use('/public', express.static('public'));
 

app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})

var data = null;
// Load the AWS SDK for Node.js
var AWS = require("aws-sdk");
AWS.config.update({
   //alias: "Louis_Augustine",
   region: "us-east-1",
   endpoint: 'https://dynamodb.us-east-1.amazonaws.com',
   // accessKeyId default can be used while using the downloadable version of DynamoDB.
   accessKeyId: "",
   // secretAccessKey default can be used while using the downloadable version of DynamoDB.
   secretAccessKey: ""
});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient();
//DynamoDB table parameters
var params = {
   TableName: 'PolicyDocmentsInfo'
};

// Get data of table from the DynamoDB through Post 
app.post('/tableList', function(req, res, next){
   // Call DynamoDB to retrieve the list of tables
   docClient.scan(params, function(err, data) {
      if (err) {
         //console.log("Error", err.code);
         console.log("Unable to query. Error:", JSON.stringify(err, undefined, 2));
      } else {
         //console.log("Table names are ", data.TableNames);
         var ss = JSON.stringify(data.Items, undefined, 2);
         //Replace all the account name to account_name, policy number to policy_number
         ss = changeNames(ss);
         console.log("after replace ss:",ss);
         data.Items = JSON.parse(ss, undefined, 2);
         res.send(data);
      }
   });
});

//The drop-down list selects the data after the start event and gets the data after the query from DynamoDB
app.post('/selectByAccountName', function(req, res, next){
    var param = req.query || req.params;
    var documentName = 1;
    if(param.documentName != null){
       documentName = param.documentName;
    }
    var params = {
       TableName: 'PolicyDocmentsInfo',
       KeyConditionExpression: "document_name =:name",
       ExpressionAttributeValues: {
          ":name": documentName
       }
    };
    // Call DynamoDB to retrieve the list of tables
    docClient.query(params, function(err, data) {
       if (err) {
          //Print the error message in the background if there is an error in the query.
          console.log("Unable to query. Error:", JSON.stringify(err, undefined, 2));
       } else {
          var ss = JSON.stringify(data.Items, undefined, 2);
          //Replace all the account name to account_name, policy number to policy_number
          ss = changeNames(ss);
          console.log("after replace ss:",ss);
          data.Items = JSON.parse(ss, undefined, 2);
          res.send(data);
       }
    });
});

//The header keywords are processed
function changeNames(name){
   var resultName = "";
   //Replace all the account name to account_name, policy number to policy_number
   resultName = name.toString().replace(/account name/g,"account_name");
   resultName = resultName.toString().replace(/policy number/g,"policy_number");
   return resultName;
}
 
var server = app.listen(8880, function () { 
var host = server.address().address
var port = server.address().port 
console.log("http://localhost:8880", host, port) 
})
