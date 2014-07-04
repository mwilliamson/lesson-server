var util = require("util");

var nunjucks = require("nunjucks");

exports.staticTemplate = staticTemplate;
exports.template = template;


var environment = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(__dirname + "/../templates"),
    {
        autoescape: true
    }
);
environment.addExtension("StaticUrlExtension", new UrlExtension("static_url", ""));
environment.addExtension("PageUrlExtension", new UrlExtension("page_url", ".html"));

function staticTemplate(name, context) {
    return environment.render(name, context);
}

function template(name) {
    return function(context) {
        return environment.render(name, context);
    };
}

function UrlExtension(tagName, extension) {
    this.tags = [tagName];

    this.parse = function(parser, nodes, lexer) {
        var tok = parser.nextToken();
        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        return new nodes.CallExtension(this, 'run', args);
    };

    this.run = function(context) {
        var formatArgs = Array.prototype.slice.call(arguments, 1);
        var relativeUrl = util.format.apply(util, formatArgs);
        var url = context.ctx.__baseUrl + relativeUrl;
        if (context.ctx.__isStatic) {
            return url + extension;
        } else {
            return url;
        }
        
    };
}
