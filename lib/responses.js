var nunjucks = require("nunjucks");

exports.staticTemplate = staticTemplate;
exports.template = template;


nunjucks.configure(__dirname + "/../templates", {
    autoescape: true
});

function staticTemplate(name, context) {
    var body = nunjucks.render(name, context);
    return function(request, response) {
        writeHtml(response, body);
    };
}

function template(name) {
    return function(request, response, context) {
        var body = nunjucks.render(name, context);
        writeHtml(response, body);
    };
}

function writeHtml(response, html) {
    response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    response.end(html);
}
