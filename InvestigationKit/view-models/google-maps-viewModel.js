var app = app || {};

app.currentInvestigation = app.currentInvestigation || null;

app.currentNote = app.currentNote || null;

(function(a) {
    var viewModel = {
        latitude: 0,
        longitude: 0,
        src: ""
    };
    
    function init(e) {
        if (app.currentNote) {
            viewModel.latitude = app.currentNote.latitude;
            viewModel.longitude = app.currentNote.longitude;
        }
        
        var mapsBaseUrl = "http://maps.googleapis.com/maps/api/staticmap";
        var centerPar = "center=" + viewModel.latitude + "," + viewModel.longitude;
        var sizePar = "size=300x300";
        viewModel.src = mapsBaseUrl + "?" + centerPar + "&" + sizePar + "&" + "&sensor=true&zoom=12";
        
        kendo.bind(e.view.element, viewModel);
    }
    
    a.googleMaps = {
        init: init,
    };
}(app));