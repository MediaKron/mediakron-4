(function ($) {
    $(document).ready(function(){
        Mediakron.$console = $('#debug');
    });
})(jQuery);

Mediakron.console = function(log){
    var d = new Date(), // for now
        time = (d.getMonth()+1)+'/'+d.getDate()+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds(), call = ''; // => 51
    if(arguments.callee.caller) call = arguments.callee.caller.toString()
    Mediakron.$console.append('<div class="log">'+log+' -- <span class="debug-time">Time: '+time+'</span></div>');
}