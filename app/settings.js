import { base_path, file_path, uri } from "./core-js/util/url"

export default class Settings {
    constructor(){
        Object.assign(this, defaultSettings);
    }

    site(site){

        this.name = site.get('title');
        this.uri = site.get('uri');
        this.subtitle = site.get('subtitle');
        this.version = site.get('version');
        this.copyright = site.get('copyright');
        this.url = base_path();
        this.ga = site.get('ga');
        this.comment = site.get('comment');
        this.download = site.get('download');
        this.showAuthor = site.get('showAuthor');
        this.showView = site.get('showView');
        this.public = site.get('public');

        this.filepath = file_path();
        this.basepath = base_path();
        
        // Build nav options
        this.Navigation.primary = site.get('primaryNav');
        this.Navigation.secondary = site.get('secondary');

        // Build home page
        this.HomePage.image = site.get('homepageImage');
        this.HomePage.alt = site.get('homepageImageAlt');
        this.HomePage.description = site.get('homepageDescription');
        this.HomePage.item = site.get('homepageItem');
        this.HomePage.layout = site.get('homepageLayout');

        this.Appearance.logo = site.get('logo');
        this.Appearance.navigation = site.get('navigation');
        this.Appearance.skin = site.get('skin');
        this.Appearance.font = site.get('font');

        this.Appearance.colors.navigation = site.get('navColor');
        this.Appearance.colors.links = site.get('linkColor');
        this.Appearance.colors.banner = site.get('bannerColor');
        this.Appearance.colors.bannerlink = site.get('bannerLinkColor');
    }
}

