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
  this.originalSize_ = this.getDefaultFontSize_(
      webfont.FontWatchRunner.DEFAULT_FONTS);
  this.lastObservedSize_ = this.originalSize_;
  this.requestedFont_ = this.createHiddenElementWithFont_(
      webfont.FontWatchRunner.DEFAULT_FONTS);
  this.started_ = getTime();
  this.check_();
};

/**
 * Because of the quotes on most platform this font will get the default
 * browser font. The text could have been anything. We have found however
 * that on Chrome linux, this will also help in getting the proper default
 * browser font.
 * @type {string}
 * @const
 */
webfont.FontWatchRunner.DEFAULT_FONTS = "'sans-serif'";

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
  var size = this.fontSizer_.getWidth(this.requestedFont_);

  if (this.originalSize_ != size && this.lastObservedSize_ == size) {
    this.finish_(this.activeCallback_);
  } else if (this.getTime_() - this.started_ >= 5000) {
    this.finish_(this.inactiveCallback_);
  } else {
    this.lastObservedSize_ = size;
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
  this.domHelper_.removeElement(this.requestedFont_);
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
