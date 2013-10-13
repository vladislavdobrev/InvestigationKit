var app = app || {};

(function(a) {
    function init(e) {
        kendo.bind(e.view.element, null, kendo.mobile.ui);
    }
    
    function createInvestigation(e) {
        a.application.navigate("views/new-investigation-view.html#new-investigation-view");
    }
    
    function allInvestigations(e) {
        a.application.navigate("views/all-investigations-view.html#all-investigations-view");
    }
    
    a.home = {
        init: init,
        createInvestigation: createInvestigation,
        allInvestigations: allInvestigations
    };
}(app));