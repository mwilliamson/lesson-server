var _ = require("underscore");
var browserify = require("browserify");

var promises = require("./promises");

exports.loadCourse = loadCourse;

function loadCourse(course) {
    var lessons = course.lessons;
    var compiledLessons = _.indexBy(course.lessons.map(compileLesson), "id");
    
    function findLessonById(id) {
        return compiledLessons[id].result;
    }

    function compileLesson(lessonModulePath) {
        var lesson = require(lessonModulePath);
        
        var browserModuleName = "module" + lesson.uid.replace(/-/g, "");
        var compiledLesson = generateBundle(browserModuleName, lesson.browserModule)
            .then(function(browserJavaScript) {
                return {
                    lesson: lesson,
                    browserJavaScript: browserJavaScript,
                    browserModuleName: browserModuleName
                };
            });
        return {id: lesson.id, result: compiledLesson};
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
