Mediakron.Media = {};
Mediakron.Image = {};


Mediakron.Image.render = function(image,style,attributes){
    
};


Mediakron.Image.style = function (image, style) {
    if(typeof image !== 'string'){
        var object = image;
        if(object.uri){
            image = object.uri;
        }
    }
    // kludge goes here!
    if(image == 'b:0;'){ return ''; }
    switch (style) {
        case "small":
            return Mediakron.Settings.filepath + 'styles/small/public/' + image;
        case "medium":
            return Mediakron.Settings.filepath + 'styles/medium/public/' + image;
        case "large":
            return Mediakron.Settings.filepath + 'styles/large/public/' + image;
        case "full":
            return Mediakron.Settings.filepath + 'styles/full/public/' + image;
        case "double":
            return Mediakron.Settings.filepath + 'styles/double/public/' + image;  
        default:
            return Mediakron.Settings.filepath + image;
    }
};

Mediakron.Image.theme = function (path, title, alt, addClass,width,height) {  
    if(typeof path !== 'string'){
        var object = path;
        if(object.uri){
            path = object.uri;
        }
        if(object.alt){
            alt = object.alt;
        }
    }
    if (!addClass) {
        addClass = "mediakron-image";
    }
    var style = '';
    if(width){
        style += 'width:'+width+'px;';
    }
    if(height){
        style += 'height:'+height+'px;';
    }
    return '<img src="' + path + '" title="' + title + '" alt="' + alt + '" class="' + addClass + '" />';

};

Mediakron.Image.themeSquare = function (path, title, alt, addClass, width,height) {  
        return '<div class="square-thumbnail" alt="'+alt+'" style="background-image:url('+path+'); background-size: cover; background-position: 50%; width:'+width+'px;height:'+height+'px"></div>';
};

Mediakron.Image.logo = function (size) {  
    if(!Mediakron.Settings.Appearance.logo) return '';
    if(!size) size = 'small';
    var path = Mediakron.Image.style(Mediakron.Settings.Appearance.logo,size);
    return Mediakron.Theme.link('<img src="'+path+'" alt="'+Mediakron.Settings.institution+'" />','',true);
};
Mediakron.Image.institution = function (size) {  
    if(!Mediakron.Settings.Appearance.institutional) return '';
    if(!size) size = 'small';
    var path = Mediakron.Image.style(Mediakron.Settings.Appearance.institutional,size);
    return '<img src="'+path+'" alt="'+Mediakron.Settings.institution+'" />';
};

Mediakron.Image.slideshow = function (item) {
    var image = item.get("image"),
        item_type = item.get("type"),
        title = item.get("title"),
        id = item.get("id"),
        path,
        hideLoader,
        themedImage;
    if (image) {
        path = Mediakron.Image.style(image, item_type + "_slideshow_thumbnails");
        hideLoader = false;
    } else {
        path = Mediakron.Settings.basepath+"sites/all/modules/mediakron/icons/slideshow_" + item_type + "_icon.png";
        hideLoader = true;
    }
    themedImage = Mediakron.Image.theme(path, image, title, 'slideshow-image', hideLoader);
    return Mediakron.Theme.link(themedImage,item.getURL(), {'title': title,'html':true} );
};
Mediakron.getTagImage = function (item) {
    var image = item.get("image"),
        item_type = item.get("type"),
        title = item.get("title"),
        id = item.get("id"),
        path,
        hideLoader,
        themedImage;
    if (image) {
        path = Mediakron.Image.style(image, item_type + "_infobox_thumbnails");
        hideLoader = false;
    } else {
        path = Mediakron.Settings.basepath+"sites/all/modules/mediakron/icons/infobox_" + item_type + "_icon.png";
        hideLoader = true;
    }
    themedImage = Mediakron.Image.theme(path, image, title, 'tag-image',hideLoader);
    return Mediakron.themeLink(themedImage, 'mediakron/item/' + id, {'title': title,'html':true} );
};

Mediakron.Image.loaded =  function(randStr){
    $('.loader-'+randStr).hide();
    $('.actual-'+randStr).show();
};