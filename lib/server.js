var express = require("express");

var responses = require("./responses");
var lessons = require("./lessons");

var app = express();

app.use(express.static(__dirname + "/../static"));

app.get("/", responses.staticTemplate("index.html", {title: "Lessons"}));

var lessonTemplateResponse = responses.template("lesson.html");
app.get("/lesson/:id", function(request, response) {
    var id = request.params.id;
    var lesson = lessons.load(id);
    
    lessonTemplateResponse(request, response, {
        title: lesson.title,
        lesson: lesson
    });
});

var port = 8080;
app.listen(port);
console.log("Listening on port " + port);
