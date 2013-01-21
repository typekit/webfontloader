/**
 * @constructor
 * @param {function(string, string)} activeCallback
 * @param {function(string, string)} inactiveCallback
 * @param {webfont.DomHelper} domHelper
 * @param {Object.<string, function(Object): webfont.Size>} fontSizer
 * @param {function(function(), number=)} asyncCall
 * @param {function(): number} getTime
 * @param {string} fontFamily
 * @param {string} fontDescription
 * @param {boolean} hasWebKitFallbackBug
 * @param {Object.<string, boolean>=} opt_metricCompatibleFonts
 * @param {string=} opt_fontTestString
 */
webfont.FontWatchRunner = function(activeCallback, inactiveCallback, domHelper,
    fontSizer, asyncCall, getTime, fontFamily, fontDescription, hasWebKitFallbackBug, opt_metricCompatibleFonts, opt_fontTestString) {
  this.activeCallback_ = activeCallback;
  this.inactiveCallback_ = inactiveCallback;
  this.domHelper_ = domHelper;
  this.fontSizer_ = fontSizer;
  this.asyncCall_ = asyncCall;
  this.getTime_ = getTime;
  this.fontFamily_ = fontFamily;
  this.fontDescription_ = fontDescription;
  this.fontTestString_ = opt_fontTestString || webfont.FontWatchRunner.DEFAULT_TEST_STRING;
  this.hasWebKitFallbackBug_ = hasWebKitFallbackBug;
  this.lastResortSizes_ = {};

  this.metricCompatibleFonts_ = opt_metricCompatibleFonts || null;

  this.fontRulerA_ = new webfont.FontRuler(this.domHelper_, this.fontSizer_, this.fontTestString_);
  this.fontRulerA_.insert();
  this.fontRulerB_ = new webfont.FontRuler(this.domHelper_, this.fontSizer_, this.fontTestString_);
  this.fontRulerB_.insert();

  this.setupLastResortSizes_();
};

/**
 * @enum {string}
 * @const
 */
webfont.FontWatchRunner.LastResortFonts = {
  SERIF: 'serif',
  SANS_SERIF: 'sans-serif',
  MONOSPACE: 'monospace',
  // Apple Color Emoji is the last character fallback on iOS. Since
  // all iOS installations that support web fonts have this font it
  // effectively means that Apple Color Emoji is the last resort
  // font on iOS. The caveat is that it only has characters in the
  // Emoji code range, and falls back to the real last resort font,
  // which is the default sans-serif font. It however affects the
  // height of the span we are monitoring, so we'll have to include
  // it in our list of last resort fonts.
  EMOJI: 'Apple Color Emoji'
};

/**
 * Default test string. Characters are chosen so that their widths vary a lot
 * between the fonts in the default stacks. We want each fallback stack
 * to always start out at a different width than the other.
 * @type {string}
 * @const
 */
webfont.FontWatchRunner.DEFAULT_TEST_STRING = 'BESbswy';

/**
 * @private
 */
webfont.FontWatchRunner.prototype.setupLastResortSizes_ = function() {
  var fontRuler = new webfont.FontRuler(this.domHelper_, this.fontSizer_, this.fontTestString_);

  fontRuler.insert();

  for (var font in webfont.FontWatchRunner.LastResortFonts) {
    if (webfont.FontWatchRunner.LastResortFonts.hasOwnProperty(font)) {
      fontRuler.setFont(webfont.FontWatchRunner.LastResortFonts[font], this.fontDescription_);
      this.lastResortSizes_[webfont.FontWatchRunner.LastResortFonts[font]] = fontRuler.getSize();
    }
  }
  fontRuler.remove();
};

webfont.FontWatchRunner.prototype.start = function() {
  this.started_ = this.getTime_();

  this.fontRulerA_.setFont(this.fontFamily_ + ',' + webfont.FontWatchRunner.LastResortFonts.SERIF, this.fontDescription_);
  this.fontRulerB_.setFont(this.fontFamily_ + ',' + webfont.FontWatchRunner.LastResortFonts.SANS_SERIF, this.fontDescription_);

  this.check_();
};

/**
 * Returns true if the given size matches the generic font family size.
 *
 * @private
 * @param {?webfont.Size} size
 * @param {string} lastResortFont
 * @return {boolean}
 */
webfont.FontWatchRunner.prototype.sizeMatches_ = function(size, lastResortFont) {
  return size.equals(this.lastResortSizes_[lastResortFont]);
};

/**
 * Return true if the given sizes match any of the generic font family
 * sizes.
 *
 * @private
 * @param {?webfont.Size} a
 * @param {?webfont.Size} b
 * @return {boolean}
 */
webfont.FontWatchRunner.prototype.sizesMatchLastResortSizes_ = function(a, b) {
  for (var font in webfont.FontWatchRunner.LastResortFonts) {
    if (webfont.FontWatchRunner.LastResortFonts.hasOwnProperty(font)) {
      if (this.sizeMatches_(a, webfont.FontWatchRunner.LastResortFonts[font]) &&
          this.sizeMatches_(b, webfont.FontWatchRunner.LastResortFonts[font])) {
        return true;
      }
    }
  }
  return false;
};

/**
 * @private
 * Returns true if the loading has timed out.
 * @return {boolean}
 */
webfont.FontWatchRunner.prototype.hasTimedOut_ = function() {
  return this.getTime_() - this.started_ >= 5000;
};

/**
 * Checks the size of the two spans against their original sizes during each
 * async loop. If the size of one of the spans is different than the original
 * size, then we know that the font is rendering and finish with the active
 * callback. If we wait more than 5 seconds and nothing has changed, we finish
 * with the inactive callback.
 *
 * @private
 */
webfont.FontWatchRunner.prototype.check_ = function() {
  var sizeA = this.fontRulerA_.getSize();
  var sizeB = this.fontRulerB_.getSize();

  if ((this.sizeMatches_(sizeA, webfont.FontWatchRunner.LastResortFonts.SERIF) && this.sizeMatches_(sizeB, webfont.FontWatchRunner.LastResortFonts.SANS_SERIF)) ||
      (this.hasWebKitFallbackBug_ && this.sizesMatchLastResortSizes_(sizeA, sizeB))) {
    if (this.hasTimedOut_()) {
      if (this.hasWebKitFallbackBug_ &&
          this.sizesMatchLastResortSizes_(sizeA, sizeB) &&
          (this.metricCompatibleFonts_ === null || this.metricCompatibleFonts_.hasOwnProperty(this.fontFamily_))) {
        this.finish_(this.activeCallback_);
      } else {
        this.finish_(this.inactiveCallback_);
      }
    } else {
      this.asyncCheck_();
    }
  } else {
    this.finish_(this.activeCallback_);
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
  this.fontRulerA_.remove();
  this.fontRulerB_.remove();
  callback(this.fontFamily_, this.fontDescription_);
};
