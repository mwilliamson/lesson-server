var browserify = require("browserify");

exports.load = load;

var lessons = {
    "4": __dirname + "/../examples/addition.js"
};

function load(id, callback) {
    var lessonModulePath = lessons[id];
    var lesson = require(lessonModulePath);
    
    // TODO: generate random valid module name
    var browserModuleName = "browserModule";
    // TODO: pre-compile lessons
    var browserifyInstance = browserify([lesson.browserModule]);
    browserifyInstance.bundle({standalone: browserModuleName}, function(error, browserJavaScript) {
        callback(null, {
            lesson: lesson,
            browserJavaScript: browserJavaScript,
            browserModuleName: browserModuleName
        });
    });
}
