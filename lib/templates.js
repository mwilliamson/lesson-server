var nunjucks = require("nunjucks");

exports.staticTemplate = staticTemplate;
exports.template = template;


var environment = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(__dirname + "/../templates"),
    {
        autoescape: true
    }
);
environment.addExtension("StaticUrlExtension", new StaticUrlExtension());

function staticTemplate(name, context) {
    return environment.render(name, context);
}

function template(name) {
    return function(context) {
        return environment.render(name, context);
    };
}

function StaticUrlExtension() {
    this.tags = ["static_url"];

    this.parse = function(parser, nodes, lexer) {
        var tok = parser.nextToken();
        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        return new nodes.CallExtension(this, 'run', args);
    };

    this.run = function(context, url) {
        return "/" + url;
    };
}
