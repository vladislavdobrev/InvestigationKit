var app = app || {};

(function(a) {
    var viewModel = kendo.observable({
        data: [],
        itemClicked: itemClicked,
        deleteItem: deleteItem
    });
    
    function init(e) {
        a.getAllTitles()
        .then(function(results) {
            viewModel.set("data", results);
            kendo.bind(e.view.element, viewModel, kendo.mobile.ui);
        });
    }
    
    function deleteItem(e) {
        var item = e.button.closest("li");
        item.destroy();
    }
    
    function itemClicked(e) {
        a.application.navigate("views/investigation-view.html#investigation-view");
    }
    
    a.allInvestigation = {
        init: init          
    };
}(app));