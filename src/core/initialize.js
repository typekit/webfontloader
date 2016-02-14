goog.provide('webfont');

goog.require('webfont.WebFont');

goog.require('webfont.modules.Typekit');
goog.require('webfont.modules.Fontdeck');
goog.require('webfont.modules.Monotype');
goog.require('webfont.modules.Custom');
goog.require('webfont.modules.google.GoogleFontApi');

/**
 * @define {boolean}
 */
var INCLUDE_CUSTOM_MODULE = false;

/**
 * @define {boolean}
 */
var INCLUDE_FONTDECK_MODULE = false;

/**
 * @define {boolean}
 */
var INCLUDE_MONOTYPE_MODULE = false;

/**
 * @define {boolean}
 */
var INCLUDE_TYPEKIT_MODULE = false;

/**
 * @define {boolean}
 */
var INCLUDE_GOOGLE_MODULE = false;

/**
 * @define {string}
 */
var WEBFONT = 'WebFont';

/**
 * @define {string}
 */
var WEBFONT_CONFIG = 'WebFontConfig';

/**
 * @type {webfont.WebFont}
 */
var webFontLoader = new webfont.WebFont(window);

if (INCLUDE_CUSTOM_MODULE) {
  webFontLoader.addModule(webfont.modules.Custom.NAME, function (configuration, domHelper) {
    return new webfont.modules.Custom(domHelper, configuration);
  });
}

if (INCLUDE_FONTDECK_MODULE) {
  webFontLoader.addModule(webfont.modules.Fontdeck.NAME, function (configuration, domHelper) {
    return new webfont.modules.Fontdeck(domHelper, configuration);
  });
}

if (INCLUDE_MONOTYPE_MODULE) {
  webFontLoader.addModule(webfont.modules.Monotype.NAME, function (configuration, domHelper) {
    return new webfont.modules.Monotype(domHelper, configuration);
  });
}

if (INCLUDE_TYPEKIT_MODULE) {
  webFontLoader.addModule(webfont.modules.Typekit.NAME, function (configuration, domHelper) {
    return new webfont.modules.Typekit(domHelper, configuration);
  });
}

if (INCLUDE_GOOGLE_MODULE) {
  webFontLoader.addModule(webfont.modules.google.GoogleFontApi.NAME, function (configuration, domHelper) {
    return new webfont.modules.google.GoogleFontApi(domHelper, configuration);
  });
}

var exports = {
  'load': goog.bind(webFontLoader.load, webFontLoader)
};

if (typeof define === "function" && define.amd) {
  define(function () {
    return exports;
  });
} else if (typeof module !== "undefined" && module.exports) {
  module.exports = exports;
} else {
  window[WEBFONT] = exports;

  if (window[WEBFONT_CONFIG]) {
    webFontLoader.load(window[WEBFONT_CONFIG]);
  }
}
