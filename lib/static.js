var fs = require("fs");
var path = require("path");

var walk = require("walk");
var mkdirp = require("mkdirp");

var lessons = require("./lessons");
var rendering = require("./rendering");

var courseModulePath = path.resolve(process.argv[2]);
var coursePromise = lessons.loadCourse(require(courseModulePath));

var outputDirectory = process.argv[3];

if (!outputDirectory) {
    throw new Error("Expected output directory");
}

lessons.loadCourse(require(courseModulePath)).then(function(course) {
    var renderer = rendering.create(course);
    
    writeOutput("index.html", renderer.index());
    course.lessons().forEach(function(lesson) {
        writeOutput(lesson.id + ".html", renderer.lesson(lesson.id));
    });
});

var staticDirectory = __dirname + "/../static";
var staticWalker = walk.walk(staticDirectory);
staticWalker.on("file", function(root, fileStats, next) {
    var sourcePath = path.join(root, fileStats.name);
    var relativePath = path.relative(staticDirectory, sourcePath);
    fs.readFile(sourcePath, function(error, content) {
        writeOutput(relativePath, content);
        next();
    });
});

function writeOutput(relativePath, content) {
    var outputPath = path.join(outputDirectory, relativePath);
    mkdirp(path.dirname(outputPath), function() {
        fs.writeFile(outputPath, content, "utf8");
    });
}
