var express = require("express");

var responses = require("./responses");

var app = express();

var port = 8080;

app.get("/", responses.staticTemplate("index.html"));
app.use(express.static(__dirname + "/../static"));

app.listen(port);
console.log("Listening on port " + port);
