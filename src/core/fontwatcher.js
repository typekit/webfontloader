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
  this.domHelper_ = domHelper;
  this.eventDispatcher_ = eventDispatcher;
  this.fontSizer_ = fontSizer;
  this.asyncCall_ = asyncCall;
  this.getTime_ = getTime;
  this.currentlyWatched_ = 0;
  this.hasWebkitFallbackBug_ = userAgent.getEngine() === 'AppleWebKit' ? this.checkWebkitFallbackBug_() : false;
  this.last_ = false;
  this.success_ = false;
};

/**
 * @type {string}
 * @const
 */
webfont.FontWatcher.DEFAULT_VARIATION = 'n4';

/**
 * Returns true if this browser has a bug that causes the font stack
 * to not be respected while loading webfonts.
 *
 * @see https://bugs.webkit.org/show_bug.cgi?id=76684
 *
 * @return {boolean}
 * @private
 */
webfont.FontWatcher.prototype.checkWebkitFallbackBug_ = function() {
  // We build an empty webfont and try to set it as the font for our
  // ruler. Even though this will fail (since our webfont is invalid)
  // it will actually trigger the Webkit fallback bug.
  var font = this.domHelper_.createElement('style', null,
        "@font-face{" +
          "font-family:'__webfontloader_test__';" +
          "src:url(data:application/x-font-woff;base64,) format('woff')," +
          "url(data:font/truetype;base64,) format('truetype');" +
        "}"),
      ruler = new webfont.FontRuler(this.domHelper_, this.fontSizer_, 'iii');

  // First we set the font to monospace and the test string to `iii`. Based
  // on our research, all platforms have at least a monospace, sans-serif,
  // and serif font installed. By using a test string that has a very
  // narrow width in non-monospace fonts it becomes easy to detect changes
  // in width.
  ruler.setFont('monospace');

  ruler.insert();

  // Measure the original size (of our monospace font)
  var beforeWidth = ruler.getSize().width;

  // Set the font to include our fake webfont, and then fallback to
  // `monospace` and `sans-serif`. Browsers without the bug will fall
  // back on the `monospace` font while loading the webfont, while
  // Webkit with the bug will fall back to its last resort font (which
  // according to our data is never `monospace`.) The `sans-serif` is
  // included here to deal with another bug in Chrome Android where
  // instead of using the last resort font it picks the last font in
  // the stack.
  //
  // See http://code.google.com/p/chromium/issues/detail?id=138257
  // for more information on the Chrome Android bug.
  this.domHelper_.insertInto('head', font);
  ruler.setFont("'__webfontloader_test__', monospace, sans-serif");

  // Finally we compare the initial width and the current width. If
  // they do not match (i.e. it is either the sans-serif font, or
  // the last resort font) we assume the bug is present.
  var hasBug = beforeWidth !== ruler.getSize().width;
  this.domHelper_.removeElement(font);
  ruler.remove();

  return hasBug;
};

/**
 * Watches a set of font families.
 * @param {Array.<string>} fontFamilies The font family names to watch.
 * @param {Object.<string, Array.<string>>} fontDescriptions The font variations
 *     of each family to watch. Described with FVD.
 * @param {Object.<string, string>} fontTestStrings The font test strings for
 *     each family.
 * @param {function(new:webfont.FontWatchRunner, function(string, string),
 *     function(string, string), webfont.DomHelper,
 *     Object.<string, function(Object): number>,
 *     function(function(), number=), function(): number, string, string,
 *     boolean, string=)} fontWatchRunnerCtor The font watch runner constructor.
 * @param {boolean} last True if this is the last set of families to watch.
 */
webfont.FontWatcher.prototype.watch = function(fontFamilies, fontDescriptions,
    fontTestStrings, fontWatchRunnerCtor, last) {
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
      var fontWatchRunner = new fontWatchRunnerCtor(activeCallback,
          inactiveCallback, this.domHelper_, this.fontSizer_, this.asyncCall_,
          this.getTime_, fontFamily, fontDescription, this.hasWebkitFallbackBug_, fontTestString);

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
