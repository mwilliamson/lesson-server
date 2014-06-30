var questionsWidget = require("./questions");

var lessonContainers = document.querySelectorAll("*[data-lesson-module]");
Array.prototype.forEach.call(lessonContainers,  function(lessonContainer) {
    var module = window[lessonContainer.getAttribute("data-lesson-module")];
    
    var contentElement = lessonContainer.getElementsByClassName("content-container")[0];
    module.init(contentElement);
    
    var questionsElement = lessonContainer.getElementsByClassName("questions-container")[0];
    questionsWidget(questionsElement, {generateQuestion: module.generateQuestion});
});
