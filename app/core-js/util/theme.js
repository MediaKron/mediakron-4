// @Tim 02-28-2015 - http://www.davidhalford.com/thoughts/2013/auto-contrasting-text/
/**
 * Helper functions for getting good colors when setting the site colros
 */
/**
 * Get contrasting colors
 * @param {string} hex 
 */
function getContrastColor(hex) {
  threshold = 130;
  hRed = hexToR(hex);
  hGreen = hexToG(hex);
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
    return "#ffffff";
  }
}

/**
 * get contrast against white background
 * @param {string} hex 
 */
function getContrastOnWhite(hex) {
  var original = hex;
  threshold = 200;
  hRed = hexToR(hex);
  hGreen = hexToG(hex);
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
function getContrastOnWhiteColor(hex) {
  var original = hex;
  threshold = 200;
  hRed = hexToR(hex);
  hGreen = hexToG(hex);
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
function getContrastTintLight(hex) {
  threshold = 130;
  hRed = hexToR(hex);
  hGreen = hexToG(hex);
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
function getContrastTint(hex) {
  threshold = 130;
  hRed = hexToR(hex);
  hGreen = hexToG(hex);
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
function LightenDarkenColor(col, amt) {
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
function getTint(hex) {
  threshold = 130;
  hRed = hexToR(hex);
  hGreen = hexToG(hex);
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
function convertHex(hex, opacity) {
  hex = hex.replace("#", "");
  r = parseInt(hex.substring(0, 2), 16);
  g = parseInt(hex.substring(2, 4), 16);
  b = parseInt(hex.substring(4, 6), 16);
  result = "rgba(" + r + "," + g + "," + b + "," + opacity / 100 + ")";
  return result;
}

export {
    convertHex,
    getContrastColor,
    getContrastOnWhite,
    getContrastOnWhiteColor,
    getContrastTint,
    getContrastTintLight,
    getTint
}
