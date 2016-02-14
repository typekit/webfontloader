goog.provide('webfont.FontWatchRunner');

goog.require('webfont.Font');
goog.require('webfont.FontRuler');

/**
 * @constructor
 * @param {function(webfont.Font)} activeCallback
 * @param {function(webfont.Font)} inactiveCallback
 * @param {webfont.DomHelper} domHelper
 * @param {webfont.Font} font
 * @param {number=} opt_timeout
 * @param {Object.<string, boolean>=} opt_metricCompatibleFonts
 * @param {string=} opt_fontTestString
 */
webfont.FontWatchRunner = function(activeCallback, inactiveCallback, domHelper,
    font, opt_timeout, opt_metricCompatibleFonts, opt_fontTestString) {
  this.activeCallback_ = activeCallback;
  this.inactiveCallback_ = inactiveCallback;
  this.domHelper_ = domHelper;
  this.font_ = font;
  this.fontTestString_ = opt_fontTestString || webfont.FontWatchRunner.DEFAULT_TEST_STRING;
  this.lastResortWidths_ = {};
  this.timeout_ = opt_timeout || 3000;

  this.metricCompatibleFonts_ = opt_metricCompatibleFonts || null;

  this.fontRulerA_ = null;
  this.fontRulerB_ = null;
  this.lastResortRulerA_ = null;
  this.lastResortRulerB_ = null;

  this.setupRulers_();
};

/**
 * @enum {string}
 * @const
 */
webfont.FontWatchRunner.LastResortFonts = {
  SERIF: 'serif',
  SANS_SERIF: 'sans-serif'
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
      Font = webfont.Font,
      FontRuler = webfont.FontRuler;

  /**
   * @type {null|boolean}
   */
  FontWatchRunner.HAS_WEBKIT_FALLBACK_BUG = null;

  /**
   * @return {string}
   */
  FontWatchRunner.getUserAgent = function () {
    return window.navigator.userAgent;
  };

  /**
   * Returns true if this browser is WebKit and it has the fallback bug
   * which is present in WebKit 536.11 and earlier.
   *
   * @return {boolean}
   */
  FontWatchRunner.hasWebKitFallbackBug = function () {
    if (FontWatchRunner.HAS_WEBKIT_FALLBACK_BUG === null) {
      var match = /AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(FontWatchRunner.getUserAgent());

      FontWatchRunner.HAS_WEBKIT_FALLBACK_BUG = !!match &&
                                          (parseInt(match[1], 10) < 536 ||
                                           (parseInt(match[1], 10) === 536 &&
                                            parseInt(match[2], 10) <= 11));
    }
    return FontWatchRunner.HAS_WEBKIT_FALLBACK_BUG;
  };

  /**
   * @private
   */
  FontWatchRunner.prototype.setupRulers_ = function() {
    this.fontRulerA_ = new FontRuler(this.domHelper_, this.fontTestString_);
    this.fontRulerB_ = new FontRuler(this.domHelper_, this.fontTestString_);
    this.lastResortRulerA_ = new FontRuler(this.domHelper_, this.fontTestString_);
    this.lastResortRulerB_ = new FontRuler(this.domHelper_, this.fontTestString_);

    this.fontRulerA_.setFont(new Font(this.font_.getName() + ',' + FontWatchRunner.LastResortFonts.SERIF, this.font_.getVariation()));
    this.fontRulerB_.setFont(new Font(this.font_.getName() + ',' + FontWatchRunner.LastResortFonts.SANS_SERIF, this.font_.getVariation()));
    this.lastResortRulerA_.setFont(new Font(FontWatchRunner.LastResortFonts.SERIF, this.font_.getVariation()));
    this.lastResortRulerB_.setFont(new Font(FontWatchRunner.LastResortFonts.SANS_SERIF, this.font_.getVariation()));

    this.fontRulerA_.insert();
    this.fontRulerB_.insert();
    this.lastResortRulerA_.insert();
    this.lastResortRulerB_.insert();
  };

  FontWatchRunner.prototype.start = function() {
    this.lastResortWidths_[FontWatchRunner.LastResortFonts.SERIF] = this.lastResortRulerA_.getWidth();
    this.lastResortWidths_[FontWatchRunner.LastResortFonts.SANS_SERIF] = this.lastResortRulerB_.getWidth();

    this.started_ = goog.now();

    this.check_();
  };

  /**
   * Returns true if the given width matches the generic font family width.
   *
   * @private
   * @param {number} width
   * @param {string} lastResortFont
   * @return {boolean}
   */
  FontWatchRunner.prototype.widthMatches_ = function(width, lastResortFont) {
    return width === this.lastResortWidths_[lastResortFont];
  };

  /**
   * Return true if the given widths match any of the generic font family
   * widths.
   *
   * @private
   * @param {number} a
   * @param {number} b
   * @return {boolean}
   */
  FontWatchRunner.prototype.widthsMatchLastResortWidths_ = function(a, b) {
    for (var font in FontWatchRunner.LastResortFonts) {
      if (FontWatchRunner.LastResortFonts.hasOwnProperty(font)) {
        if (this.widthMatches_(a, FontWatchRunner.LastResortFonts[font]) &&
            this.widthMatches_(b, FontWatchRunner.LastResortFonts[font])) {
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
   * @param {number} a
   * @param {number} b
   * @return {boolean}
   */
  FontWatchRunner.prototype.isFallbackFont_ = function (a, b) {
    return this.widthMatches_(a, FontWatchRunner.LastResortFonts.SERIF) &&
           this.widthMatches_(b, FontWatchRunner.LastResortFonts.SANS_SERIF);
  };

  /**
   * Returns true if the WebKit bug is present and both widths match a last resort font.
   *
   * @private
   * @param {number} a
   * @param {number} b
   * @return {boolean}
   */
  FontWatchRunner.prototype.isLastResortFont_ = function (a, b) {
    return FontWatchRunner.hasWebKitFallbackBug() && this.widthsMatchLastResortWidths_(a, b);
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
   * Checks the width of the two spans against their original widths during each
   * async loop. If the width of one of the spans is different than the original
   * width, then we know that the font is rendering and finish with the active
   * callback. If we wait more than 5 seconds and nothing has changed, we finish
   * with the inactive callback.
   *
   * @private
   */
  FontWatchRunner.prototype.check_ = function() {
    var widthA = this.fontRulerA_.getWidth();
    var widthB = this.fontRulerB_.getWidth();

    if (this.isFallbackFont_(widthA, widthB) || this.isLastResortFont_(widthA, widthB)) {
      if (this.hasTimedOut_()) {
        if (this.isLastResortFont_(widthA, widthB) && this.isMetricCompatibleFont_()) {
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
    }, this), 50);
  };

  /**
   * @private
   * @param {function(webfont.Font)} callback
   */
  FontWatchRunner.prototype.finish_ = function(callback) {
    // Remove elements and trigger callback (which adds active/inactive class) asynchronously to avoid reflow chain if
    // several fonts are finished loading right after each other
    setTimeout(goog.bind(function () {
      this.fontRulerA_.remove();
      this.fontRulerB_.remove();
      this.lastResortRulerA_.remove();
      this.lastResortRulerB_.remove();
      callback(this.font_);
    }, this), 0);
  };

});
