var browserify = require("browserify");

exports.loadCourse = loadCourse;

function loadCourse(course) {
    
    var lessons = course.lessons;
    
    function load(id, callback) {
        var lessonModulePath = lessons[id];
        var lesson = require(lessonModulePath);
        
        var browserModuleName = "module" + lesson.uid.replace(/-/g, "");
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
    
    return {
        findLessonById: load
    };
}
