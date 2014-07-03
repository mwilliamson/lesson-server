var browserify = require("browserify");

var promises = require("./promises");

exports.loadCourse = loadCourse;

function loadCourse(course) {
    
    var lessons = course.lessons;
    
    function load(id, callback) {
        var lessonModulePath = lessons[id];
        var lesson = require(lessonModulePath);
        
        var browserModuleName = "module" + lesson.uid.replace(/-/g, "");
        // TODO: pre-compile lessons
        return generateBundle(browserModuleName, lesson.browserModule)
            .then(function(browserJavaScript) {
                return {
                    lesson: lesson,
                    browserJavaScript: browserJavaScript,
                    browserModuleName: browserModuleName
                };
            });
    }
    
    return promises.resolve({
        findLessonById: load
    });
}

function generateBundle(moduleName, module) {
    var deferred = promises.defer();
    var browserifyInstance = browserify([module]);
    browserifyInstance.bundle({standalone: moduleName}, function(error, browserJavaScript) {
        if (error) {
            deferred.reject(error);
        } else {
            deferred.resolve(browserJavaScript);
        }
    });
    return deferred.promise;
}
