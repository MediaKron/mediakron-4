console.log('models')
var models = require('./models');
console.log('viuews')
var views = require('./views');
console.log('collection')
var collections = require('./collections');
console.log('collection')

module.exports = function(){
    
    Mediakron.Models = {};
    Mediakron.Extensions.Model = models();
    console.log(Mediakron.Extensions)
    console.log(views);
    Mediakron.Views = {};
    Mediakron.Extensions.View = views();


    Mediakron.Collections = {};
    Mediakron.Extensions.Collection = collections();
};