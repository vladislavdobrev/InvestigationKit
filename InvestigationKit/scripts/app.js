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
                tx.executeSql("CREATE TABLE IF NOT EXISTS investigations (id int IDENTITY PRIMARY KEY, title varchar(100), created datetime)", []);
                tx.executeSql("CREATE TABLE IF NOT EXISTS investigation_notes (id int IDENTITY PRIMARY KEY, text text, created datetime, latitude double, longitude double, inv_id int FOREIGN KEY REFERENCES investigations(id))", []);
            });
        };

        (function init() {
            app.openDb();
            app.createTables();
        }());
    }, false);    
}());