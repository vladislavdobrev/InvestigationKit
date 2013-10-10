var app = app || {};

app.db = null;

(function() {
    document.addEventListener("deviceready", function() {
        app.application = new kendo.mobile.Application(document.body, { transition: "slide" });
        
        app.sqlite.openDb = function() {
            if (window.sqlitePlugin !== undefined) {
                app.db = window.sqlitePlugin.openDatabase("Investigation Kit Database");
            }
            else {
                // For debugging in simulator fallback to native SQL Lite
                app.db = window.openDatabase("Investigation Kit Database", "1.0", "Investigation Kit", 200000);
            }
        }
        
        app.createTable = function() {
            app.db.transaction(function(tx) {
                tx.executeSql("CREATE TABLE IF NOT EXISTS investigation_titles (id INTEGER PRIMARY KEY ASC, title VARCHAR(100), created DATETIME)", []);
            });
        }
        
        app.insertRecord = function(t) {
            app.db.transaction(function(tx) {
                var cDate = new Date();
                tx.executeSql("INSERT INTO investigation_titles (text_sample, date_sample) VALUES (?,?)",
                              [t, cDate],
                              function() {
                              },
                              function() {
                              });
            });
        }
        
        app.refresh = function() {
            var renderTodo = function (row) {
                return "<li>" + "<div class='todo-check'></div>" + row.todo + "<a class='button delete' href='javascript:void(0);'  onclick='app.deleteTodo(" + row.ID + ");'><p class='todo-delete'></p></a>" + "<div class='clear'></div>" + "</li>";
            }
    
            var render = function (tx, rs) {
                var rowOutput = "";
                var todoItems = document.getElementById("todoItems");
                for (var i = 0; i < rs.rows.length; i++) {
                    rowOutput += renderTodo(rs.rows.item(i));
                }
      
                todoItems.innerHTML = rowOutput;
            }
    
            var db = app.db;
            db.transaction(function(tx) {
                tx.executeSql("SELECT * FROM investigation_titles", [], 
                              render, 
                              app.onError);
            });
        }

        function init() {
            app.openDb();
            app.createTable();
            app.refresh();
        }
    }, false);    
}());