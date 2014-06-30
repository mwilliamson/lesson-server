var fs = require("fs");

module.exports = {
    uid: "a242dcab-aa22-4464-a83a-f4bda1b19767",
    title: "Addition",
    lessonHtml: fs.readFileSync(__dirname + "/addition.html"),
    browserModule: __dirname + "/addition-browser.js"
};
