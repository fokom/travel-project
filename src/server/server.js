const dotenv = require('dotenv');
dotenv.config();

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fetch = require('node-fetch');
var path = require('path')

var projectData = {};

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Cors for cross origin access
app.use(cors());

// Initialize the main project folder
app.use(express.static('dist'));

// Get route /
app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})


// Post route for api data
app.post('/callAPI', async (req, res) => {

    const apiUrl = req.body.urlBase;
    console.log("API call to: ", apiUrl)
    
    const resp = await fetch(apiUrl)

    try{ //send API data to client 

        const data = await resp.json();
        res.send(data);
        console.log("DATA RETURNED: \n", data)

    }catch(err) {
        
        console.log("error: ", err);
    }
});

// test route
app.get('/test', function (req, res) {
    res.send({
        'title': 'test json response',
        'message': 'testing mockApi',
        'time': 'now'
    })
})

// Get data from /all route 
app.get('/getAll', (req, res) => {
    res.send(projectData);
});

module.exports = app