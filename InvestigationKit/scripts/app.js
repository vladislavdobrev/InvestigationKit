var app = app || {};

app.db = null;

(function() {
    document.addEventListener("deviceready", function() {
        app.application = new kendo.mobile.Application(document.body, { transition: "slide" });
        
        app.openDb = function() {
            if (window.sqlitePlugin !== undefined) {
                app.db = window.sqlitePlugin.openDatabase("Investigation Kit Database");
            }
            else {
                // For debugging in simulator fallback to native SQL Lite
                app.db = window.openDatabase("Investigation Kit Database", "1.0", "Investigation Kit", 200000);
            }
        }
        
        app.createTables = function() {
            app.db.transaction(function(tx) {
                tx.executeSql("CREATE TABLE IF NOT EXISTS investigation_titles (id INTEGER PRIMARY KEY ASC, title VARCHAR(100), created DATETIME)", []);
                tx.executeSql("CREATE TABLE IF NOT EXISTS investigation_notes (id INTEGER PRIMARY KEY ASC, text TEXT, created DATETIME, latitude DOUBLE, longitude DOUBLE)", []);
            });
        }
        
        app.insertRecordTitles = function(t) {
            app.db.transaction(function(tx) {
                var cDate = new Date();
                tx.executeSql("INSERT INTO investigation_titles (title, created) VALUES (?,?)", [t, cDate]);
            });
        }
        
        app.getAllTitles = function() {
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
        }
        
        app.insertRecordNotes = function(text, latitude, longitude) {
            app.db.transaction(function(tx) {
                var cDate = new Date();
                tx.executeSql("INSERT INTO investigation_notes (text, created, latitude, longitude) VALUES (?,?,?,?)", [text, cDate, latitude, longitude]);
            });
        }
        
        app.getAllNotes = function(){
            app.db.transaction(function(tx) {
                tx.executeSql("SELECT * FROM investigation_titles", [], function(x, y) {
                    var results = [];
                    for (var i = 0; i < y.rows.length; i++) {
                        results.push(y.rows.item(i));
                    }
                        
                    resolve(results);
                });
            });
        }

        (function init() {
            app.openDb();
            app.createTables();
        }());
    }, false);    
}());