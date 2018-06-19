define(
    "/mediakron/js/src/story/wysiwyg/storage.js", 
    [], 
    function() {
    var storage = function($root) {
            this.localStorageEnabled = this.testLocal();
        };
    storage.prototype = {
        testLocal: function(){
        var mk = 'mktest';
            try {
                localStorage.setItem(mk, mk);
                localStorage.removeItem(mk);
                return true;
            } catch(e) {
                return false;
            }
        },
        setItem: function(key, value){
            if(this.localStorageEnabled){
                localStorage.setItem(key, value);
            }else{
                this.storage[key] = value;
            }
        },
        getItem: function(key){
            if(this.localStorageEnabled){
                return localStorage.getItem(key);
            }else{
                return this.storage[key];
            }
        },
        removeItem: function(key){
            if(this.localStorageEnabled){
                localStorage.removeItem(key);
            }else{
                delete this.storage[key];
            }
        }
    };
    return storage;
});