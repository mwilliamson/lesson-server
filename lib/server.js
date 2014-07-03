var path = require("path");

var express = require("express");
var lessMiddleware = require("less-middleware");
var browserifyMiddleware = require('browserify-middleware');

var templates = require("./templates");
var responses = require("./responses");
var lessons = require("./lessons");

var app = express();

var courseModulePath = path.resolve(process.argv[2]);
var coursePromise = lessons.loadCourse(require(courseModulePath));

app.use(lessMiddleware(__dirname + '/../static'));
app.use(express.static(__dirname + "/../static"));
app.use("/js", browserifyMiddleware(__dirname + "/../browser", {
    transform: "brfs"
}));

app.get("/", function(request, response) {
    var body = templates.staticTemplate("index.html", {title: "Lessons"});
    return responses.html(response, body);
});

var lessonTemplate = templates.template("lesson.html");

app.get("/lesson/:id", function(request, response) {
    var id = request.params.id;
    coursePromise
        .then(function(course) {
            return course.findLessonById(id);
        })
        .then(function(result) {
            var lesson = result.lesson;
            responses.html(response, lessonTemplate({
                title: lesson.title,
                lesson: lesson,
                browserJavaScript: result.browserJavaScript,
                browserModuleName: result.browserModuleName
            }));
        });
});

var port = 8080;
app.listen(port);
console.log("Listening on port " + port);
