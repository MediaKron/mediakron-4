
/**
 * This is a loader for all of the models 
 */

module.export =  {
    createUrl : function (url, id) {
        if (!url) { return false; }
        return url.replace('{id}', id);
    },
    // add the models
    Item: require('./models/item'),
    User: require('./models/user'),
    Group: require('./models/group'),
    Site: require('./models/site'),
    Comment: require('./models/comment')
}








