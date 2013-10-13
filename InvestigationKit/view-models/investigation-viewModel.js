var app = app || {};

app.currentInvestigation = app.currentInvestigation || null;

(function(a) {
    var viewModel = kendo.observable(app.currentInvestigation);
    
    function init(e) {
        kendo.bind(e.view.element, viewModel);       
    }
    
    function takeNote(e)
    {
        a.application.navigate("views/notes-view.html#notes-view");
    }
    
    function takeImage(e)
    {
        a.application.navigate("views/images-view.html#images-view");
    }
    
    function takeVideo(e)
    {
        a.application.navigate("views/videos-view.html#videos-view");
    }
    
    function takeAudio(e)
    {
        a.application.navigate("views/sounds-view.html#sounds-view");
    }
    
    a.investigation = {
        init: init,
        takeNote: takeNote,
        takeImage: takeImage,
        takeVideo: takeVideo,
        takeAudio: takeAudio
    };
}(app));