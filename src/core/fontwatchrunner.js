goog.provide('webfont.FontWatchRunner');

goog.require('webfont.FontRuler');

/**
 * @constructor
 * @param {function(webfont.Font)} activeCallback
 * @param {function(webfont.Font)} inactiveCallback
 * @param {webfont.DomHelper} domHelper
 * @param {webfont.Font} font
 * @param {webfont.BrowserInfo} browserInfo
 * @param {number=} opt_timeout
 * @param {Object.<string, boolean>=} opt_metricCompatibleFonts
 * @param {string=} opt_fontTestString
 */
webfont.FontWatchRunner = function(activeCallback, inactiveCallback, domHelper,
    font, browserInfo, opt_timeout, opt_metricCompatibleFonts, opt_fontTestString) {
  this.activeCallback_ = activeCallback;
  this.inactiveCallback_ = inactiveCallback;
  this.domHelper_ = domHelper;
  this.font_ = font;
  this.fontTestString_ = opt_fontTestString || webfont.FontWatchRunner.DEFAULT_TEST_STRING;
  this.browserInfo_ = browserInfo;
  this.lastResortSizes_ = {};
  this.timeout_ = opt_timeout || 5000;

  this.metricCompatibleFonts_ = opt_metricCompatibleFonts || null;

  this.fontRulerA_ = null;
  this.fontRulerB_ = null;

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

goog.scope(function () {
  var FontWatchRunner = webfont.FontWatchRunner,
      FontRuler = webfont.FontRuler;

  /**
   * @private
   */
  FontWatchRunner.prototype.setupLastResortSizes_ = function() {
    var fontRuler = new FontRuler(this.domHelper_, this.fontTestString_),
        variation = this.font_.getVariation().toString();

    fontRuler.insert();

    for (var font in FontWatchRunner.LastResortFonts) {
      if (FontWatchRunner.LastResortFonts.hasOwnProperty(font)) {
        fontRuler.setFont(FontWatchRunner.LastResortFonts[font], variation);
        this.lastResortSizes_[FontWatchRunner.LastResortFonts[font]] = fontRuler.getSize();
      }
    }
    fontRuler.remove();
  };

  FontWatchRunner.prototype.start = function() {
    this.fontRulerA_ = new FontRuler(this.domHelper_, this.fontTestString_);
    this.fontRulerA_.insert();
    this.fontRulerB_ = new FontRuler(this.domHelper_, this.fontTestString_);
    this.fontRulerB_.insert();

    this.started_ = goog.now();

    this.fontRulerA_.setFont(this.font_.getName() + ',' + FontWatchRunner.LastResortFonts.SERIF, this.font_.getVariation().toString());
    this.fontRulerB_.setFont(this.font_.getName() + ',' + FontWatchRunner.LastResortFonts.SANS_SERIF, this.font_.getVariation().toString());

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
  FontWatchRunner.prototype.sizeMatches_ = function(size, lastResortFont) {
    if (this.browserInfo_.hasWebKitMetricsBug()) {
      return size.equalsWidth(this.lastResortSizes_[lastResortFont]);
    } else {
      return size.equals(this.lastResortSizes_[lastResortFont]);
    }
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
  FontWatchRunner.prototype.sizesMatchLastResortSizes_ = function(a, b) {
    for (var font in FontWatchRunner.LastResortFonts) {
      if (FontWatchRunner.LastResortFonts.hasOwnProperty(font)) {
        if (this.sizeMatches_(a, FontWatchRunner.LastResortFonts[font]) &&
            this.sizeMatches_(b, FontWatchRunner.LastResortFonts[font])) {
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
  FontWatchRunner.prototype.hasTimedOut_ = function() {
    return goog.now() - this.started_ >= this.timeout_;
  };

  /**
   * Returns true if both fonts match the normal fallback fonts.
   *
   * @private
   * @param {webfont.Size} sizeA
   * @param {webfont.Size} sizeB
   * @return {boolean}
   */
  FontWatchRunner.prototype.isFallbackFont_ = function (sizeA, sizeB) {
    return this.sizeMatches_(sizeA, FontWatchRunner.LastResortFonts.SERIF) &&
           this.sizeMatches_(sizeB, FontWatchRunner.LastResortFonts.SANS_SERIF);
  };

  /**
   * Returns true if the WebKit bug is present and both sizes match a last resort font.
   *
   * @private
   * @param {webfont.Size} sizeA
   * @param {webfont.Size} sizeB
   * @return {boolean}
   */
  FontWatchRunner.prototype.isLastResortFont_ = function (sizeA, sizeB) {
    return this.browserInfo_.hasWebKitFallbackBug() && this.sizesMatchLastResortSizes_(sizeA, sizeB);
  };

  /**
   * Returns true if the current font is metric compatible. Also returns true
   * if we do not have a list of metric compatible fonts.
   *
   * @private
   * @return {boolean}
   */
  FontWatchRunner.prototype.isMetricCompatibleFont_ = function () {
    return this.metricCompatibleFonts_ === null || this.metricCompatibleFonts_.hasOwnProperty(this.font_.getName());
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
  FontWatchRunner.prototype.check_ = function() {
    var sizeA = this.fontRulerA_.getSize();
    var sizeB = this.fontRulerB_.getSize();

    if (this.isFallbackFont_(sizeA, sizeB) || this.isLastResortFont_(sizeA, sizeB)) {
      if (this.hasTimedOut_()) {
        if (this.isLastResortFont_(sizeA, sizeB) && this.isMetricCompatibleFont_()) {
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
  FontWatchRunner.prototype.asyncCheck_ = function() {
    setTimeout(goog.bind(function () {
      this.check_();
    }, this), 25);
  };

  /**
   * @private
   * @param {function(webfont.Font)} callback
   */
  FontWatchRunner.prototype.finish_ = function(callback) {
    this.fontRulerA_.remove();
    this.fontRulerB_.remove();
    callback(this.font_);
  };
});
