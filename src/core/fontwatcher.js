goog.provide('webfont.FontWatcher');

goog.require('webfont.FontWatchRunner');

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
  var FontWatcher = webfont.FontWatcher;

  /**
   * Watches a set of font families.
   * @param {Array.<webfont.FontFamily>} fontFamilies The font family names to watch.
   * @param {Object.<string, string>} fontTestStrings The font test strings for
   *     each family.
   * @param {function(new:webfont.FontWatchRunner,
   *                  function(webfont.FontFamily),
   *                  function(webfont.FontFamily),
   *                  webfont.DomHelper,
   *                  webfont.FontFamily,
   *                  webfont.BrowserInfo,
   *                  number=,
   *                  Object.<string, boolean>=,
   *                  string=)} fontWatchRunnerCtor The font watch runner constructor.
   * @param {boolean} last True if this is the last set of families to watch.
   */
  FontWatcher.prototype.watch = function(fontFamilies,
      fontTestStrings, fontWatchRunnerCtor, last) {
    var length = fontFamilies.length;

    if (length === 0) {
      this.eventDispatcher_.dispatchInactive();
      return;
    }

    this.currentlyWatched_ += length;

    if (last) {
      this.last_ = last;
    }

    for (var i = 0; i < length; i++) {
      var fontFamily = fontFamilies[i];
      var fontTestString  = fontTestStrings[fontFamily.getName()];

      this.eventDispatcher_.dispatchFontLoading(fontFamily);

      var activeCallback = goog.bind(this.fontActive_, this);
      var inactiveCallback = goog.bind(this.fontInactive_, this);
      var fontWatchRunner = new fontWatchRunnerCtor(activeCallback,
          inactiveCallback, this.domHelper_, fontFamily,
          this.browserInfo_, this.timeout_, null, fontTestString);

      fontWatchRunner.start();
    }
  };

  /**
   * Called by a FontWatchRunner when a font has been detected as active.
   * @param {webfont.FontFamily} fontFamily
   * @private
   */
  FontWatcher.prototype.fontActive_ = function(fontFamily) {
    this.eventDispatcher_.dispatchFontActive(fontFamily);
    this.success_ = true;
    this.decreaseCurrentlyWatched_();
  };

  /**
   * Called by a FontWatchRunner when a font has been detected as inactive.
   * @param {webfont.FontFamily} fontFamily
   * @private
   */
  FontWatcher.prototype.fontInactive_ = function(fontFamily) {
    this.eventDispatcher_.dispatchFontInactive(fontFamily);
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
