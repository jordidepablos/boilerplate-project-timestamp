// server.js
// where your node app starts
require('dotenv').config();

const fs = require('fs');
const http = require('http');
const https = require('https');
const privateKey = fs.readFileSync('certs/privkey.pem', 'utf8');
const certificate = fs.readFileSync('certs/cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// init project
const express = require('express');
const app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
const cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get('/api', (req, res, next) => {
  const aDate = new Date(Date.now());
  result = {
    unix: aDate.getTime(),
    utc: aDate.toUTCString()
  }
  res.json(result);
});

app.get('/api/:ts', (req, res, next) => {
  let ts = req.params.ts;
  let aDate;
  if (/\d{5,}/.test(ts))
    aDate = new Date(parseInt(ts));
  else {
    if (/UTC/ig.test(ts))
      aDate = new Date(ts);
    else
      aDate = new Date(Date.parse(ts + ' UTC'));
  }
  if (aDate.toString() === "Invalid Date")
    return next(new Error("Invalid Date"));
  result = {
    unix: aDate.getTime(),
    utc: aDate.toUTCString()
  }
  res.json(result);
});

// Error handler
app.use((err, req, res, next) => {
  console.log(err);
  res.json({ error: "Invalid Date" });
});

// listen for requests :)
/* 
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
*/

let httpsServer = https.createServer(credentials, app);
httpsServer.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + httpsServer.address().port);
});
