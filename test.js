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


// index.html
//app.get('/', (request, response) =>  response.sendFile(`${__dirname}/index.html`));

// /track POST route
app.post('/track', (request, response) => {
    postBody =request.body;
    console.log (postBody);
        if ( postBody.count ){
        client.incrby("count", + postBody.count )}; // add count from json to redis 
    fs.readFile (file, 'utf-8', function readFileCallback(err,data){
        if (err) console.log(err);
    var obj=JSON.parse(data);
    obj.data.push (postBody);
    fs.writeFile(file, JSON.stringify(obj), 'utf-8', function(err){
        if (err) console.log(err);
        else response.status(200).end();
        });               
    });
});

// /count GET route
app.get('/count', (request, response) => {
 client.get ("count", function(err,reply){
            if(!reply){             // if no "count" in Redis
                response.status(404).send('NotFound').end();
                console.log('There is no count yet...');
            }
            else {
                response.status(200).send(+reply);
                console.log('Count is ' + reply);
            }
        });
});        


app.listen(port, () => console.info('Application running on port ' + port));