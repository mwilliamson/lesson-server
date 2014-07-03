var path = require("path");

var express = require("express");
var lessMiddleware = require("less-middleware");
var browserifyMiddleware = require('browserify-middleware');

var rendering = require("./rendering");
var responses = require("./responses");
var lessons = require("./lessons");

var app = express();

var courseModulePath = path.resolve(process.argv[2]);
var coursePromise = lessons.loadCourse(require(courseModulePath));
var rendererPromise = coursePromise.then(rendering.create);

app.use(lessMiddleware(__dirname + '/../static'));
app.use(express.static(__dirname + "/../static"));
app.use("/js", browserifyMiddleware(__dirname + "/../browser", {
    transform: "brfs"
}));


app.get("/", function(request, response) {
    rendererPromise.then(function(renderer) {
        var body = renderer.index();
        return responses.html(response, body);
    });
});

app.get("/lesson/:id", function(request, response) {
    rendererPromise.then(function(renderer) {
        var body = renderer.lesson(request.params.id);
        return responses.html(response, body);
    });
});

var port = 8080;
app.listen(port);
console.log("Listening on port " + port);
