/**
 * This is a loader for all of the collections 
 */

module.export = function(){
    Mediakron.Collections = {};

    // 
    Mediakron.Collections.Items = require('./collections/items');
    Mediakron.Collections.Users = require('./collections/users');
    Mediakron.Collections.Groups = require('./collections/groups');
    Mediakron.Collections.Sites = require('./collections/sites');
    Mediakron.Collections.Comments = require('./collections/comments');
    Mediakron.Collections.ZoomLevels = require('./collections/zooms');
    Mediakron.Collections.SearchResults = require('./collections/search_results');

}







