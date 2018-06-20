// @Tim 02-28-2015 - http://www.davidhalford.com/thoughts/2013/auto-contrasting-text/

import ClassManagement from "class.management"
/**
 * Helper functions for getting good colors when setting the site colros
 */
class Theme {
  constructor() {}

  Initialize() {
    if (Mediakron.Site.Appearance.navigation)
      ClassManagement.swap(
        "default-nav menu-vertical menu-horizontal",
        Mediakron.Settings.Appearance.navigation
      );
    $("#site-name a").text(Mediakron.Settings.name);
    $("#branding a").click(Mediakron.linkHandle);
    $("#copyright").text(
      Mediakron.Settings.copyright
    ); /* Sidebar menu - mobile */
    $(".mobile-nav-button").click(function() {
      $("#navbar").toggleClass("is-visible");
      $(".fade-screen").toggleClass("is-visible");
      //            $('#main-container').toggleClass('content-push-mobile');
    }); /* Sidebar menu - large screen  */
    $(".fade-screen, #navbar.is-visible .close-button-mobile").click(
      function() {
        $("#navbar").removeClass("is-visible");
        $(".fade-screen").removeClass("is-visible");
        //            $('#main-container').removeClass('content-push-mobile');
      }
    ); /* Full-screen view    */
    $(".fullscreen-nav-toggle").click(function() {
      $("#header").toggleClass("is-visible");
    }); /* Sidebar menu - large screen  */
    $(".fade-screen").click(function() {
      $(".fade-screen").removeClass("is-visible");
      $("#main-container").removeClass("content-push");
    });
    $(".toggle-search").click(function() {
      $(".search-pane")
        .removeClass("closed")
        .addClass("opened"); /* close search overlay */
      $("#search-field").focus(); /* give the search box focus  */
    });
    $("#search .close-button").click(function() {
      $(".search-pane")
        .removeClass("opened")
        .addClass("closed"); /* close search overlay */
      $(".toggle-search").focus(); /* return focus to search toggle button */
    });
    // Install override skin
    if (Mediakron.skins[Mediakron.Settings.Appearance.skin]) {
      $("#skin").attr(
        "href",
        Mediakron.Settings.cssURL +
          "skins/" +
          Mediakron.Settings.Appearance.skin
      );
    }
    // ==== Custom appearance styles ====
    var dynamicStyles = "";
    var banner = Mediakron.Settings.Appearance.colors.banner;
    var banner_rgb = convertHex(banner, 100);
    var banner_transparent = convertHex(banner, 0);
    if (Mediakron.Settings.Appearance.colors.banner) {
      // Background color set in appearance settings
      dynamicStyles =
        ".primary-background, #mediakron #login-submit, #login-banner, #mediakron #header, #mediakron .sticky-filters #content-filters,  #messages .alert-success, #mediakron .btn-primary, #mediakron .btn-primary a, #mediakron .btn-success, #content-filter li.search-choice, #content-user .chosen-container-single .chosen-single, .settings-pane .overlay header, .overlay header.admin-style-header, .search-pane.opened .overlay header, .site-loader#progress-bar, .edit-story .wysiwyg, .edit-story .wysiwyg-headers-inner, cite.annotation.highlight, cite.annotation.highlight, cite.annotation.contains-sup sup:hover, sup.contains-cite:hover, cite.annotation.highlight, cite.annotation.contains-sup.highlight sup, sup.contains-cite.highlight, .home-menus--grid .homepage-menu-title, #navbar .dropdown-container li.dropdown-title, .home-image--half .home-template__info, .home-image--full .home-template__info,  .timeline-category .add-category, .folder-navigation .mk-icon, .folder-navigation a:hover { background-color:" +
        Mediakron.Settings.Appearance.colors.banner +
        "; }";

      // Linear gradient background for site-loader
      //            dynamicStyles = dynamicStyles + '.site-loader .progress { background: linear-gradient(to left, ' + Mediakron.Settings.Appearance.colors.banner + ', ' + Mediakron.Settings.Appearance.colors.banner + ' 20%, rgba(255,255,255,0));}';
      //
      // Linear gradient background fade left
      dynamicStyles =
        dynamicStyles +
        ".menu-horizontal #nav-main { background: linear-gradient(to left, " +
        banner_rgb +
        ", " +
        banner_rgb +
        " 90%, " +
        banner_transparent +
        ");}";
      dynamicStyles =
        dynamicStyles +
        ".menu-horizontal #nav-main { background: -webkit-linear-gradient(right, " +
        banner_rgb +
        " 0%," +
        banner_rgb +
        " 85%," +
        banner_transparent +
        " 100%);}"; /* Chrome10-25,Safari5.1-6 */
      // Linear gradient background fade right
      dynamicStyles =
        dynamicStyles +
        "h1.page-header { background: linear-gradient(to right, " +
        banner_rgb +
        ", " +
        banner_rgb +
        " 90%, " +
        banner_transparent +
        ");}";
      dynamicStyles =
        dynamicStyles +
        "h1.page-header { background: -webkit-linear-gradient(left, " +
        banner_rgb +
        " 0%," +
        banner_rgb +
        " 85%," +
        banner_transparent +
        " 100%);}"; /* Chrome10-25,Safari5.1-6 */

      // Provide contrasting background color
      dynamicStyles =
        dynamicStyles +
        ".settings-pane .overlay .page-options .mk-icon.mk-close::before, .settings-pane .overlay .page-options .mk-icon.mk-close::after, .search-pane .overlay .page-options .mk-icon.mk-close::before, .search-pane .overlay .page-options .mk-icon.mk-close::after, .overlay header.admin-style-header .page-options .mk-icon.mk-close::before, .overlay header.admin-style-header .page-options .mk-icon.mk-close::after, .add-content .edit-story .story-edit-page-options .page-options .mk-icon.mk-close::before, .add-content .edit-story .story-edit-page-options .page-options .mk-icon.mk-close::after, .editing-enabled .story-template .story-edit-page-options .page-options .mk-icon.mk-close::before, .editing-enabled .story-template .story-edit-page-options .page-options .mk-icon.mk-close::after, #navbar .close-modal .mk-icon.mk-close::after, #navbar .close-modal .mk-icon.mk-close::before, .edit-story .wlink-tool button, .folder-navigation a:hover .mk-icon { background-color:" +
        getContrastColor(Mediakron.Settings.Appearance.colors.banner) +
        "; }";

      // Provide contrasting font color
      dynamicStyles =
        dynamicStyles +
        "#mediakron .settings-pane .overlay header h2, .settings-pane .overlay header h1, #mediakron .settings-pane .overlay h2 .mk-icon, .overlay .page-options a, .overlay .page-options button, .add-story-header .page-options button.close-button, .overlay .page-options .option-help a, .add-story-header .page-options a, .add-story-header .page-options button, .search-pane.opened .overlay header h2,  .overlay header.admin-style-header h2, .overlay header.admin-style-header .mk-icon, .search-pane.opened .overlay header .mk-search, .edit-story .wysiwyg-button, .editing-enabled .story-template .story-edit-page-options .page-options .option-help a .mk-icon,  .timeline-category .add-category, .folder-previous .mk-arrow-left, .folder-navigation .mk-icon, .folder-navigation a:hover .mk-icon { color:" +
        getContrastColor(Mediakron.Settings.Appearance.colors.banner) +
        "; }";

      // border color same as background
      dynamicStyles =
        dynamicStyles +
        "{ border-color:" +
        Mediakron.Settings.Appearance.colors.banner +
        "; }";

      // font color same as background
      dynamicStyles =
        dynamicStyles +
        ".edit-story .wlink-tool button, #mediakron #navbar #user .mk-user.level-1, .folder-navigation a:hover .mk-icon { color:" +
        Mediakron.Settings.Appearance.colors.banner +
        "; }";

      // Provide contrast color for borders
      dynamicStyles =
        dynamicStyles +
        "#navbar .main-menu .add-menu-navbar.no-menus a, .site-loader#progress-bar { border-color: " +
        getContrastColor(Mediakron.Settings.Appearance.colors.banner) +
        "; }";

      // use color if it's dark enough on white background; otherwise, use black
      dynamicStyles =
        dynamicStyles +
        "cite.annotation.highlight, cite.annotation.highlight, cite.annotation.contains-sup sup:hover, sup.contains-cite:hover, cite.annotation.highlight, cite.annotation.contains-sup.highlight sup, sup.contains-cite.highlight { background:" +
        getContrastOnWhite(Mediakron.Settings.Appearance.colors.banner) +
        "; }";

      dynamicStyles =
        dynamicStyles +
        ".annotation-popup .mk-icon { color:" +
        getContrastOnWhite(Mediakron.Settings.Appearance.colors.banner) +
        "; }";

      dynamicStyles =
        dynamicStyles +
        ".annotation-popup, .annotation-item:hover, .annotation-item.highlight  { border-color: " +
        getContrastOnWhite(Mediakron.Settings.Appearance.colors.banner) +
        "; }";

      dynamicStyles =
        dynamicStyles +
        "cite.annotation.highlight, cite.annotation.highlight, cite.annotation.contains-sup sup:hover, sup.contains-cite:hover, cite.annotation.highlight, cite.annotation.contains-sup.highlight sup, sup.contains-cite.highlight {" +
        getContrastOnWhiteColor(Mediakron.Settings.Appearance.colors.banner) +
        " }";

      // Provide tinted color for borders
      dynamicStyles =
        dynamicStyles +
        " { border-color: " +
        getTint(Mediakron.Settings.Appearance.colors.banner) +
        "; }";

      // Provide tinted color for backgrounds
      dynamicStyles =
        dynamicStyles +
        ".site-loader .progress  { background-color: " +
        getTint(Mediakron.Settings.Appearance.colors.banner) +
        "; }";

      // Provide tinted color for color
      dynamicStyles =
        dynamicStyles +
        "{ color: " +
        getTint(Mediakron.Settings.Appearance.colors.banner) +
        "; }";

      // Provide underline color based on link color
      dynamicStyles =
        dynamicStyles +
        "#mediakron .contrast-tint { border-bottom: 1px solid " +
        Mediakron.Settings.Appearance.colors.bannerlink +
        "; }";
    }
    var bannerlink = Mediakron.Settings.Appearance.colors.bannerlink;
    banner_rgb = convertHex(banner, 100);
    if (Mediakron.Settings.Appearance.colors.bannerlink) {
      // Banner link color from appearance settings

      dynamicStyles =
        dynamicStyles +
        ".secondary-font, #mediakron #login-submit, #mediakron #header a, #mediakron #header .mk-icon, #mediakron #header button, .sticky-filters#content-manage h3, .add-menu-navbar a, .add-menu-navbar .mk-icon, #messages .alert-success, #mediakron .btn-primary, #mediakron .btn-success, #login-banner a, .loading-message,  #content-filter li.search-choice,  #content-user .chosen-container-single .chosen-single span, .site-loader #progress-text, .home-menus--grid .homepage-menu-title, #navbar .dropdown-container li.dropdown-title, .home-image--full h1, .home-image--half h1, .home-image--full .subtitle, .home-image--half .subtitle  { color:" +
        Mediakron.Settings.Appearance.colors.bannerlink +
        "; }";

      dynamicStyles =
        dynamicStyles +
        "#navbar #user .mk-user.level-1, .secondary-menu li.level-1:hover { background:" +
        Mediakron.Settings.Appearance.colors.bannerlink +
        "; }";
    }
    if (dynamicStyles) {
      // Apply custom styles to page
      $('<style type="text/css">' + dynamicStyles + "</style>").appendTo(
        "head"
      );
    }
    if (Mediakron.Settings.Appearance.font) {
      // Apply custom font from appearance settings
      if (
        Mediakron.Settings.Appearance.fonts[Mediakron.Settings.Appearance.font]
      ) {
        var sitefont = Mediakron.Settings.Appearance.font,
          googlefont = false,
          bodyfont;
        if (sitefont == "Roboto" || sitefont == "Roboto (san serif)") {
          googlefont = "Roboto:400,700";
          bodyfont = "font-roboto";
        }
        if (sitefont == "Merriweather" || sitefont == "Merriweather (serif)") {
          googlefont = "Merriweather";
          bodyfont = "font-merriweather";
        }
        // if (sitefont == "Open-Sans") { googlefont = 'Open+Sans:400,700'; bodyfont = 'font-open-sans'; }
        // if (sitefont == "Nunito") { googlefont = 'Nunito|Open+Sans'; bodyfont = 'font-nunito'; }
        // if (sitefont == "Roboto-Slab") { googlefont = 'Roboto+Slab|Roboto'; bodyfont = 'font-roboto-slab'; }
        // if (sitefont == "Alegreya") { googlefont = 'Alegreya:700|Roboto'; bodyfont = 'font-alegreya'; }
        // if (sitefont == "Amatic-Josefin-Sans") { googlefont = 'Josefin+Sans|Amatic+SC:700'; bodyfont = 'font-amatic-josefin-sans'; }
        // if (sitefont == "Playfair-Display") { googlefont = 'Playfair+Display:900|Source+Sans+Pro'; bodyfont = 'font-playfair'; }
        // if (sitefont == "Goudy-Book-Letter") { googlefont = 'Goudy+Bookletter+1911|Average+Sans'; bodyfont = 'font-goudy'; }
        if (googlefont) {
          $("head").append(
            '<link href="https://fonts.googleapis.com/css?family=' +
              googlefont +
              '" rel="stylesheet">'
          );
          $("body").addClass("" + bodyfont + "");
        } else {
          $("body").css(
            "font-family",
            Mediakron.Settings.Appearance.fonts[
              Mediakron.Settings.Appearance.font
            ]
          );
        }
      }
    }
    // Add logo from appearance settings
    $("#site-logo").html(Mediakron.Image.logo("medium"));
  }

