var fs = require("fs");
var path = require("path");

var lessons = require("./lessons");
var rendering = require("./rendering");

var courseModulePath = path.resolve(process.argv[2]);
var coursePromise = lessons.loadCourse(require(courseModulePath));

var outputDirectory = process.argv[3];

if (!outputDirectory) {
    throw new Error("Expected output directory");
}

if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory);
}

lessons.loadCourse(require(courseModulePath)).then(function(course) {
    var renderer = rendering.create(course);
    
    writeOutput("index.html", renderer.index());
    course.lessons().forEach(function(lesson) {
        writeOutput(lesson.id + ".html", renderer.lesson(lesson.id));
    });
});

function writeOutput(relativePath, content) {
    fs.writeFile(path.join(outputDirectory, relativePath), content, "utf8");
}
