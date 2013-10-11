var app = app || {};

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
                tx.executeSql("SELECT * FROM investigation_titles", [], function(x, y) {
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
    
    a.allInvestigation = {
        init: init          
    };
}(app));