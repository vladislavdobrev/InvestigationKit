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
        }, a.error);
    }

    function getAll() {
        var promise = new RSVP.Promise(function(resolve, reject) {
            app.db.transaction(function(tx) {
                tx.executeSql("SELECT * FROM investigations", [], function(x, y) {
                    var results = [];
                    for (var i = 0; i < y.rows.length; i++) {
                        results.push(convertToModel(y.rows.item(i)));
                    }
                        
                    resolve(results);
                }, function(error) {
                    reject(error);
                });
            });
        });
            
        return promise;
    };
    
    function onTouch(e) {
        setById(e.touch.currentTarget.id);
    };
    
    function setById(id) {
        app.db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM investigations WHERE id = ?", [id], function(x, y) {
                app.currentInvestigation = convertToModel(y.rows.item(0));
                a.application.navigate("views/investigation-view.html#investigation-view");
            }, a.error);
        });
    };
    
    function convertToModel(sqliteModel) {
        var normalDate = new Date(sqliteModel.created);
        var newModel = new Investigation(sqliteModel.title, dateToDMY(normalDate));
        newModel.id = sqliteModel.id;
        return newModel;
    };
    
    function dateToDMY(date) {
        var d = date.getDate();
        var m = date.getMonth() + 1;
        var y = date.getFullYear();
        var h = date.getHours();
        var min = date.getMinutes();
        var s = date.getSeconds();
        return '' + (d <= 9 ? '0' + d : d) + '-' + (m <= 9 ? '0' + m : m) + '-' + y + " " + (h <= 9? '0' + h : h) + ":" + (min <= 9 ? '0' + min : min) + ":" + (s <= 9 ? '0' + s : s);
    }
    
    a.allInvestigation = {
        init: init,
        onTouch: onTouch
    };
}(app));