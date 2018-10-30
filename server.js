// base declaration
const bodyParser = require('body-parser')
const port = 4000
const redis = require('redis')
const fs = require('fs')
const file = 'data.json'
const express = require('express')
const app = express()
//const _ = require('underscore')

// we will be parsing json
app.use(bodyParser.json())

// Redis Client
let client = redis.createClient()

client.on("error", function (err) {                                                 // Let us if there is something wrong with Redis
    console.log("Error " + err)
})

client.on('connect', function(){                                                    // Announce succesfull Redis connection
    console.log('Connected to Redis...')
})

// ----- POST /track part -----
app.post('/track', function (req, res){                                             // receive POST data
    postBody = req.body                                               
         if (postBody.count){                                                        // if there is "count" key
             client.incrby("count", + postBody.count )}                              // add its value to redis
    fs.readFile (file, 'utf-8', function readFileCallback(err,data){                // appending data by reading old file
        if (err) console.log(err)
    var obj=JSON.parse(data)
    obj.data.push (postBody)                                                        // adding new JSON data to old JSON data
    fs.writeFile(file, JSON.stringify(obj), 'utf-8', function(err){                 // and writing it back to file
        if (err) console.log(err)
        else res.status(200).end()
        })
    })
})

// ----- GET /count part -----
app.get('/count', function (req, res) {
    client.get ("count", function(err,reply){                                   // ask Redis for value of "count"
        if (!reply) res.sendStatus(404)                                         // if there is no "count" defined yet in Redis let user know
        else res.send(String(+reply))                                           // if there is return its value
    })
})

// ----- check if data file is present - if not create it and let us know
if (fs.existsSync(file)) {}
        else {
            console.log ('Datafile ' , file , ' is not present... creating it from scratch')
            fs.writeFileSync (file, `{"data": []}`,'utf-8')}

// ----- start app -----
app.listen(port, () => console.info('Application running on port ' + port))
