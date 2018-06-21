// @Tim 02-28-2015 - http://www.davidhalford.com/thoughts/2013/auto-contrasting-text/
import $ from "jquery"
import Link from "../core-js/util/link"
import Image from "../core-js/util/image";
import * as colorUtilities from "../core-js/util/color-utilities";

//colorUtilities.getTint();
/**
 * Helper functions for getting good colors when setting the site colros
 */
export default class Theme {
  constructor() {   }

  Initialize() {

    // Install override skin
    /*
    Depricated
    if (Mediakron.skins[Mediakron.Settings.Appearance.skin]) {
      $("#skin").attr(
        "href",
        Mediakron.Settings.cssURL +
        "skins/" +
        Mediakron.Settings.Appearance.skin
      );
    }*/

    // Add logo from appearance settings
    $("#site-logo").html(Image.logo("medium"));

    // Insert site name/ 
    $("#branding a").click(Mediakron.linkHandle);

    // Insert copyright information
    $("#copyright").text(
      Mediakron.Settings.copyright
    );

    // Menu Style - horizontal or sidebar
    if (Mediakron.Settings.Appearance.navigation) {
      Mediakron.ClassManagement.swap(
        "default-nav menu-vertical menu-horizontal",
        Mediakron.Settings.Appearance.navigation
      );
    }
    // ==== Custom appearance styles ====
    //var primaryColor = Mediakron.Settings.Appearance.colors.banner;
    var primaryColor = "red";
    var primaryColorContrast = colorUtilities.getContrastColor(primaryColor);
    var primaryColorOnWhite = colorUtilities.getContrastOnWhite(primaryColor);
    var primaryColorTint = colorUtilities.getTint(primaryColor);
    //var secondaryColor = Mediakron.Settings.Appearance.colors.bannerlink;
    var secondaryColor = "green";
    var secondaryColorContrast = colorUtilities.getContrastColor(secondaryColor);

    //var banner_rgb = this.convertHex(primaryColor, 100);
    //var banner_transparent = this.convertHex(primaryColor, 0);

    var root = document.querySelector(':root');
    root.style.setProperty("--mk-primary-color", primaryColor); 
    root.style.setProperty("--mk-primary-color-contrast", primaryColorContrast);
    root.style.setProperty("--mk-primary-color-onwhite", primaryColorOnWhite);
    root.style.setProperty("--mk-primary-color-tint", primaryColorTint);
    root.style.setProperty("--mk-secondary-color", secondaryColor);
    root.style.setProperty("--mk-secondary-color-contrast", secondaryColorContrast);
 
    // Site font
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
  }
}