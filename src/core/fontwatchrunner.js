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
webfont.FontWatchRunner = function(activeCallback, inactiveCallback, domHelper,
    fontSizer, asyncCall, getTime, fontFamily, fontDescription, opt_fontTestString) {
  this.activeCallback_ = activeCallback;
  this.inactiveCallback_ = inactiveCallback;
  this.domHelper_ = domHelper;
  this.fontSizer_ = fontSizer;
  this.asyncCall_ = asyncCall;
  this.getTime_ = getTime;
  this.nameHelper_ = new webfont.CssFontFamilyName();
  this.fvd_ = new webfont.FontVariationDescription();
  this.fontFamily_ = fontFamily;
  this.fontDescription_ = fontDescription;
  this.fontTestString_ = opt_fontTestString || webfont.FontWatchRunner.DEFAULT_TEST_STRING;
  this.originalSizeA_ = this.getDefaultFontSize_(
      webfont.FontWatchRunner.DEFAULT_FONTS_A);
  this.originalSizeB_ = this.getDefaultFontSize_(
      webfont.FontWatchRunner.DEFAULT_FONTS_B);
  this.lastObservedSizeA_ = this.originalSizeA_;
  this.lastObservedSizeB_ = this.originalSizeB_;
  this.requestedFontA_ = this.createHiddenElementWithFont_(
      webfont.FontWatchRunner.DEFAULT_FONTS_A);
  this.requestedFontB_ = this.createHiddenElementWithFont_(
      webfont.FontWatchRunner.DEFAULT_FONTS_B);
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

webfont.FontWatchRunner.prototype.start = function() {
  this.started_ = this.getTime_();
  this.check_();
};

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
      this.lastObservedSizeA_ == sizeA && this.lastObservedSizeB_ == sizeB) {
    this.finish_(this.activeCallback_);
  } else if (this.getTime_() - this.started_ >= 5000) {
    this.finish_(this.inactiveCallback_);
  } else {
    this.lastObservedSizeA_ = sizeA;
    this.lastObservedSizeB_ = sizeB;
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
  var styleString = this.computeStyleString_(defaultFonts,
      this.fontDescription_, opt_withoutFontFamily);
  var span = this.domHelper_.createElement('span', { 'style': styleString },
      this.fontTestString_);

  this.domHelper_.insertInto('body', span);
  return span;
};

webfont.FontWatchRunner.prototype.computeStyleString_ = function(defaultFonts,
    fontDescription, opt_withoutFontFamily) {
  var variationCss = this.fvd_.expand(fontDescription);
  var styleString = "position:absolute;top:-999px;left:-999px;" +
      "font-size:300px;width:auto;height:auto;line-height:normal;margin:0;" +
      "padding:0;font-variant:normal;font-family:"
      + (opt_withoutFontFamily ? "" :
        this.nameHelper_.quote(this.fontFamily_) + ",")
      + defaultFonts + ";" + variationCss;
  return styleString;
};
