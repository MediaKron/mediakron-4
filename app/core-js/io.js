define([
  'socketio',
], function( io ) {

    Mediakron.socket = io.connect('http://mediakron.dev:3000');
        //socket.on('news', function (data) {
        //console.log(data);
        //socket.emit('my other event', { my: 'data' });
    //});
    Mediakron.socket.on('chat', function (data) {
        console.log(data);
    });
    
    Mediakron.App.Events.on('content:create:save',function(model){
        console.log(model);
    });
    
    Mediakron.socket.on('file:preview:ready',function(ready){
        console.log(ready);
    });
        //Mediakron.socket.emit({'})
 
      //Ready to write Backbone Models and Socket.io communication protocol in here :)
 
 
});