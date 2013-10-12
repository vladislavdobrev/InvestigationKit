var app = app || {};

app.currentInvestigation = app.currentInvestigation || null;

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
        }, function() {
        }, {
            enableHighAccuracy: true
        });
    }
    
    function insertRecord(text, latitude, longitude) {
        app.db.transaction(function(tx) {
            var cDate = new Date();
            tx.executeSql("INSERT INTO investigation_notes (text, created, latitude, longitude, inv_id) VALUES (?,?,?,?,?)", [text, cDate, latitude, longitude, app.currentInvestigation.id]);
            var note = new Note(text, cDate, latitude, longitude, app.currentInvestigation.id);
            tx.executeSql("SELECT MAX(id) as maxId FROM investigation_notes", [], function (x, y) {
                note.id = y.rows.item(0)["maxId"];
                viewModel.data.push(note);
            }, function(err){
                console.log(err);
            });
        });
    };
        
    function getAll() {
        var promise = new RSVP.Promise(function(resolve, reject) {
            app.db.transaction(function(tx) {
                tx.executeSql("SELECT * FROM investigation_notes", [], function(x, y) {
                    var results = [];
                    for (var i = 0; i < y.rows.length; i++) {
                        results.push(convertToModel(y.rows.item(i)));
                    }
                        
                    resolve(results);
                });
            });
        });
            
        return promise;
    };
    
    function convertToModel(sqliteModel){
        var newModel = new Note(sqliteModel.text, sqliteModel.created, sqliteModel.latitude, sqliteModel.longitude, sqliteModel.inv_id);
        newModel.id = sqliteModel.id;
        return newModel;
    };
    
    a.notes = {
        init: init,
        add: addNewNote
    };
}(app));