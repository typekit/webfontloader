/**
 * @constructor
 * @param {function(string, string)} activeCallback
 * @param {function(string, string)} inactiveCallback
 * @param {webfont.DomHelper} domHelper
 * @param {Object.<string, function(Object): number>} fontSizer
 * @param {function(function(), number=)} asyncCall
 * @param {function(): number} getTime
 * @param {string} fontFamily
 * @param {string} fontDescription
 * @param {string=} opt_fontTestString
 */
webfont.FontWatchRunner = function(activeCallback, inactiveCallback, userAgent,
    domHelper, fontSizer, asyncCall, getTime, fontFamily, fontDescription,
    opt_fontTestString) {
  this.activeCallback_ = activeCallback;
  this.inactiveCallback_ = inactiveCallback;
  this.userAgent_ = userAgent;
  this.domHelper_ = domHelper;
  this.fontSizer_ = fontSizer;
  this.asyncCall_ = asyncCall;
  this.getTime_ = getTime;
  this.nameHelper_ = new webfont.CssFontFamilyName();
  this.fvd_ = new webfont.FontVariationDescription();
  this.fontFamily_ = fontFamily;
  this.fontDescription_ = fontDescription;
  this.fontTestString_ = opt_fontTestString || webfont.FontWatchRunner.DEFAULT_TEST_STRING;

  // While loading a web font webkit applies a last resort fallback font to the
  // element on which the web font is applied.
  // See file: WebKit/Source/WebCore/css/CSSFontFaceSource.cpp.
  // Looking at the different implementation for the different platforms,
  // the last resort fallback font is different. This code uses the default
  // OS/browsers values.
  if (this.userAgent_.getEngine() == "AppleWebKit") {
    if (this.userAgent_.getPlatform() == "Macintosh") {

      // See file: Source/WebCore/platform/graphics/mac/FontCacheMac.mm
      this.webKitFallbackFontSize_ = this.getDefaultFontSize_("Times");
    } else if (this.userAgent_.getName() == "Chrome") {
      if (this.userAgent_.getPlatform() == "Linux") {

        // On linux this is harder, it depends on the generic type of the
	// FontDescription, on my machine it looks like it is Sans by default.
        // See file: Source/WebCore/platform/graphics/chromium/
	//           FontCacheLinux.cpp
        this.webKitFallbackFontSize_ = this.getDefaultFontSize_("Sans");
      }
      if (this.userAgent_.getPlatform() == "Windows") {

	// See file: Source/WebCore/platform/graphics/chromium/
	//           FontCacheChromiumWin.cpp
	this.webKitFallbackFontSize_ = this.getDefaultFontSize_(
            "Arial");
      }
    } else {

      // Last resort try to give a name of a font that is unlikely to match any
      // font.
      this.webKitFallbackFontSize_ = this.getDefaultFontSize_("__not_a_font__");
    }
  }
  this.originalSizeA_ = this.getDefaultFontSize_(
      webfont.FontWatchRunner.DEFAULT_FONTS_A);
  this.originalSizeB_ = this.getDefaultFontSize_(
      webfont.FontWatchRunner.DEFAULT_FONTS_B);
  this.requestedFontA_ = this.createHiddenElementWithFont_(
      webfont.FontWatchRunner.DEFAULT_FONTS_A);
  this.requestedFontB_ = this.createHiddenElementWithFont_(
      webfont.FontWatchRunner.DEFAULT_FONTS_B);
  this.started_ = getTime();
  this.check_();
};

/**
 * A set of sans-serif fonts and a generic family that cover most platforms:
 * Windows - arial - 99.71%
 * Mac - arial - 97.67%
 * Linux - 97.67%
 * (Based on http://www.codestyle.org/css/font-family/sampler-CombinedResults.shtml)
 * @type {string}
 * @const
 */
webfont.FontWatchRunner.DEFAULT_FONTS_A = "arial,'URW Gothic L',sans-serif";

