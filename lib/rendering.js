var templates = require("./templates");

exports.create = create;

function create(course, options) {
    var baseUrl = options.baseUrl;
    var isStatic = options.isStatic;
    
    var indexTemplate = template("index.html");
    
    function index() {
        return indexTemplate({title: "Lessons", lessons: course.lessons()});
    }
    
    var lessonTemplate = template("lesson.html");
    
    function lesson(id) {
        var result = course.findLessonById(id);
        var lesson = result.lesson;
        return lessonTemplate({
            title: lesson.title,
            lesson: lesson,
            browserJavaScript: result.browserJavaScript,
            browserModuleName: result.browserModuleName
        });
    }
    
    function template(name) {
        var underlyingTemplate = templates.template(name);
        return function(context) {
            var contextWithUrl = Object.create(context);
            contextWithUrl.__baseUrl = baseUrl;
            contextWithUrl.__isStatic = isStatic;
            return underlyingTemplate(contextWithUrl);
        };
    }
    
    return {
        index: index,
        lesson: lesson
    };
}
