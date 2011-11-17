/**
 * @constructor
 * @param {webfont.UserAgent} userAgent
 * @param {webfont.DomHelper} domHelper
 * @param {webfont.EventDispatcher} eventDispatcher
 * @param {Object.<string, function(Object): number>} fontSizer
 * @param {function(function(), number=)} asyncCall
 * @param {function(): number} getTime
 */
webfont.FontWatcher = function(userAgent, domHelper, eventDispatcher, fontSizer,
    asyncCall, getTime) {
  this.userAgent_ = userAgent;
  this.domHelper_ = domHelper;
  this.eventDispatcher_ = eventDispatcher;
  this.fontSizer_ = fontSizer;
  this.asyncCall_ = asyncCall;
  this.getTime_ = getTime;
  this.currentlyWatched_ = 0;
  this.last_ = false;
  this.success_ = false;
};

/**
 * @type {string}
 * @const
 */
webfont.FontWatcher.DEFAULT_VARIATION = 'n4';

/**
 * Watches a set of font families.
 * @param {Array.<string>} fontFamilies The font family names to watch.
 * @param {Object.<string, Array.<string>>} fontDescriptions The font variations
 *     of each family to watch. Described with FVD.
 * @param {Object.<string, string>} fontTestStrings The font test strings for
 *     each family.
 * @param {boolean} last True if this is the last set of families to watch.
 */
webfont.FontWatcher.prototype.watch = function(fontFamilies, fontDescriptions,
    fontTestStrings, last) {
  var length = fontFamilies.length;

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

      var activeCallback = webfont.bind(this, this.fontActive_);
      var inactiveCallback = webfont.bind(this, this.fontInactive_)
      new webfont.FontWatchRunner(activeCallback, inactiveCallback,
          this.userAgent_, this.domHelper_, this.fontSizer_, this.asyncCall_,
          this.getTime_, fontFamily, fontDescription, fontTestString);
    }
  }
};

/**
 * Called by a FontWatchRunner when a font has been detected as active.
 * @param {string} fontFamily
 * @param {string} fontDescription
 * @private
 */
webfont.FontWatcher.prototype.fontActive_ = function(fontFamily, fontDescription) {
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
webfont.FontWatcher.prototype.fontInactive_ = function(fontFamily, fontDescription) {
  this.eventDispatcher_.dispatchFontInactive(fontFamily, fontDescription);
  this.decreaseCurrentlyWatched_();
};

/**
 * @private
 */
webfont.FontWatcher.prototype.decreaseCurrentlyWatched_ = function() {
  if (--this.currentlyWatched_ == 0 && this.last_) {
    if (this.success_) {
      this.eventDispatcher_.dispatchActive();
    } else {
      this.eventDispatcher_.dispatchInactive();
    }
  }
};
