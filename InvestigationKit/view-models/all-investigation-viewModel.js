var app = app || {};

app.currentInvestigation = app.currentInvestigation || null;

(function(a) {
    var viewModel = kendo.observable({
        data: []
    });
    
    function init(e) {
        getAll().then(function(results) {
            viewModel.set("data", results);
            kendo.bind(e.view.element, viewModel, kendo.mobile.ui);
        });
    }

    function getAll() {
        var promise = new RSVP.Promise(function(resolve, reject) {
            app.db.transaction(function(tx) {
                tx.executeSql("SELECT * FROM investigations", [], function(x, y) {
                    var results = [];
                    for (var i = 0; i < y.rows.length; i++) {
                        results.push(y.rows.item(i));
                    }
                        
                    resolve(results);
                });
            });
        });
            
        return promise;
    };
    
    function onTouch(e) {
        setById(e.target.context.id);
    };
    
    function setById(id) {
        app.db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM investigations WHERE id = ?", [id], function(x, y) {
                app.currentInvestigation = y.rows.item(0);
                a.application.navigate("views/investigation-view.html#investigation-view");
            });
        });
    };
    
    a.allInvestigation = {
        init: init,
        onTouch: onTouch
    };
}(app));