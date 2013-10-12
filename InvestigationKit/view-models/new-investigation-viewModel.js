var app = app || {};

app.currentInvestigation = app.currentInvestigation || null;

app.currentNote = app.currentNote || null;

(function(a) {
    var viewModel = kendo.observable({
        title: ""
    });
    
    function init(e) {
        if (app.currentInvestigation) {
            app.currentInvestigation = null;
        }
        kendo.bind(e.view.element, viewModel);       
    }
    
    function start() {
        insertRecord(viewModel.title);
        a.application.navigate("views/investigation-view.html#investigation-view");
    }
    
    function insertRecord(t) {
        app.db.transaction(function(tx) {
            var cDate = new Date();
            tx.executeSql("INSERT INTO investigations (title, created) VALUES (?,?)", [t, cDate]);
            app.currentInvestigation = new Investigation(t, cDate);
            tx.executeSql("SELECT MAX(id) as maxId FROM investigations", [], function (x, y) {
                app.currentInvestigation.id = y.rows.item(0)["maxId"];
            });
        });
    };
    
    a.newInvestigation = {
        init: init,
        start: start
    };
}(app));