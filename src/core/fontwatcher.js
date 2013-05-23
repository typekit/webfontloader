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
   * @param {Array.<webfont.Font>} fonts The fonts to watch.
   * @param {Object.<string, string>} fontTestStrings The font test strings for
   *     each family.
   * @param {function(new:webfont.FontWatchRunner,
   *                  function(webfont.Font),
   *                  function(webfont.Font),
   *                  webfont.DomHelper,
   *                  webfont.Font,
   *                  webfont.BrowserInfo,
   *                  number=,
   *                  Object.<string, boolean>=,
   *                  string=)} fontWatchRunnerCtor The font watch runner constructor.
   * @param {boolean} last True if this is the last set of fonts to watch.
   */
  FontWatcher.prototype.watchFonts = function(fonts,
      fontTestStrings, fontWatchRunnerCtor, last) {
    var length = fonts.length;

    if (length === 0 && last) {
      this.eventDispatcher_.dispatchInactive();
      return;
    }

    this.currentlyWatched_ += length;

    if (last) {
      this.last_ = last;
    }

    for (var i = 0; i < length; i++) {
      var font = fonts[i];
      var fontTestString  = fontTestStrings[font.getName()];

      this.eventDispatcher_.dispatchFontLoading(font);

      var activeCallback = goog.bind(this.fontActive_, this);
      var inactiveCallback = goog.bind(this.fontInactive_, this);
      var fontWatchRunner = new fontWatchRunnerCtor(activeCallback,
          inactiveCallback, this.domHelper_, font,
          this.browserInfo_, this.timeout_, null, fontTestString);

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
