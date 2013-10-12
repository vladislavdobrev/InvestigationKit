var app = app || {};

app.db = null;

app.currentInvestigation = app.currentInvestigation || null;

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
        };
        
        app.createTables = function() {
            app.db.transaction(function(tx) {
                tx.executeSql("CREATE TABLE IF NOT EXISTS investigations (id INTEGER PRIMARY KEY ASC, title VARCHAR(100), created DATETIME)", []);
                tx.executeSql("CREATE TABLE IF NOT EXISTS investigation_notes (id INTEGER PRIMARY KEY ASC, text TEXT, created DATETIME, latitude DOUBLE, longitude DOUBLE, inv_id INTEGER)", []);
            });
        };

        (function init() {
            app.openDb();
            app.createTables();
        }());
    }, false);    
}());