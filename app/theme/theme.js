// @Tim 02-28-2015 - http://www.davidhalford.com/thoughts/2013/auto-contrasting-text/

import ClassManagement from "class.management"
/**
 * Helper functions for getting good colors when setting the site colros
 */
class Theme {
  constructor() { }

  Initialize() {

    // Install override skin
    if (Mediakron.skins[Mediakron.Site.Appearance.skin]) {
      $("#skin").attr(
        "href",
        Mediakron.Site.cssURL +
        "skins/" +
        Mediakron.Site.Appearance.skin
      );
    }

    // Add logo from appearance settings
    $("#site-logo").html(Mediakron.Image.logo("medium"));

    // Insert site name/ 
    $("#branding a").click(Mediakron.linkHandle);

    // Insert copyright information
    $("#copyright").text(
      Mediakron.Site.copyright
    );

    // Menu Style - horizontal or sidebar
    if (Mediakron.Site.Appearance.navigation)
      ClassManagement.swap(
        "default-nav menu-vertical menu-horizontal",
        Mediakron.Site.Appearance.navigation
      );

    // ==== Custom appearance styles ====
    var dynamicStyles = "";
    var banner = Mediakron.Site.Appearance.colors.banner;
    var banner_rgb = convertHex(banner, 100);
    var banner_transparent = convertHex(banner, 0);
    if (Mediakron.Site.Appearance.colors.banner) {
      // Background color set in appearance settings
    }

    // Site font
    if (Mediakron.Site.Appearance.font) {
      // Apply custom font from appearance settings
      if (
        Mediakron.Site.Appearance.fonts[Mediakron.Site.Appearance.font]
      ) {
        var sitefont = Mediakron.Site.Appearance.font,
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
            Mediakron.Site.Appearance.fonts[
            Mediakron.Site.Appearance.font
            ]
          );
        }
      }
    }

  }

  // ==== Color Functions ====

  /**
   * Get contrasting colors
   * @param {string} hex
   */
  getContrastColor(hex) {
    var threshold = 130,
      hRed = hexToR(hex),
      hGreen = hexToG(hex),
      hBlue = hexToB(hex);

    hexToR(h) {
      return parseInt(cutHex(h).substring(0, 2), 16);
    }

    hexToG(h) {
      return parseInt(cutHex(h).substring(2, 4), 16);
    }

    hexToB(h) {
      return parseInt(cutHex(h).substring(4, 6), 16);
    }

    cutHex(h) {
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

    hexToR(h) {
      return parseInt(cutHex(h).substring(0, 2), 16);
    }

    hexToG(h) {
      return parseInt(cutHex(h).substring(2, 4), 16);
    }

    hexToB(h) {
      return parseInt(cutHex(h).substring(4, 6), 16);
    }

    cutHex(h) {
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

    hexToR(h) {
      return parseInt(cutHex(h).substring(0, 2), 16);
    }

    hexToG(h) {
      return parseInt(cutHex(h).substring(2, 4), 16);
    }

    hexToB(h) {
      return parseInt(cutHex(h).substring(4, 6), 16);
    }

    cutHex(h) {
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

    hexToR(h) {
      return parseInt(cutHex(h).substring(0, 2), 16);
    }

    hexToG(h) {
      return parseInt(cutHex(h).substring(2, 4), 16);
    }

    hexToB(h) {
      return parseInt(cutHex(h).substring(4, 6), 16);
    }

    cutHex(h) {
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

    hexToR(h) {
      return parseInt(cutHex(h).substring(0, 2), 16);
    }

    hexToG(h) {
      return parseInt(cutHex(h).substring(2, 4), 16);
    }

    hexToB(h) {
      return parseInt(cutHex(h).substring(4, 6), 16);
    }

    cutHex(h) {
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
    else if (b < 0) b = 0;
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

    hexToR(h) {
      return parseInt(cutHex(h).substring(0, 2), 16);
    }

    hexToG(h) {
      return parseInt(cutHex(h).substring(2, 4), 16);
    }

    hexToB(h) {
      return parseInt(cutHex(h).substring(4, 6), 16);
    }

    cutHex(h) {
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