var defaultSettings = {
        "name": "",
        "uri": "",
        "subtitle": "",
        "copyright": "",
        "version": "",
        "url": "",
        "ga": "",
        "pushState": false,
        "cssURL": "/mediakron/css/",
        "layout": "default",
        "institution": "Boston College",
        "search": "internal",
        "commenting": false,
        "download": true,
        "showauthor": true,
        "showview": true,
        "public": false,
        "filepath": "/files/",
        "appPath": "/",
        "basepath": "/",
        "device": "desktop",
        "token": "{{ token }}",
        "welcome": false,
        "showArchive": false,
        "Navigation": {
            "primary": {},
            "secondary": {}
        },
        "HomePage": {
            "image": "",
            "alt": "",
            "description": "",
            "item": "",
            "layout": "basic",
            "options": {
                "menus-basic": {
                    "id": "menus-basic",
                    "title": "Menu Banner",
                    "icon": "/mediakron/css/img/layout-icons/menu-banner.png",
                    "help": "Menus display as thumbnails",
                    "classes": "body-homepage body-menus-basic"
                },
                "menus-half": {
                    "id": "menus-half",
                    "title": "Half-page intro banner with thumbnail menus",
                    "icon": "/mediakron/css/img/layout-icons/menu-half.png",
                    "help": "Background image or solid theme color (if no image); Menu items included as thumbnails below",
                    "classes": "body-homepage body-menus-half body-half-image"
                },
                "menus-full": {
                    "id": "menus-full",
                    "title": "Full-page intro banner with Thumbnail Menus",
                    "icon": "/mediakron/css/img/layout-icons/homepage-full.png",
                    "help": "Background image or solid theme color (if no image); Menu items included as thumbnails below",
                    "classes": "body-homepage body-menus-full body-full-image"
                },
                "basic": {
                    "id": "basic",
                    "title": "Centered",
                    "icon": "/mediakron/css/img/layout-icons/homepage-centered.png",
                    "help": "Centered layout with subtitle at the top, followed by an image, if present, and then a description.",
                    "classes": "body-homepage body-homepage-basic"
                },
                "half": {
                    "id": "half",
                    "title": "Half-page Banner with background image/theme color",
                    "icon": "/mediakron/css/img/layout-icons/homepage-half.png",
                    "help": "Centered title and subtitle over background image. Site description displays below, if present.",
                    "classes": "body-homepage body-homepage-half body-half-image"
                },
                "nobanner": {
                    "id": "nobanner",
                    "title": "Full-page Banner with background image/theme color",
                    "icon": "/mediakron/css/img/layout-icons/homepage-full.png",
                    "help": "Centered title and subtitle over background image. Site description displays below, if present.",
                    "classes": "body-homepage body-homepage-nobanner body-full-image"
                },
                "right": {
                    "id": "right",
                    "title": "Right",
                    "icon": "/mediakron/css/img/layout-icons/homepage-right.png",
                    "help": "Image on right, subtitle/description on left.",
                    "classes": "body-homepage body-homepage-right"
                },
                "left": {
                    "id": "left",
                    "title": "Left",
                    "icon": "/mediakron/css/img/layout-icons/homepage-left.png",
                    "help": "Image on left, subtitle/description on right.",
                    "classes": "body-homepage body-homepage-left"
                },
                "updates-basic": {
                    "id": "updates-basic",
                    "title": "Updates Basic",
                    "icon": "/mediakron/css/img/layout-icons/homepage-centered.png",
                    "help": "List of new and updated content",
                    "classes": "body-homepage body-updates-basic"
                },
                "updates-half": {
                    "id": "updates-half",
                    "title": "Half-page Banner with Updates",
                    "icon": "/mediakron/css/img/layout-icons/homepage-half.png",
                    "help": "Background image or solid theme color (if no image); List of new and updated content below",
                    "classes": "body-homepage body-updates-half body-half-image"
                },
                "updates-full": {
                    "id": "updates-full",
                    "title": "Full-page Banner with Updates",
                    "icon": "/mediakron/css/img/layout-icons/homepage-full.png",
                    "help": "Background image or solid theme color (if no image); List of new and updated content below",
                    "classes": "body-homepage body-updates-full body-full-image"
                },
                "nointro": {
                    "id": "nointro",
                    "title": "No Introduction",
                    "icon": "/mediakron/css/img/layout-icons/homepage-none.png",
                    "help": "Choose this if you plan to use only a content item as the home page (see below).",
                    "classes": "body-homepage body-homepage-left"
                }

            }
        },
        "Appearance": {
            "logo": "{{ site.logo }}",
            "navigation": "{{ navigation }}",
            "skin": "{{ site.skin }}",
            "font": "{{ site.font }}",
            "colors": {
                "navigation": "{{ site.navColor }}",
                "links": "{{ site.linkColor }}",
                "banner": "{{ site.bannerColor }}",
                "bannerlink": "{{ site.bannerLinkColor }}"
            },
            "fonts": {
                "Roboto (san serif)": "\"Roboto\", Helvetica, Arial, sans-serif",
                "Helvetica Neue (sans serif)": "\"Helvetica Neue\", Helvetica, Arial, sans-serif",
                "Georgia (serif)": "Georgia, serif",
                "Merriweather (serif)": "\"Merriweather\", Georgia, serif"
            }
        },
        "AudioTypes": {

            "mp3": {
                "id": "mp3",
                "name": "Upload .mp3 File"
            },
            "google": {
                "id": "google",
                "name": "Google Drive"
            },
            "bc": {
                "id": "bc",
                "name": "BC Streaming Server"
            },
            "archiveorg": {
                "id": "archiveorg",
                "name": "Archive.org audio"
            },
            "rtmp": {
                "id": "rtmp",
                "name": "RTMP"
            },
            "url": {
                "id": "url",
                "name": "URL (link only, not embedded)"
            }
        },
        "VideoTypes": {

            "youtube": {
                "id": "youtube",
                "name": "YouTube"
            },
            "vimeo": {
                "id": "vimeo",
                "name": "Vimeo"
            },
            "google": {
                "id": "google",
                "name": "Google Drive"
            },
            "archiveorg": {
                "id": "archiveorg",
                "name": "Archive.org video"
            },
            "bc": {
                "id": "bc",
                "name": "BC Streaming Server"
            },
            "panopto": {
                "id": "panopto",
                "name": "BC Panopto Video"
            },
            "kanopy": {
                "id": "kanopy",
                "name": "Kanopy Video"
            },
            "mp4": {
                "id": "mp4",
                "name": "Upload .mp4 File"
            },
            "rtmp": {
                "id": "rtmp",
                "name": "RTMP"
            },
            "url": {
                "id": "url",
                "name": "URL (link only, not embedded)"
            }
        },
        "TextTypes": {
            "html": {
                "id": "html",
                "name": "Basic Text"
            },
            "pdf": {
                "id": "pdf",
                "name": "PDF"
            },
            "image": {
                "id": "image",
                "name": "Manuscript Image"
            }

        },
        "FileTypes": {
            "pdf": {
                "id": "pdf",
                "name": "PDF"
            },
            "image": {
                "id": "image",
                "name": "Manuscript Image"
            },
            "ppt": {
                "id": "ppt",
                "name": "Powerpoint"
            },
            "doc": {
                "id": "doc",
                "name": "Word Document"
            },
            "txt": {
                "id": "txt",
                "name": "Text Document"
            },
            "xls": {
                "id": "xls",
                "name": "Spreadsheet"
            },

        },
        "MapTypes": {
            "osm": {
                "id": "osm",
                "name": "Color Basemap with Terrain"
            },
            "Esri_WorldStreetMap": {
                "id": "Esri_WorldStreetMap",
                "name": "ESRI World Street Map"
            },
            "Esri_DeLorme": {
                "id": "Esri_DeLorme",
                "name": "ESRI DeLorme Map"
            },
            "Esri_NatGeoWorldMap": {
                "id": "Esri_NatGeoWorldMap",
                "name": "ESRI National Geographic Map"
            },
            "Esri_WorldImagery": {
                "id": "Esri_WorldImagery",
                "name": "ESRI Satellite Imagery"
            },
            "stamen-light": {
                "id": "stamen-light",
                "name": "Black And White Basemap"
            },
            "stamen-watercolor": {
                "id": "stamen-watercolor",
                "name": "Watercolor Basemap"
            },
            "cartodb": {
                "id": "cartodb",
                "name": "Carto Map (Embedded)"
            },
            "image-map": {
                "id": "image-map",
                "name": "Uploaded Image Basemap"
            }
        },
        "MimeTypes": {
            "bulk": [
                "application\/json",
                "application\/xml"
            ],
            "images": [
                "image\/jpeg",
                "image\/jpg",
                "image\/gif",
                "image\/png"
            ],
            "video": [
                "video\/mpeg",
                "video\/mpeg4",
                "video\/x-m4v",
                "video\/x-mp4",
                "video\/mp4"
            ],
            "audio": [
                "audio\/mpeg",
                "audio\/mpeg3",
                "audio\/x-m4a",
                "audio\/x-mp3",
                "audio\/mp3"
            ],
            "file": [

            ],
            "text": [
                "application\/pdf",
                "image\/jpeg",
                "image\/jpg",
                "image\/gif",
                "image\/png",
                "application\/msword",
                "application\/vnd.ms-powerpoint",
                "application\/vnd.ms-excel",
                "application\/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "application\/vnd.openxmlformats-officedocument.presentationml.presentation",
                "application\/vnd.ms-outlook"
            ],
            "textTypes": {
                "application\/pdf": "pdf",
                "application\/msword": "doc",
                "application\/vnd.ms-powerpoint": "ppt",
                "application\/vnd.ms-excel": "xls",
                "application\/vnd.openxmlformats-officedocument.wordprocessingml.document": "doc",
                "application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xls",
                "application\/vnd.openxmlformats-officedocument.presentationml.presentation": "ppt"
            }
        },
    "skins": {
        "default.css": {
            "title": "Default",
            "links": "#4b4b4b",
            "banner": "#222",
            "bannerlink": "#fff"
        },
        "compact.css": {
            "title": "Compact(depricated)",
            "links": "#4b4b4b",
            "banner": "#030303",
            "bannerlink": "#fff"
        },
        "guestbook.css": {
            "title": "GB",
            "links": "#252D31",
            "banner": "#252D31",
            "bannerlink": "#ffffff"
        }
    },
    "Templates": {
        "comparison": {
        },
        "story": {
            "default": {
                "id": "default",
                "name": "Basic Story",
                "icon": "/mediakron/css/img/layout-icons/story-simple.png",
                "help": "A basic story without an image"
            },
            "half": {
                "id": "half",
                "name": "Half-page Header Image",
                "icon": "/mediakron/css/img/layout-icons/story-half.png",
                "help": "A half-page background image at the beginning of the Story.",
                "classes": ""
            },
            "full": {
                "id": "full",
                "name": "Full-page Header Image",
                "icon": "/mediakron/css/img/layout-icons/story-full.png",
                "help": "A full background image at the beginning of the Story.",
                "classes": ""
            }
        },
        "audio": {
            "default": {
                "id": "default",
                "name": "Audio with Background Image",
                "icon": "/mediakron/css/img/layout-icons/audio-full.png",
                "help": "The audio player will appear over a background image, if present.",
                "classes": "slideshow audio-default"
            },
            "simple": {
                "id": "simple",
                "name": "Audio with Inline Image",
                "icon": "/mediakron/css/img/layout-icons/audio-simple.png",
                "help": "The audio player will appear above an inline image, if present.",
                "classes": "slideshow audio-simple"
            }
        },
        "image": {
        },
        "video": {
        },
        "slideshow": {
            "default": {
                "id": "default",
                "name": "Grid",
                "icon": "/mediakron/css/img/layout-icons/slideshow-grid.png",
                "help": "A grid layout with thumbnails. If you've uploaded an image for the slideshow, it will appear as a top banner.",
                "classes": "slideshow slideshow-grid"
            },
            "mosaic": {
                "id": "mosaic",
                "name": "Mosaic Layout",
                "icon": "/mediakron/css/img/layout-icons/slideshow-mosaic.png",
                "help": "Images in their original aspect ratios.",
                "classes": "slideshow slideshow-mosaic"
            },
            "full": {
                "id": "full",
                "name": "Centered Introduction",
                "icon": "/mediakron/css/img/layout-icons/slideshow-full.png",
                "help": "Full page introduction with background image if present.",
                "classes": "slideshow slideshow-full"
            }
        },
        "narrative": {
            "default": {
                "id": "default",
                "name": "Introduction with Background Image",
                "icon": "/mediakron/css/img/layout-icons/narrative-full.png",
                "help": "An introductory page with a full background image. Widgets display below introduction.",
                "classes": "narrative narrative-default"
            },
            "Top": {
                "id": "top",
                "name": "Image in Top Banner",
                "icon": "/mediakron/css/img/layout-icons/narrative-top.png",
                "help": "Image at the top, if present, and any widgets display below",
                "classes": "narrative narrative-top"
            },
            "simple": {
                "id": "simple",
                "name": "Basic Narrative Layout",
                "icon": "/mediakron/css/img/layout-icons/narrative-simple.png",
                "help": "Image in the body of page, if present, and any widgets display below",
                "classes": "narrative narrative-simple"
            }
        },
        "file": {
        },
        "map": {
            "default": {
                "id": "default",
                "name": "Basic Map",
                "icon": "/mediakron/css/img/layout-icons/map-basic.png",
                "help": "A basic map for organizing content by location.",
                "classes": "map map-basic"
            },
            "maptour": {
                "id": "maptour",
                "name": "Map Tour",
                "icon": "/mediakron/css/img/layout-icons/map-tour.png",
                "help": "A map that allows you to put items in an order and walk users through them in sequence."
            },
            "timemap": {
                "id": "timemap",
                "name": "Time Map",
                "icon": "/mediakron/css/img/layout-icons/map-timeline.png",
                "help": "A map with timeline controls to show and hide map markers based on dates."
            }
        },
        "folder": {
            "list-simple": {
                "id": "list-simple",
                "name": "Basic List",
                "icon": "/mediakron/css/img/layout-icons/folder-list-simple.png",
                "help": "A list of folder items. Item thumbnail does not appear in layout.",
                "classes": "folder folder-default"
            },
            "default": {
                "id": "default",
                "name": "List with image",
                "icon": "/mediakron/css/img/layout-icons/folder-list.png",
                "help": "A list of folder items. If you've uploaded an image for the folder, it will appear above the item list",
                "classes": "folder folder-default"
            },
            "list-half": {
                "id": "list-half",
                "name": "List (half-page image)",
                "icon": "/mediakron/css/img/layout-icons/folder-list-half.png",
                "help": "A list of folder items with a half-page image header",
                "classes": "folder folder-default"
            },
            "list-full": {
                "id": "list-full",
                "name": "List (full-page image)",
                "icon": "/mediakron/css/img/layout-icons/folder-list-full.png",
                "help": "A list of folder items with a full-page image header",
                "classes": "folder folder-default"
            },
            "grid-simple": {
                "id": "grid-simple",
                "name": "Grid Layout",
                "icon": "/mediakron/css/img/layout-icons/folder-grid-simple.png",
                "help": "A grid layout with thumbnails."
            },
            "grid": {
                "id": "grid",
                "name": "Grid with half-page header image",
                "icon": "/mediakron/css/img/layout-icons/folder-grid.png",
                "help": "A grid layout with square thumbnails. If you've uploaded an image for the folder, it will appear as a top banner."
            },
            "grid-full": {
                "id": "grid-full",
                "name": "Grid with full-page header image",
                "icon": "/mediakron/css/img/layout-icons/folder-grid-full.png",
                "help": "A grid layout with square thumbnails. If you've uploaded an image for the folder, it will appear as a top banner."
            },
            "folder-mosaic": {
                "id": "folder-mosaic",
                "name": "Mosaic thumbnail layout (item thumbnails required)",
                "icon": "/mediakron/css/img/layout-icons/folder-mosaic.png",
                "help": "Folder items with thumbnail images in their original aspect ratios. NOTE: only items with thumbnails will appear."
            },
            "table": {
                "id": "table",
                "name": "Table",
                "icon": "/mediakron/css/img/layout-icons/folder-table.png",
                "help": "A table layout with item details."
            }
        },
        "options": {
            "showSidebar": {
                "id": "showSidebar",
                "name": "Sidebar is visible by default",
                "help": "If checked the sidebar will be visible by default.",
                "default": false
            }
        }
    },
    "Story": {
        "wysiwyg": {
            "image": {
                "Left": { "class": "alignLeft", "icon": "alignLeft", "help": "50% Left" },
                "Left-Sm": { "class": "alignLeftSm", "icon": "alignLeftSm", "help": "40% Left" },
                "Left-Lg": { "class": "alignLeftLg", "icon": "alignLeftLg", "help": "60% Left" },
                "Right": { "class": "alignRight", "icon": "alignRight", "help": "50% Right" },
                "Right-Sm": { "class": "alignRightSm", "icon": "alignRightSm", "help": "40% Right" },
                "Right-Lg": { "class": "alignRightLg", "icon": "alignRightLg", "help": "60% Right" },
                "Column": { "class": "alignCol", "icon": "alignCol", "help": "Full Column" },
                "Large": { "class": "alignLarge", "icon": "alignLarge", "help": "Large Centered Image" },
                "Full": { "class": "alignFull", "icon": "alignFull", "help": "Full screen alignment" }
            },
            "video": {
                "Left": { "class": "alignLeft", "icon": "alignLeft", "help": "40% Left" },
                "Left-Large": { "class": "alignLeftLg", "icon": "alignLeftLg", "help": "60% Left" },
                "Right": { "class": "alignRight", "icon": "alignRight", "help": "40% Right" },
                "Right-Large": { "class": "alignRightLg", "icon": "alignRightLg", "help": "60% Right" },
                "Column": { "class": "alignCol", "icon": "alignCol", "help": "Full Column" },
                "Large": { "class": "alignLarge", "icon": "alignLarge", "help": "Large Centered Video" },
                "Full": { "class": "alignFull", "icon": "alignFull", "help": "Full screen alignment" }
            },
            "text": {
                "left": { "class": "alignLeft", "icon": "alignLeft", "help": "40% Left" },
                "right": { "class": "alignRight", "icon": "alignRight", "help": "40% Right" },
                "col": { "class": "alignCol", "icon": "alignCol", "help": "Full Column" },
                "full": { "class": "alignFull", "icon": "alignFull", "help": "Full screen alignment" }
            },
            "file": {
                "Left": { "class": "alignLeft", "icon": "alignLeft", "help": "40% Left" },
                "Right": { "class": "alignRight", "icon": "alignRight", "help": "40% Right" },
                "Column": { "class": "alignCol", "icon": "alignCol", "help": "Full Column" }
            },
            "map": {
                "Column": { "class": "alignCol", "icon": "alignCol", "help": "Full Column" },
                "Full": { "class": "alignFull", "icon": "alignFull", "help": "Full screen alignment" }
            }
        }
    },
    "Narrative": {
        "options": {
            "hide_title": {
                "id": "hide.title",
                "name": "Hide Title"
            },
            "hide_sidebar": {
                "id": "hide.sidebar",
                "name": "Hide Sidebar"
            }
        },
        "templates": {
            "image": {
                "default": {
                    "id": "default",
                    "name": "Default Layout",
                    "icon": "",
                    "help": ""
                },
                "narrow": {
                    "id": "narrow",
                    "name": "Width of text body",
                    "icon": "",
                    "help": "Image width the same as text body"
                },
                "full": {
                    "id": "full",
                    "name": "Full-page width",
                    "icon": "",
                    "help": ""
                }
            },
            "video": {
                "default": {
                    "id": "default",
                    "name": "Default Layout",
                    "icon": "",
                    "help": "A single large image, description on the left."
                }
            },
            "slideshow": {
                "default": {
                    "id": "default",
                    "name": "Default Layout",
                    "icon": "",
                    "help": "A single large image, description on the left."
                }
            },
            "audio": {
                "default": {
                    "id": "default",
                    "name": "Background Image",
                    "icon": "/mediakron/css/img/layout-icons/audio-full.png",
                    "help": "The audio player will appear over a background image, if present."
                },
                "simple": {
                    "id": "simple",
                    "name": "Inline Image",
                    "icon": "/mediakron/css/img/layout-icons/audio-simple.png",
                    "help": "The audio player will appear above an inline image, if present."
                }
            },
            "story": {
                "default": {
                    "id": "default",
                    "name": "Default Layout",
                    "icon": "",
                    "help": "A single large image, description on the left."
                }
            },
            "file": {
                "default": {
                    "id": "default",
                    "name": "Default Layout",
                    "icon": "",
                    "help": "A single large image, description on the left."
                }
            },
            "map": {
                "default": {
                    "id": "default",
                    "name": "Default Layout",
                    "icon": "",
                    "help": "A single large image, description on the left."
                }
            },
            "maptimeline": {
                "default": {
                    "id": "default",
                    "name": "Default Layout",
                    "icon": "",
                    "help": "A single large image, description on the left."
                }
            },
            "timeline": {
                "default": {
                    "id": "default",
                    "name": "Default Layout",
                    "icon": "",
                    "help": "A single large image, description on the left."
                }
            },
            "comparison": {
                "default": {
                    "id": "default",
                    "name": "Default Layout",
                    "icon": "",
                    "help": "A single large image, description on the left."
                }
            },
            "progression": {
                "default": {
                    "id": "default",
                    "name": "Default Layout",
                    "icon": "",
                    "help": "A single large image, description on the left."
                }
            }

        }
    },
    "Contexts": {
        "slideshow": {
            "children": [
                "image",
                "video",
                "file",
                "audio"
            ],
            "scroll": false
        },
        "story": {
            "children": [
                "image",
                "video",
                "file",
                "audio",
                "slideshow",
                "progression",
                "comparison",
                "map",
                "maptimeline",
                "physical",
                "timeline"
            ],
            "scroll": true
        },
        "narrative": {
            "children": [
                "image",
                "video",
                "story",
                "file",
                "audio",
                "slideshow",
                "progression",
                "comparison",
                "map",
                "maptimeline",
                "physical",
                "timeline"
            ],
            "scroll": true
        },
        "progression": {
            "children": [
                "image"
            ],
            "scroll": false
        },
        "comparison": {
            "children": [
                "image",
                "video",
                "audio",
                "story"
            ],
            "scroll": false
        },
        "folder": {
            "children": [
                "image",
                "video",
                "story",
                "file",
                "audio",
                "narrative",
                "slideshow",
                "folder",
                "progression",
                "comparison",
                "map",
                "maptimeline",
                "timeline"
            ],
            "scroll": false
        },
        "layer": {
            "children": [
                "image",
                "video",
                "story",
                "file",
                "audio",
                "narrative",
                "slideshow",
                "folder",
                "progression",
                "comparison",
                "map",
                "maptimeline",
                "timeline"
            ],
            "scroll": false
        },
        "tag": {
            "children": [
                "image",
                "video",
                "story",
                "file",
                "audio",
                "narrative",
                "slideshow",
                "folder",
                "progression",
                "comparison",
                "map",
                "maptimeline",
                "timeline"
            ],
            "scroll": false
        },
        "map": {
            "children": [
                "image",
                "video",
                "story",
                "file",
                "audio",
                "folder",
                "narrative",
                "slideshow",
                "progression",
                "comparison",
                "map",
                "maptimeline",
                "timeline"
            ],
            "scroll": false
        },
        "maptimeline": {
            "children": [
                "image",
                "video",
                "story",
                "file",
                "audio",
                "folder",
                "narrative",
                "slideshow",
                "progression",
                "comparison",
                "map",
                "maptimeline",
                "timeline"
            ],
            "scroll": false
        },
        "timeline": {
            "children": [
                "image",
                "video",
                "story",
                "file",
                "audio",
                "folder",
                "narrative",
                "slideshow",
                "progression",
                "comparison",
                "map",
                "maptimeline",
                "timeline"
            ],
            "scroll": false
        }
    },
    "Routes": {
        "SettingsOrganize": {
            "description": "",
            "help": "",
            "classes": "settings-pane"
        },
        "SettingsContentAdd": {
            "description": "",
            "help": "",
            "classes": "settings add-content"
        },
        "SettingsContentEdit": {
            "description": "",
            "help": "",
            "classes": "settings edit-content"
        },
        "SettingsContentConfirm": {
            "description": "",
            "help": "",
            "classes": "settings-pane"
        },
        "SettingsContent": {
            "description": "",
            "help": "",
            "classes": "settings-pane"
        },
        "SettingsManageContext": {
            "description": "",
            "help": "",
            "classes": "settings-manage"
        },
        "SettingsExport": {
            "description": "",
            "help": "",
            "classes": "settings-pane"
        },
        "SettingsStatistics": {
            "description": "",
            "help": "",
            "classes": "settings-pane"
        },
        "SettingsAppearance": {
            "description": "",
            "help": "",
            "classes": "settings-pane"
        },
        "SettingsHomepage": {
            "description": "",
            "help": "",
            "classes": "settings-pane"
        },
        "SettingsCanvas": {
            "description": "",
            "help": "",
            "classes": "settings-pane"
        },
        "SettingsSearch": {
            "description": "",
            "help": "",
            "classes": "settings-pane"
        },
        "SettingsNavigation": {
            "description": "",
            "help": "",
            "classes": "settings-pane"
        },
        "SettingsImport": {
            "description": "",
            "help": "",
            "classes": "import"
        },
        "SettingsUsers": {
            "description": "",
            "help": "",
            "classes": "settings-pane"
        },
        "SettingsGeneral": {
            "description": "",
            "help": "",
            "classes": "settings-pane"
        },
        "Settings": {
            "description": "",
            "help": "",
            "classes": "settings-pane"
        },
        "Help": {
            "description": "",
            "help": "",
            "classes": "help"
        },
        "Login": {
            "description": "",
            "help": "",
            "classes": "login login-page"
        },
        "Logout": {
            "description": "",
            "help": "",
            "classes": ""
        },
        "Profile": {
            "description": "",
            "help": "",
            "classes": ""
        },
        "BrowseLTI": {
            "description": "",
            "help": "",
            "classes": "browse browse-lti"
        },
        "Search": {
            "description": "",
            "help": "",
            "classes": "search"
        },
        "Browse": {
            "description": "",
            "help": "",
            "classes": "browse"
        },
        "ItemInLTI": {
            "description": "",
            "help": "",
            "classes": ""
        },
        "Primary": {
            "description": "",
            "help": "",
            "classes": "item"
        },
        "Welcome": {
            "description": "",
            "help": "",
            "classes": "homepage"
        }
    },
    "Data": {
       
    }
}