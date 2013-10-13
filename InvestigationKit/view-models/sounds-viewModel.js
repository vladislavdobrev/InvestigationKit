var app = app || {};

app.currentInvestigation = app.currentInvestigation || null;

app.currentSound = app.currentSound || null;

(function(a) {
    var viewModel = kendo.observable({
        data: []
    });
    
    function init(e) {
        if (app.currentSound) {
            app.currentSound = null;
        }
        getAll().then(function(results) {
            viewModel.set("data", results);
            kendo.bind(e.view.element, viewModel, kendo.mobile.ui);
        }, a.error);
    }
    
    function addNewSound(e) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var lat = position.coords.latitude;
            var long = position.coords.longitude;
            navigator.device.capture.captureAudio(function (audioFile) {
                insertRecord(audioFile.fullPath, lat, long);
            }, a.error, {
                limit: 1
            });
        }, a.error, {
            enableHighAccuracy: true
        });
    }
    
    function insertRecord(url, latitude, longitude) {
        app.db.transaction(function(tx) {
            var cDate = new Date();
            tx.executeSql("INSERT INTO investigation_sounds (url, created, latitude, longitude, inv_id) VALUES (?,?,?,?,?)", [url, cDate, latitude, longitude, app.currentInvestigation.id]);
            var sound = new Video(url, cDate, latitude, longitude, app.currentInvestigation.id);
            tx.executeSql("SELECT MAX(id) as maxId FROM investigation_sounds", [], function (x, y) {
                sound.id = y.rows.item(0)["maxId"];
                viewModel.data.push(sound);
            }, a.error);
        });
    };
        
    function getAll() {
        var promise = new RSVP.Promise(function(resolve, reject) {
            app.db.transaction(function(tx) {
                tx.executeSql("SELECT * FROM investigation_sounds WHERE inv_id = ?", [app.currentInvestigation.id], function(x, y) {
                    var results = [];
                    for (var i = 0; i < y.rows.length; i++) {
                        results.push(convertToModel(y.rows.item(i)));
                    }
                        
                    resolve(results);
                }, function (error){
                    reject(error);
                });
            });
        });
            
        return promise;
    };
    
    function onTouch(e) {
        setById(e.touch.initialTouch.id);
    };
    
    function setById(id) {
        app.db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM investigation_sounds WHERE id = ?", [id], function(x, y) {
                app.currentVideo = convertToModel(y.rows.item(0));
                a.application.navigate("views/google-maps-view.html#google-maps-view");
            }, a.error);
        });
    };
    
    function convertToModel(sqliteModel) {
        var newModel = new Sound(sqliteModel.url, sqliteModel.created, sqliteModel.desc, sqliteModel.latitude, sqliteModel.longitude, sqliteModel.inv_id);
        newModel.id = sqliteModel.id;
        return newModel;
    };
    
    a.sounds = {
        init: init,
        add: addNewSound,
        onTouch: onTouch
    };
}(app));