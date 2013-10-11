var app = app || {};

(function(a) {
    var viewModel = kendo.observable({
        data: [],
        itemClicked: itemClicked
    });
    
    function init(e) {
        a.getAllTitles()
        .then(function(results) {
            viewModel.set("data", results);
        });
        kendo.bind(e.view.element, viewModel);
    }
    
    function itemClicked(e) {
        a.application.navigate("views/investigation-view.html#investigation-view");
    }
    
    a.allInvestigation = {
        init: init          
    };
}(app));