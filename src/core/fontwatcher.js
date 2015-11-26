goog.provide('webfont.FontWatcher');

goog.require('webfont.FontWatchRunner');
goog.require('webfont.NativeFontWatchRunner');

/**
 * @typedef {Object.<string, Array.<string>>}
 */
webfont.FontTestStrings;

/**
 * @constructor
 * @param {webfont.DomHelper} domHelper
 * @param {webfont.EventDispatcher} eventDispatcher
 * @param {number=} opt_timeout
 */
webfont.FontWatcher = function(domHelper, eventDispatcher, opt_timeout) {
  this.domHelper_ = domHelper;
  this.eventDispatcher_ = eventDispatcher;
  this.currentlyWatched_ = 0;
  this.last_ = false;
  this.success_ = false;
  this.timeout_ = opt_timeout;
};

goog.scope(function () {
  var FontWatcher = webfont.FontWatcher,
      FontWatchRunner = webfont.FontWatchRunner,
      NativeFontWatchRunner = webfont.NativeFontWatchRunner;

  /**
   * @type {null|boolean}
   */
  FontWatcher.SHOULD_USE_NATIVE_LOADER = null;

  /**
   * @return {string}
   */
  FontWatcher.getUserAgent = function () {
    return window.navigator.userAgent;
  };

  /**
   * Returns true if this browser has support for
   * the CSS font loading API.
   *
   * @return {boolean}
   */
  FontWatcher.shouldUseNativeLoader = function () {
    if (FontWatcher.SHOULD_USE_NATIVE_LOADER === null) {
      if (!!window.FontFace) {
        var match = /Gecko.*Firefox\/(\d+)/.exec(FontWatcher.getUserAgent());

        if (match) {
          FontWatcher.SHOULD_USE_NATIVE_LOADER = parseInt(match[1], 10) > 42;
        } else {
          FontWatcher.SHOULD_USE_NATIVE_LOADER = true;
        }
      } else {
        FontWatcher.SHOULD_USE_NATIVE_LOADER = false;
      }
    }
    return FontWatcher.SHOULD_USE_NATIVE_LOADER;
  };

  /**
   * Watches a set of font families.
   * @param {Array.<webfont.Font>} fonts The fonts to watch.
   * @param {webfont.FontTestStrings} fontTestStrings The font test strings for
   *     each family.
   * @param {Object.<String, boolean>} metricCompatibleFonts
   * @param {boolean} last True if this is the last set of fonts to watch.
   */
  FontWatcher.prototype.watchFonts = function(fonts,
      fontTestStrings, metricCompatibleFonts, last) {
    var length = fonts.length,
        testStrings = fontTestStrings || {};

    if (length === 0 && last) {
      this.eventDispatcher_.dispatchInactive();
      return;
    }

    this.currentlyWatched_ += fonts.length;

    if (last) {
      this.last_ = last;
    }

    var i, fontWatchRunners = [];
    for (i = 0; i < fonts.length; i++) {
      var font = fonts[i],
          testString = testStrings[font.getName()];

      this.eventDispatcher_.dispatchFontLoading(font);

      var fontWatchRunner = null;

      if (FontWatcher.shouldUseNativeLoader()) {
        fontWatchRunner = new NativeFontWatchRunner(
            goog.bind(this.fontActive_, this),
            goog.bind(this.fontInactive_, this),
            this.domHelper_,
            font,
            this.timeout_,
            testString
          );
      } else {
        fontWatchRunner = new FontWatchRunner(
          goog.bind(this.fontActive_, this),
          goog.bind(this.fontInactive_, this),
          this.domHelper_,
          font,
          this.timeout_,
          metricCompatibleFonts,
          testString
        );
      }

      fontWatchRunners.push(fontWatchRunner);
    }

    for (i = 0; i < fontWatchRunners.length; i++) {
      fontWatchRunners[i].start();
    }
  };

  /**
   * Called by a FontWatchRunner when a font has been detected as active.
   * @param {webfont.Font} font
   * @private
   */
  FontWatcher.prototype.fontActive_ = function(font) {
    this.eventDispatcher_.dispatchFontActive(font);
    this.success_ = true;
    this.decreaseCurrentlyWatched_();
  };

  /**
   * Called by a FontWatchRunner when a font has been detected as inactive.
   * @param {webfont.Font} font
   * @private
   */
  FontWatcher.prototype.fontInactive_ = function(font) {
    this.eventDispatcher_.dispatchFontInactive(font);
    this.decreaseCurrentlyWatched_();
  };

  /**
   * @private
   */
  FontWatcher.prototype.decreaseCurrentlyWatched_ = function() {
    if (--this.currentlyWatched_ == 0 && this.last_) {
      if (this.success_) {
        this.eventDispatcher_.dispatchActive();
      } else {
        this.eventDispatcher_.dispatchInactive();
      }
    }
  };
});