  /**
   * Get contrasting colors
   * @param {string} hex
   */
  getContrastColor(hex) {
    var threshold = 130,
      hRed = hexToR(hex),
      hGreen = hexToG(hex),
      hBlue = hexToB(hex);

    function hexToR(h) {
      return parseInt(cutHex(h).substring(0, 2), 16);
    }

    function hexToG(h) {
      return parseInt(cutHex(h).substring(2, 4), 16);
    }

    function hexToB(h) {
      return parseInt(cutHex(h).substring(4, 6), 16);
    }

    function cutHex(h) {
      return h.charAt(0) == "#" ? h.substring(1, 7) : h;
    }
    var cBrightness = (hRed * 299 + hGreen * 587 + hBlue * 114) / 1000;
    if (cBrightness > threshold) {
      return "#000000";
    } else {
      return "#ffffff";
    }
  }

  /**
   * get contrast against white background
   * @param {string} hex
   */
  getContrastOnWhite(hex) {
    var original = hex,
      threshold = 200,
      hRed = hexToR(hex),
      hGreen = hexToG(hex),
      hBlue = hexToB(hex);

    function hexToR(h) {
      return parseInt(cutHex(h).substring(0, 2), 16);
    }

    function hexToG(h) {
      return parseInt(cutHex(h).substring(2, 4), 16);
    }

    function hexToB(h) {
      return parseInt(cutHex(h).substring(4, 6), 16);
    }

    function cutHex(h) {
      return h.charAt(0) == "#" ? h.substring(1, 7) : h;
    }
    cBrightness = (hRed * 299 + hGreen * 587 + hBlue * 114) / 1000;
    if (cBrightness > threshold) {
      return "#000000";
    } else {
      return original; /* if it's dark enough on white, return original color  */
    }
  }

