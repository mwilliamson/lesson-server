var templates = require("./templates");

exports.create = create;

function create(course) {
    var indexTemplate = templates.template("index.html");
    
    function index() {
        return indexTemplate({title: "Lessons", lessons: course.lessons()});
    }
    
    var lessonTemplate = templates.template("lesson.html");
    
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
    
    return {
        index: index,
        lesson: lesson
    };
}
