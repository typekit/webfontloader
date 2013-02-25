goog.provide('webfont.FontWatcher');

goog.require('webfont.FontWatchRunner');

/**
 * @constructor
 * @param {webfont.UserAgent} userAgent
 * @param {webfont.DomHelper} domHelper
 * @param {webfont.EventDispatcher} eventDispatcher
 * @param {Object.<string, function(Object): webfont.Size>} fontSizer
 */
webfont.FontWatcher = function(userAgent, domHelper, eventDispatcher, fontSizer) {
  this.domHelper_ = domHelper;
  this.eventDispatcher_ = eventDispatcher;
  this.fontSizer_ = fontSizer;
  this.currentlyWatched_ = 0;
  this.last_ = false;
  this.success_ = false;

  this.hasWebKitFallbackBug_ = userAgent.getBrowserInfo().hasWebKitFallbackBug();
};

/**
 * @type {string}
 * @const
 */
webfont.FontWatcher.DEFAULT_VARIATION = 'n4';

goog.scope(function () {
  var FontWatcher = webfont.FontWatcher;

  /**
   * Watches a set of font families.
   * @param {Array.<string>} fontFamilies The font family names to watch.
   * @param {Object.<string, Array.<string>>} fontDescriptions The font variations
   *     of each family to watch. Described with FVD.
   * @param {Object.<string, string>} fontTestStrings The font test strings for
   *     each family.
   * @param {function(new:webfont.FontWatchRunner, function(string, string),
   *     function(string, string), webfont.DomHelper,
   *     Object.<string, function(Object): webfont.Size>,
   *     string, string, boolean, Object.<string, boolean>=, string=)} fontWatchRunnerCtor The font watch runner constructor.
   * @param {boolean} last True if this is the last set of families to watch.
   */
  FontWatcher.prototype.watch = function(fontFamilies, fontDescriptions,
      fontTestStrings, fontWatchRunnerCtor, last) {
    var length = fontFamilies.length;

    if (length === 0) {
      this.eventDispatcher_.dispatchInactive();
      return;
    }

    for (var i = 0; i < length; i++) {
      var fontFamily = fontFamilies[i];
      if (!fontDescriptions[fontFamily]) {
        fontDescriptions[fontFamily] = [webfont.FontWatcher.DEFAULT_VARIATION];
      }
      this.currentlyWatched_ += fontDescriptions[fontFamily].length;
    }

    if (last) {
      this.last_ = last;
    }

    for (var i = 0; i < length; i++) {
      var fontFamily = fontFamilies[i];
      var descriptions = fontDescriptions[fontFamily];
      var fontTestString  = fontTestStrings[fontFamily];

      for (var j = 0, len = descriptions.length; j < len; j++) {
        var fontDescription = descriptions[j];

        this.eventDispatcher_.dispatchFontLoading(fontFamily, fontDescription);

        var activeCallback = goog.bind(this.fontActive_, this);
        var inactiveCallback = goog.bind(this.fontInactive_, this)
        var fontWatchRunner = new fontWatchRunnerCtor(activeCallback,
            inactiveCallback, this.domHelper_, this.fontSizer_,
            fontFamily, fontDescription, this.hasWebKitFallbackBug_, null, fontTestString);

        fontWatchRunner.start();
      }
    }
  };

  /**
   * Called by a FontWatchRunner when a font has been detected as active.
   * @param {string} fontFamily
   * @param {string} fontDescription
   * @private
   */
  FontWatcher.prototype.fontActive_ = function(fontFamily, fontDescription) {
    this.eventDispatcher_.dispatchFontActive(fontFamily, fontDescription);
    this.success_ = true;
    this.decreaseCurrentlyWatched_();
  };

  /**
   * Called by a FontWatchRunner when a font has been detected as inactive.
   * @param {string} fontFamily
   * @param {string} fontDescription
   * @private
   */
  FontWatcher.prototype.fontInactive_ = function(fontFamily, fontDescription) {
    this.eventDispatcher_.dispatchFontInactive(fontFamily, fontDescription);
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
