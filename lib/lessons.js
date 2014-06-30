exports.load = load;

var lessons = {
    "4": __dirname + "/../examples/addition.js"
};

function load(id) {
    var lessonModulePath = lessons[id];
    return require(lessonModulePath);
}
