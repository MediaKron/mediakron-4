Mediakron.Events = {};

Mediakron.Events.ThrowError = function(code){
    var view = new Mediakron.Pages.ErrorPage(code);
    Mediakron.controller.gotoView(view);
};

Mediakron.Events.AccessDenied = function(){
    var view = new Mediakron.Pages.ErrorPage();
    Mediakron.controller.gotoView(view);
};

Mediakron.Events.loadItems = function(){
    
};

Mediakron.Events.xhrProgress = function(){
    var xhr = $.ajaxSettings.xhr();
    xhr.onprogress = Mediakron.Events.xhrHandleProgress;
    return xhr;
};

Mediakron.Events.xhrHandleProgress = function(evt){
    var percentComplete = 0;
    percentComplete = evt.loaded / evt.total;
    Mediakron.messages.loadProgress("Loading", Math.round(percentComplete * 100));
    
};
