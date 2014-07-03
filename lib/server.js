var path = require("path");

var express = require("express");
var lessMiddleware = require("less-middleware");
var browserifyMiddleware = require('browserify-middleware');

var responses = require("./responses");
var lessons = require("./lessons");

var app = express();

var courseModulePath = path.resolve(process.argv[2]);
var course = lessons.loadCourse(require(courseModulePath));

app.use(lessMiddleware(__dirname + '/../static'));
app.use(express.static(__dirname + "/../static"));
app.use("/js", browserifyMiddleware(__dirname + "/../browser", {
    transform: "brfs"
}));

app.get("/", responses.staticTemplate("index.html", {title: "Lessons"}));

var lessonTemplateResponse = responses.template("lesson.html");
app.get("/lesson/:id", function(request, response) {
    var id = request.params.id;
    course.findLessonById(id, function(error, result) {
        var lesson = result.lesson;
        lessonTemplateResponse(request, response, {
            title: lesson.title,
            lesson: lesson,
            browserJavaScript: result.browserJavaScript,
            browserModuleName: result.browserModuleName
        });
    });
});

var port = 8080;
app.listen(port);
console.log("Listening on port " + port);
