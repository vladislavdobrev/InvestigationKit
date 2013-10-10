var app = app || {};

(function() {
    document.addEventListener("deviceready", function() {
        app.application = new kendo.mobile.Application(document.body, { transition: "slide" });
    }, false);    
}());