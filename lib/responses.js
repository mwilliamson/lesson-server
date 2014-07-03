exports.html = html;

function html(response, body) {
    response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    response.end(body);
}
