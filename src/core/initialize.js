goog.provide('webfont');

goog.require('webfont.WebFont');

goog.require('webfont.TypekitScript');
goog.require('webfont.AscenderScript');
goog.require('webfont.FontdeckScript');
goog.require('webfont.MonotypeScript');
goog.require('webfont.CustomCss');
goog.require('webfont.GoogleFontApi');

/**
 * @typedef {Object.<string, Array.<string>>}
 */
webfont.FontTestStrings;

/**
 * @define {boolean}
 */
var INCLUDE_ASCENDER_MODULE = false;

/**
 * @define {boolean}
 */
var INCLUDE_CUSTOM_MODULE = true;

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
var webFontLoader = new webfont.WebFont(goog.global);

if (INCLUDE_ASCENDER_MODULE) {
  webFontLoader.addModule('ascender', function (configuration, domHelper) {
    return new webfont.AscenderScript(domHelper, configuration);
  });
}

if (INCLUDE_CUSTOM_MODULE) {
  webFontLoader.addModule('custom', function (configuration, domHelper) {
    return new webfont.CustomCss(domHelper, configuration);
  });
}

if (INCLUDE_FONTDECK_MODULE) {
  webFontLoader.addModule('fontdeck', function (configuration, domHelper) {
    return new webfont.FontdeckScript(domHelper, configuration);
  });
}

if (INCLUDE_MONOTYPE_MODULE) {
  webFontLoader.addModule('monotype', function (configuration, domHelper) {
    return new webfont.MonotypeScript(domHelper, configuration);
  });
}

if (INCLUDE_TYPEKIT_MODULE) {
  webFontLoader.addModule('typekit', function (configuration, domHelper) {
    return new webfont.TypekitScript(domHelper, configuration);
  });
}

if (INCLUDE_GOOGLE_MODULE) {
  webFontLoader.addModule('google', function (configuration, domHelper) {
    return new webfont.GoogleFontApi(domHelper, configuration);
  });
}

if (!goog.global[WEBFONT]) {
  goog.global[WEBFONT] = {};
  goog.global[WEBFONT]['load'] = webFontLoader.load;

  if (goog.global[WEBFONT_CONFIG]) {
    webFontLoader.load(goog.global[WEBFONT_CONFIG]);
  }
}
