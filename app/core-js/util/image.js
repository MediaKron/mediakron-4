import Link from './link'


export default class Image {
    static render(image, style, attributes) { }

    static style(image, style) {
        if (typeof image !== "string") {
            var object = image;
            if (object.uri) {
                image = object.uri;
            }
        }
        // kludge goes here!
        if (image == "b:0;") {
            return "";
        }
        switch (style) {
            case "small":
                return Mediakron.Settings.filepath + "styles/small/public/" + image;
            case "medium":
                return Mediakron.Settings.filepath + "styles/medium/public/" + image;
            case "large":
                return Mediakron.Settings.filepath + "styles/large/public/" + image;
            case "full":
                return Mediakron.Settings.filepath + "styles/full/public/" + image;
            case "double":
                return Mediakron.Settings.filepath + "styles/double/public/" + image;
            default:
                return Mediakron.Settings.filepath + image;
        }
    }

    static theme(path, title, alt, addClass, width, height) {
        if (typeof path !== "string") {
            var object = path;
            if (object.uri) {
                path = object.uri;
            }
            if (object.alt) {
                alt = object.alt;
            }
        }
        if (!addClass) {
            addClass = "mediakron-image";
        }
        var style = "";
        if (width) {
            style += "width:" + width + "px;";
        }
        if (height) {
            style += "height:" + height + "px;";
        }
        return '<img src="' + path + '" title="' + title + '" alt="' + alt + '" class="' + addClass + '" />';
    }

    static themeSquare(path, title, alt, addClass, width, height) {
        return '<div class="square-thumbnail" alt="' + alt + '" style="background-image:url(' + path + "); background-size: cover; background-position: 50%; width:" + width + "px;height:" + height + 'px"></div>';
    }

    static logo(size) {
        if (!Mediakron.Settings.Appearance.logo) return "";
        if (!size) size = "small";
        var path = this.style(Mediakron.Settings.Appearance.logo, size);
        return Link.link('<img src="' + path + '" alt="' + Mediakron.Settings.institution + '" />', "", true);
    }

    static institution(size) {
        if (!Mediakron.Settings.Appearance.institutional) return "";
        if (!size) size = "small";
        var path = this.style(Mediakron.Settings.Appearance.institutional, size);
        return '<img src="' + path + '" alt="' + Mediakron.Settings.institution + '" />';
    }

    static slideshow(item) {
        var image = item.get("image"),
            item_type = item.get("type"),
            title = item.get("title"),
            id = item.get("id"),
            path,
            hideLoader,
            themedImage;
        if (image) {
            path = this.style(image, item_type + "_slideshow_thumbnails");
            hideLoader = false;
        } else {
            path = Mediakron.Settings.basepath + "sites/all/modules/mediakron/icons/slideshow_" + item_type + "_icon.png";
            hideLoader = true;
        }
        themedImage = theme(path, image, title, "slideshow-image", hideLoader);
        return Link.link(themedImage, item.getURL(), {
            title: title,
            html: true
        });
    }

    static getTagImage(item) {
        var image = item.get("image"),
            item_type = item.get("type"),
            title = item.get("title"),
            id = item.get("id"),
            path,
            hideLoader,
            themedImage;
        if (image) {
            path = this.style(image, item_type + "_infobox_thumbnails");
            hideLoader = false;
        } else {
            path = Mediakron.Settings.basepath + "sites/all/modules/mediakron/icons/infobox_" + item_type + "_icon.png";
            hideLoader = true;
        }
        themedImage = this.theme(path, image, title, "tag-image", hideLoader);
        return Link.themeLink(
            themedImage,
            "mediakron/item/" + id,
            {
                title: title,
                html: true
            }
        );
    }

    static loaded(randStr) {
        $(".loader-" + randStr).hide();
        $(".actual-" + randStr).show();
    }
}