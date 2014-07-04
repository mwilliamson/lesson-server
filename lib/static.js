var fs = require("fs");
var path = require("path");

var walk = require("walk");
var mkdirp = require("mkdirp");
var less = require("less");
var browserify = require("browserify");

var lessons = require("./lessons");
var rendering = require("./rendering");

var courseModulePath = path.resolve(process.argv[2]);
var coursePromise = lessons.loadCourse(require(courseModulePath));

var outputDirectory = process.argv[3];

if (!outputDirectory) {
    throw new Error("Expected output directory");
}

lessons.loadCourse(require(courseModulePath)).then(function(course) {
    function writePage(relativePath, name, args) {
        var depth = relativePath.split("/").length - 1;
        var renderer = rendering.create(course, {
            baseUrl: repeat("../", depth),
            isStatic: true
        });
        writeOutput(relativePath, renderer[name].apply(renderer, args || []));
    }
    
    writePage("index.html", "index");
    course.lessons().forEach(function(lesson) {
        writePage("lesson/" + lesson.id + ".html", "lesson", [lesson.id]);
    });
});

function repeat(str, times) {
    return new Array(times + 1).join(str);
}

var staticDirectory = __dirname + "/../static";
var staticWalker = walk.walk(staticDirectory);
staticWalker.on("file", function(root, fileStats, next) {
    var sourcePath = path.join(root, fileStats.name);
    var relativePath = path.relative(staticDirectory, sourcePath);
    fs.readFile(sourcePath, "utf8", function(error, content) {
        if (/\.css$/.test(fileStats.name)) {
            // Skip CSS files
        } else if (/\.less$/.test(fileStats.name)) {
            less.render(content, function(error, cssOutput) {
                var cssPath = relativePath.replace(/\.less$/, ".css");
                writeOutput(cssPath, cssOutput);
            });
        } else {
            writeOutput(relativePath, content);
        }
        
        next();
    });
});

var browserJsDirectory = __dirname + "/../browser";
var browserJsWalker = walk.walk(browserJsDirectory);
browserJsWalker.on("file", function(root, fileStats, next) {
    var sourcePath = path.join(root, fileStats.name);
    var relativePath = "js/" + path.relative(browserJsDirectory, sourcePath);
    var browserifyInstance = browserify([sourcePath]);
    browserifyInstance.transform("brfs");
    browserifyInstance.bundle(function(error, output) {
        writeOutput(relativePath, output);
    });
});

function writeOutput(relativePath, content) {
    var outputPath = path.join(outputDirectory, relativePath);
    mkdirp(path.dirname(outputPath), function() {
        fs.writeFile(outputPath, content, "utf8");
    });
}
