var _ = require("underscore");
var browserify = require("browserify");

var promises = require("./promises");

exports.loadCourse = loadCourse;

function loadCourse(course) {
    var lessons = course.lessons;
    return promises.all(course.lessons.map(compileLesson)).then(function(compiledLessons) {
        var lessonLookup = _.indexBy(compiledLessons, function(result) {
            return result.lesson.id;
        });
        
        function lessons() {
            return _.pluck(compiledLessons, "lesson");
        }
        
        function findLessonById(id) {
            return lessonLookup[id];
        }
        
        return {
            findLessonById: findLessonById,
            lessons: lessons
        };
    });
}

function compileLesson(lessonModulePath) {
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
