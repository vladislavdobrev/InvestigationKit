var app = app || {};

app.currentInvestigation = app.currentInvestigation || null;

app.currentNote = app.currentNote || null;

(function(a) {
    var viewModel = kendo.observable({
        data: [],
        newNote: {
            text: ""
        }
    });
    
    function init(e) {
        if (app.currentNote) {
            app.currentNote = null;
        }
        getAll().then(function(results) {
            viewModel.set("data", results);
            kendo.bind(e.view.element, viewModel, kendo.mobile.ui);
        }, a.error);
    }
    
    function addNewNote(e) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var lat = position.coords.latitude;
            var long = position.coords.longitude;
            insertRecord(viewModel.newNote.text, lat, long);
        }, a.error, {
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
                viewModel.newNote.text = "";
            }, a.error);
        });
    };
        
    function getAll() {
        var promise = new RSVP.Promise(function(resolve, reject) {
            app.db.transaction(function(tx) {
                tx.executeSql("SELECT * FROM investigation_notes WHERE inv_id = ?", [app.currentInvestigation.id], function(x, y) {
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
        setById(e.target.context.id);
    };
    
    function setById(id) {
        app.db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM investigation_notes WHERE id = ?", [id], function(x, y) {
                app.currentNote = convertToModel(y.rows.item(0));
                a.application.navigate("views/google-maps-view.html#google-maps-view");
            }, a.error);
        });
    };
    
    function convertToModel(sqliteModel) {
        var newModel = new Note(sqliteModel.text, sqliteModel.created, sqliteModel.latitude, sqliteModel.longitude, sqliteModel.inv_id);
        newModel.id = sqliteModel.id;
        return newModel;
    };
    
    a.notes = {
        init: init,
        add: addNewNote,
        onTouch: onTouch
    };
}(app));