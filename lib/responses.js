var nunjucks = require("nunjucks");

exports.staticTemplate = staticTemplate;


nunjucks.configure(__dirname + "/../templates", {
    autoescape: true
});

function staticTemplate(name) {
    var body = nunjucks.render(name);
    return function(request, response) {
        response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
        response.end(body);
    };
}
