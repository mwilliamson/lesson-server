var browserify = require("browserify");

var promises = require("./promises");

exports.loadCourse = loadCourse;

function loadCourse(course) {
    var lessons = course.lessons;
    var compiledLessons = {};
    for (var id in lessons) {
        if (Object.prototype.hasOwnProperty.call(lessons, id)) {
            compiledLessons[id] = compileLesson(id);
        }
    }
    
    function findLessonById(id) {
        return compiledLessons[id];
    }

    function compileLesson(id) {
        var lessonModulePath = lessons[id];
        var lesson = require(lessonModulePath);
        
        var browserModuleName = "module" + lesson.uid.replace(/-/g, "");
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
        findLessonById: findLessonById
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