/**
 * A set of serif fonts and a generic family that cover most platforms. We
 * want each of these fonts to have a different width when rendering the test
 * string than each of the fonts in DEFAULT_FONTS_A:
 * Windows - Georgia - 98.98%
 * Mac - Georgia - 95.60%
 * Linux - Century Schoolbook L - 97.97%
 * (Based on http://www.codestyle.org/css/font-family/sampler-CombinedResults.shtml)
 * @type {string}
 * @const
 */
webfont.FontWatchRunner.DEFAULT_FONTS_B = "Georgia,'Century Schoolbook L',serif";

/**
 * Default test string. Characters are chosen so that their widths vary a lot
 * between the fonts in the default stacks. We want each fallback stack
 * to always start out at a different width than the other.
 * @type {string}
 * @const
 */
webfont.FontWatchRunner.DEFAULT_TEST_STRING = 'BESs';

/**
 * Checks the size of the two spans against their original sizes during each
 * async loop. If the size of one of the spans is different than the original
 * size, then we know that the font is rendering and finish with the active
 * callback. If we wait more than 5 seconds and nothing has changed, we finish
 * with the inactive callback.
 *
 * Because of an odd Webkit quirk, we wait to observe the new width twice
 * in a row before finishing with the active callback. Sometimes, Webkit will
 * render the spans with a changed width for one iteration even though the font
 * is broken. This only happens for one async loop, so waiting for 2 consistent
 * measurements allows us to work around the quirk.
 *
 * @private
 */
webfont.FontWatchRunner.prototype.check_ = function() {
  var sizeA = this.fontSizer_.getWidth(this.requestedFontA_);
  var sizeB = this.fontSizer_.getWidth(this.requestedFontB_);

  if ((this.originalSizeA_ != sizeA || this.originalSizeB_ != sizeB) &&
      !this.webKitFallbackFontSize_ ||
      (this.webKitFallbackFontSize_ != sizeA &&
       this.webKitFallbackFontSize_ != sizeB)) {
    this.finish_(this.activeCallback_);
  } else if (this.getTime_() - this.started_ >= 5000) {

    // In order to handle the fact that a font could be the same size as the
    // default browser font on a webkit browser, mark the font as active
    // after 5 seconds.
    this.finish_(this.webKitFallbackFontSize_ ?
        this.activeCallback_ : this.inactiveCallback_);
  } else {
    this.asyncCheck_();
  }
};

/**
 * @private
 */
webfont.FontWatchRunner.prototype.asyncCheck_ = function() {
  this.asyncCall_(function(context, func) {
    return function() {
      func.call(context);
    }
  }(this, this.check_), 25);
};

/**
 * @private
 * @param {function(string, string)} callback
 */
webfont.FontWatchRunner.prototype.finish_ = function(callback) {
  this.domHelper_.removeElement(this.requestedFontA_);
  this.domHelper_.removeElement(this.requestedFontB_);
  callback(this.fontFamily_, this.fontDescription_);
};

/**
 * @private
 * @param {string} defaultFonts
 */
webfont.FontWatchRunner.prototype.getDefaultFontSize_ = function(defaultFonts) {
  var defaultFont = this.createHiddenElementWithFont_(defaultFonts, true);
  var size = this.fontSizer_.getWidth(defaultFont);

  this.domHelper_.removeElement(defaultFont);
  return size;
};

/**
 * @private
 * @param {string} defaultFonts
 * @param {boolean=} opt_withoutFontFamily
 */
webfont.FontWatchRunner.prototype.createHiddenElementWithFont_ = function(
    defaultFonts, opt_withoutFontFamily) {
  var variationCss = this.fvd_.expand(this.fontDescription_);
  var styleString = "position:absolute;top:-999px;left:-999px;" +
    "font-size:300px;width:auto;height:auto;line-height:normal;margin:0;" +
    "padding:0;font-variant:normal;font-family:" + (opt_withoutFontFamily ? "" :
        this.nameHelper_.quote(this.fontFamily_) + ",") +
      defaultFonts + ";" + variationCss;
  var span = this.domHelper_.createElement('span', { 'style': styleString },
      this.fontTestString_);

  this.domHelper_.insertInto('body', span);
  return span;
};
