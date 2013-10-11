var app = app || {};

(function(a) {
    var viewModel = kendo.observable({
        data: [],
        newNote: {
            text: ""
        }
    });
    
    function init(e) {
        a.getAllNotes()
        .then(function(results) {
            viewModel.set("data", results);
            kendo.bind(e.view.element, viewModel, kendo.mobile.ui);
        });
    }
    
    function addNewNote(e) {
        navigator.geolocation.watchPosition(function(position) {
            var lat = position.coords.latitude;
            var long = position.coords.longitude;
            a.insertRecordNotes(viewModel.newNote.text, lat, long)
        }, function() {
        }, {
            enableHighAccuracy: true,
            maximumAge: 1000
        });
    }
    
    function deleteItem(e) {
        var item = e.button.closest("li");
        item.destroy();
    }
    
    function itemClicked() {
        a.application.navigate("views/investigation-view.html#investigation-view");
    }
    
    a.notes = {
        init: init,
        add: addNewNote
    };
}(app));