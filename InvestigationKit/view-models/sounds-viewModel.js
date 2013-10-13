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
            navigator.device.capture.captureAudio(function (audioFiles) {
                insertRecord(audioFiles[0].fullPath, lat, long);
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
            var sound = new Sound(url, cDate, latitude, longitude, app.currentInvestigation.id);
            tx.executeSql("SELECT MAX(id) as maxId FROM investigation_sounds", [], function (x, y) {
                sound.id = y.rows.item(0)["maxId"];
                viewModel.data.push(convertToMediaModel(sound));
            }, a.error);
        });
    };
        
    function getAll() {
        var promise = new RSVP.Promise(function(resolve, reject) {
            app.db.transaction(function(tx) {
                tx.executeSql("SELECT * FROM investigation_sounds WHERE inv_id = ?", [app.currentInvestigation.id], function(x, y) {
                    var results = [];
                    for (var i = 0; i < y.rows.length; i++) {
                        results.push(convertToMediaModel(y.rows.item(i)));
                    }
                        
                    resolve(results);
                }, function (error) {
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
            tx.executeSql("SELECT * FROM investigation_sounds WHERE id = ?", [id], function(x, y) {
                app.currentSound = convertToMediaModel(y.rows.item(0));
                a.application.navigate("views/google-maps-view.html#google-maps-view");
            }, a.error);
        });
    };
    
    function convertToMediaModel(sqliteModel) {
        var media = new Media(sqliteModel.url, function() {
        }, a.error);
        var normalDate = new Date(sqliteModel.created);
        return {id: sqliteModel.id, created: dateToDMY(normalDate), media: media};
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
    
    function onPlay(e) {
        play(e.touch.currentTarget.id);
    }
    
    function play(id) {
        app.db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM investigation_sounds WHERE id = ?", [id], function(x, y) {
                app.currentSound = convertToMediaModel(y.rows.item(0));
                app.currentSound.media.play();
            }, a.error);
        });
    }
    
    a.sounds = {
        init: init,
        add: addNewSound,
        onTouch: onTouch,
        onPlay: onPlay
    };
}(app));