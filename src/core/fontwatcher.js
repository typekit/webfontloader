goog.provide('webfont.FontWatcher');

goog.require('webfont.FontWatchRunner');
goog.require('webfont.NativeFontWatchRunner');
/**
 * @constructor
 * @param {webfont.UserAgent} userAgent
 * @param {webfont.DomHelper} domHelper
 * @param {webfont.EventDispatcher} eventDispatcher
 * @param {number=} opt_timeout
 */
webfont.FontWatcher = function(userAgent, domHelper, eventDispatcher, opt_timeout) {
  this.domHelper_ = domHelper;
  this.eventDispatcher_ = eventDispatcher;
  this.currentlyWatched_ = 0;
  this.last_ = false;
  this.success_ = false;
  this.timeout_ = opt_timeout;

  this.browserInfo_ = userAgent.getBrowserInfo();
};

goog.scope(function () {
  var FontWatcher = webfont.FontWatcher,
      FontWatchRunner = webfont.FontWatchRunner,
      NativeFontWatchRunner = webfont.NativeFontWatchRunner;

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

    for (var i = 0; i < fonts.length; i++) {
      var font = fonts[i],
          testString = testStrings[font.getName()];

      this.eventDispatcher_.dispatchFontLoading(font);

      var fontWatchRunner = null;

      // We've disabled the native font watch runner for now. The
      // reason is that its behaviour is slightly different from
      // the non-native version in that it returns immediately if
      // a @font-face rule is not in the document. The non-native
      // version keeps polling the page. A lot of modules depend
      // on the ability to start font watching before actually
      // loading the fonts, so they fail in this case (which is
      // related to browser support; figuring out when a
      // stylesheet has loaded reliably). Until that issue is
      // resolved we'll keep the native font disabled.
      //
      //if (this.browserInfo_.hasNativeFontLoading()) {
      //  fontWatchRunner = new NativeFontWatchRunner(
      //      goog.bind(this.fontActive_, this),
      //      goog.bind(this.fontInactive_, this),
      //      this.domHelper_,
      //      font,
      //      this.timeout_,
      //      fontTestString
      //    );
      //} else {
        fontWatchRunner = new FontWatchRunner(
            goog.bind(this.fontActive_, this),
            goog.bind(this.fontInactive_, this),
            this.domHelper_,
            font,
            this.browserInfo_,
            this.timeout_,
            metricCompatibleFonts,
            testString
          );
      //}

      fontWatchRunner.start();
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
