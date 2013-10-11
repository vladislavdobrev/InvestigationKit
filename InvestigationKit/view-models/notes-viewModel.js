var app = app || {};

(function(a) {
    var viewModel = kendo.observable({
        data: [],
        newNote: {
            text: ""
        }
    });
    
    function init(e) {
        getAll().then(function(results) {
            viewModel.set("data", results);
            kendo.bind(e.view.element, viewModel, kendo.mobile.ui);
        });
    }
    
    function addNewNote(e) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var lat = position.coords.latitude;
            var long = position.coords.longitude;
            insertRecord(viewModel.newNote.text, lat, long);
            init(e);
        }, function() {
        }, {
            enableHighAccuracy: true
        });
    }
    
    function insertRecord(text, latitude, longitude) {
        app.db.transaction(function(tx) {
            var cDate = new Date();
            tx.executeSql("INSERT INTO investigation_notes (text, created, latitude, longitude) VALUES (?,?,?,?)", [text, cDate, latitude, longitude]);
        });
    };
        
    function getAll() {
        var promise = new RSVP.Promise(function(resolve, reject) {
            app.db.transaction(function(tx) {
                tx.executeSql("SELECT * FROM investigation_notes", [], function(x, y) {
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
    
    a.notes = {
        init: init,
        add: addNewNote
    };
}(app));