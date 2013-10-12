var app = app || {};

app.currentInvestigation = app.currentInvestigation || null;

(function(a) {
    var viewModel = kendo.observable(app.currentInvestigation);
    
    function init(e) {
        kendo.bind(e.view.element, viewModel);       
    }
    
    a.investigation = {
        init: init
    };
}(app));