  /**
   * use color if it's dark enough on white background; otherwise, use black
   * @param {string} hex
   */
  getContrastOnWhiteColor(hex) {
    var original = hex,
      threshold = 200,
      hRed = hexToR(hex),
      hGreen = hexToG(hex),
      hBlue = hexToB(hex);

    function hexToR(h) {
      return parseInt(cutHex(h).substring(0, 2), 16);
    }

    function hexToG(h) {
      return parseInt(cutHex(h).substring(2, 4), 16);
    }

    function hexToB(h) {
      return parseInt(cutHex(h).substring(4, 6), 16);
    }

    function cutHex(h) {
      return h.charAt(0) == "#" ? h.substring(1, 7) : h;
    }
    cBrightness = (hRed * 299 + hGreen * 587 + hBlue * 114) / 1000;
    if (cBrightness > threshold) {
      return "background: #000000; color:#fff";
    } else {
      return (
        "background:" + original + "; color: #fff"
      ); /* if it's dark enough on white, return original color  */
    }
  }

  /**
   * Get contrast Tin on light
   * @param {string} hex
   */
  getContrastTintLight(hex) {
    var threshold = 130,
      hRed = hexToR(hex),
      hGreen = hexToG(hex),
      hBlue = hexToB(hex);

    function hexToR(h) {
      return parseInt(cutHex(h).substring(0, 2), 16);
    }

    function hexToG(h) {
      return parseInt(cutHex(h).substring(2, 4), 16);
    }

    function hexToB(h) {
      return parseInt(cutHex(h).substring(4, 6), 16);
    }

    function cutHex(h) {
      return h.charAt(0) == "#" ? h.substring(1, 7) : h;
    }
    cBrightness = (hRed * 299 + hGreen * 587 + hBlue * 114) / 1000;
    if (cBrightness > threshold) {
      return "rgba(0, 0, 0, 0.5)";
    } else {
      return "rgba(250, 250, 250, 0.5)";
    }
  }

