var app = app || {};

app.currentInvestigation = app.currentInvestigation || null;

app.currentVideo = app.currentVideo || null;

(function(a) {
    var viewModel = kendo.observable({
        data: []
    });
    
    function init(e) {
        if (app.currentVideo) {
            app.currentVideo = null;
        }
        getAll().then(function(results) {
            viewModel.set("data", results);
            kendo.bind(e.view.element, viewModel, kendo.mobile.ui);
        });
    }
    
    function addNewVideo(e) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var lat = position.coords.latitude;
            var long = position.coords.longitude;
            navigator.device.capture.captureVideo(function (videoFile) {
                insertRecord(videoFile.fullPath, lat, long);
            }, function (error) {
            }, {
                limit: 1
            });
        }, function() {
        }, {
            enableHighAccuracy: true
        });
    }
    
    function insertRecord(url, latitude, longitude) {
        app.db.transaction(function(tx) {
            var cDate = new Date();
            tx.executeSql("INSERT INTO investigation_videos (url, created, latitude, longitude, inv_id) VALUES (?,?,?,?,?)", [url, cDate, latitude, longitude, app.currentInvestigation.id]);
            var video = new Video(url, cDate, latitude, longitude, app.currentInvestigation.id);
            tx.executeSql("SELECT MAX(id) as maxId FROM investigation_videos", [], function (x, y) {
                video.id = y.rows.item(0)["maxId"];
                viewModel.data.push(image);
            }, function(err) {
                console.log(err);
            });
        });
    };
        
    function getAll() {
        var promise = new RSVP.Promise(function(resolve, reject) {
            app.db.transaction(function(tx) {
                tx.executeSql("SELECT * FROM investigation_videos WHERE inv_id = ?", [app.currentInvestigation.id], function(x, y) {
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
    
    function onTouch(e) {
        setById(e.target.context.id);
    };
    
    function setById(id) {
        app.db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM investigation_videos WHERE id = ?", [id], function(x, y) {
                app.currentVideo = convertToModel(y.rows.item(0));
                a.application.navigate("views/google-maps-view.html#google-maps-view");
            });
        });
    };
    
    function convertToModel(sqliteModel) {
        var newModel = new Video(sqliteModel.url, sqliteModel.created, sqliteModel.desc, sqliteModel.latitude, sqliteModel.longitude, sqliteModel.inv_id);
        newModel.id = sqliteModel.id;
        return newModel;
    };
    
    a.videos = {
        init: init,
        add: addNewVideo,
        onTouch: onTouch
    };
}(app));