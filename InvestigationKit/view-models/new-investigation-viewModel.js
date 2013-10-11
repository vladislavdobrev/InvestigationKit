var app = app || {};

(function(a) {
    var viewModel = kendo.observable({
        placeholder: "Title",
        title: ""
    });
    
    function init(e) {
        kendo.bind(e.view.element, viewModel);       
    }
    
    function start() {
        a.insertRecord(viewModel.title);
        a.application.navigate("views/investigation-view.html#investigation-view");
    }
    
    a.newInvestigation = {
        init: init,
        start: start
    };
}(app));