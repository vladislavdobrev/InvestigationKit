var app = app || {};

(function(a) {
    var viewModel = kendo.observable({
        data: [],
        selectedInvestigation: null,
        change: onInvestigationChanged
    });
    
    function init(e) {
        investigationDataSource.fetch(function () {
            var data = this.data();
            viewModel.set("data", data);
        });
        
        kendo.bind(e.view.element, viewModel);       
    }
    
    function onInvestigationChanged(e) {
        var id = parseInt(e.sender._selectedValue);
        viewModel.set("selectedInvestigation", viewModel.model[id - 1]);
    }
    
    a.investigation = {
        init: init          
    };
}(app));