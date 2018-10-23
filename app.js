// base declaration
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 4000;
const redis = require('redis');
const fs = require('fs');
const file = 'data.json';

// Redis Client
let client = redis.createClient();

client.on('connect', function(){
  console.log('Connected to Redis...');
});

app.use(bodyParser.json({ extended: false }));

// /track POST route
app.post('/track', (request, response) => {
    postBody = request.body;                                                    // receive POST data
    if ( postBody.count ){                                                      // if there is "count" key
      client.incrby("count", + postBody.count )};                               // add its value from to redis
    fs.readFile (file, 'utf-8', function readFileCallback(err,data){            // appending data by reading old file
    if (err) console.log(err);
    var obj=JSON.parse(data);
    obj.data.push (postBody);                                                   // adding new JSON data to old JSON data
    fs.writeFile(file, JSON.stringify(obj), 'utf-8', function(err){             // and writing it back to file
        if (err) console.log(err);
        else response.status(200).end();
        });
    });
});

// /count GET route
app.get('/count', (request, response) => {
 client.get ("count", function(err,reply){
   if(!reply){response.status(404).send('There is no count yet...').end()};     // if there is no "count" defined in Redis let user know
   else {response.status(200).send(+reply)};
  });
});

app.listen(port, () => console.info('Application running on port ' + port));
