
/**
 * Build a url map from the items. 
 */
function createUrlMap() {
    var urls = {},
        ids = {
            'topics': {},
            'timelines': {},
            'maps': {},
            'comparisons': {},
            'items': {}
        },
        id, url, maps = {};

    Mediakron.items.each(function (item) {
        url = item.get('uri');
        if (url) {
            id = item.get('id');
            if (urls[url]) {
                url = uniquify(url, urls);
                item.set('uri', url);
            }
            urls[url] = {
                id: id,
                type: 'items',
                entity: item.get('type')
            };
            ids.items[id] = item.getURL();

        }
    });

    maps.idMap = ids;
    maps.urlMap = urls;
    return maps;
};

/**
 * For a list of urls, generate a unique url
 * @param {string} url 
 * @param {array} urls 
 */
function uniquify(url, urls) {
    var i = 0,
        urla;
    for (i; i < 10; i++) {
        urla = url + '-' + i;
        if (!urls[urla]) {
            return urla;
        }
    }
}

/**
 * A pass through function for simplifying code a bit
 * @param {string} uri 
 */
function getItem(uri){
    return getItemFromURI(uri);
}

/**
 * Fetch an item by uri
 * @param {string} uri 
 */
function getItemFromURI(uri) {
    var id, collection;
    if (!uri) return false;
    if (typeof (uri) == 'object') uri = uri.uri;
    if (!Mediakron.data.urlMap[uri]) {
        return false;
    }
    id = Mediakron.data.urlMap[uri];
    collection = Mediakron[id.type];
    return collection.get(id.id);
};

/**
 * Get the id from the uri
 * @param {string} uri 
 */
function getInfoFromURI (uri) {
    var id, collection;
    id = Mediakron.urlMap[uri];
    return id;
};

function base_path(){
    return window.location.origin;
}

function api_path() {
    return base_path() + '/api';
}

function file_path() {
  return base_path() + "/files";
}
/**
 * 
 */
function uri() {
    var url = window.location.pathname.split("/");
    if(url[1]){
        return url[1];
    }
    return false;
}

export {
    base_path,
    api_path,
    uri,
    file_path,
    createUrlMap,
    getItem,
    getItemFromURI,
    getInfoFromURI
}