  /**
   * Get Contrast Tint
   * @param {*} hex
   */
  getContrastTint(hex) {
    var threshold = 130;
    (hRed = hexToR(hex)), (hGreen = hexToG(hex)), (hBlue = hexToB(hex));

    function hexToR(h) {
      return parseInt(cutHex(h).substring(0, 2), 16);
    }

    function hexToG(h) {
      return parseInt(cutHex(h).substring(2, 4), 16);
    }

    function hexToB(h) {
      return parseInt(cutHex(h).substring(4, 6), 16);
    }

    function cutHex(h) {
      return h.charAt(0) == "#" ? h.substring(1, 7) : h;
    }
    cBrightness = (hRed * 299 + hGreen * 587 + hBlue * 114) / 1000;
    if (cBrightness > threshold) {
      return "rgba(0, 0, 0, 0.1)";
    } else {
      return "rgba(250, 250, 250, 0.2)";
    }
  } /* http://jsfiddle.net/subodhghulaxe/t568u/  */

  //
  /**
   * Lighten a or darken a color
   * https://css-tricks.com/snippets/javascript/lighten-darken-color/
   * @param {string} col
   * @param {integer} amt
   */
  LightenDarkenColor(col, amt) {
    var usePound = false;
    if (col[0] == "#") {
      col = col.slice(1);
      usePound = true;
    }
    var num = parseInt(col, 16);
    var r = (num >> 16) + amt;
    if (r > 255) r = 255;
    else if (r < 0) r = 0;
    var b = ((num >> 8) & 0x00ff) + amt;
    if (b > 255) b = 255;
    else if (b < 0 ) b = 0;
    var g = (num & 0x0000ff) + amt;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
  }

  /**
   * Geta tint color
   * @param {string} hex
   */
  getTint(hex) {
    var threshold = 130,
      hRed = hexToR(hex),
      hGreen = hexToG(hex),
      hBlue = hexToB(hex);

    var Lighter = LightenDarkenColor(hex, 80);
    var Darker = LightenDarkenColor(hex, -40);

    function hexToR(h) {
      return parseInt(cutHex(h).substring(0, 2), 16);
    }

    function hexToG(h) {
      return parseInt(cutHex(h).substring(2, 4), 16);
    }

    function hexToB(h) {
      return parseInt(cutHex(h).substring(4, 6), 16);
    }

    function cutHex(h) {
      return h.charAt(0) == "#" ? h.substring(1, 7) : h;
    }
    cBrightness = (hRed * 299 + hGreen * 587 + hBlue * 114) / 1000;
    if (cBrightness > threshold) {
      return Darker;
    } else {
      return Lighter;
    }
  }

  /**
   * Convert a hex color to a rgba
   * @param {string} hex
   * @param {float} opacity
   */
  convertHex(hex, opacity) {
    hex = hex.replace("#", "");
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);
    var result = "rgba(" + r + "," + g + "," + b + "," + opacity / 100 + ")";
    return result;
  }
}

export default Theme
