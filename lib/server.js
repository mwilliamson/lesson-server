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

var indexTemplate = templates.template("index.html");
app.get("/", function(request, response) {
    coursePromise.then(function(course) {
        var body = indexTemplate({title: "Lessons", lessons: course.lessons()});
        return responses.html(response, body);
    });
});

var lessonTemplate = templates.template("lesson.html");

app.get("/lesson/:id", function(request, response) {
    var id = request.params.id;
    coursePromise
        .then(function(course) {
            var result = course.findLessonById(id);
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
