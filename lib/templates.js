var nunjucks = require("nunjucks");

exports.staticTemplate = staticTemplate;
exports.template = template;


nunjucks.configure(__dirname + "/../templates", {
    autoescape: true
});

function staticTemplate(name, context) {
    return nunjucks.render(name, context);
}

function template(name) {
    return function(context) {
        return nunjucks.render(name, context);
    };
}
