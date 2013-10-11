var app = app || {};

(function(a) {
    var viewModel = kendo.observable({
        title: ""
    });
    
    function init(e) {
        kendo.bind(e.view.element, viewModel);       
    }
    
    function start() {
        insertRecord(viewModel.title);
        a.application.navigate("views/investigation-view.html#investigation-view");
    }
    
    function insertRecord(t) {
        app.db.transaction(function(tx) {
            var cDate = new Date();
            tx.executeSql("INSERT INTO investigation_titles (title, created) VALUES (?,?)", [t, cDate]);
        });
    };
    
    a.newInvestigation = {
        init: init,
        start: start
    };
}(app));