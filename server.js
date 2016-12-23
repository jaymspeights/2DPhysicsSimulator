'use strict';
var express = require("express");
var app = express();

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/Physics.js", function(req, res) {
  res.sendFile(__dirname + "/Physics.js");
});

console.log("Listening...")
app.listen(80);
