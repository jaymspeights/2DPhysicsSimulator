'use strict';
var express = require("express");
var app = express();

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/*.js", function(req, res) {
  res.sendFile(__dirname + req.url);
});

app.get("/*.css", function(req, res) {
  res.sendFile(__dirname + req.url);
});

app.get("/world*", function(req, res) {
  res.sendFile(__dirname + "/Worlds" + req.url + ".json");
});

console.log("Listening...")
app.listen(80);
