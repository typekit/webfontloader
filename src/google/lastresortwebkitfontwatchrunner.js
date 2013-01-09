/**
 * @constructor
 * @param {function(string, string)} activeCallback
 * @param {function(string, string)} inactiveCallback
 * @param {webfont.DomHelper} domHelper
 * @param {Object.<string, function(Object): {width: number, height: number}>} fontSizer
 * @param {function(function(), number=)} asyncCall
 * @param {function(): number} getTime
 * @param {string} fontFamily
 * @param {string} fontDescription
 * @param {boolean} hasWebkitFallbackBug
 * @param {string=} opt_fontTestString
 * @extends webfont.FontWatchRunner
 */
webfont.LastResortWebKitFontWatchRunner = function(activeCallback,
    inactiveCallback, domHelper, fontSizer, asyncCall, getTime, fontFamily,
    fontDescription, hasWebkitFallbackBug, opt_fontTestString) {
  webfont.LastResortWebKitFontWatchRunner.superCtor_.call(this,
      activeCallback, inactiveCallback, domHelper, fontSizer, asyncCall,
      getTime, fontFamily, fontDescription, hasWebkitFallbackBug, opt_fontTestString);
  this.webKitLastResortFontSizes_ = this.setUpWebKitLastResortFontSizes_();
  this.webKitLastResortSizeChange_ = false;
  this.lastObservedSizeA_ = this.lastResortSizes_[webfont.FontWatchRunner.LastResortFonts.SERIF];
  this.lastObservedSizeB_ = this.lastResortSizes_[webfont.FontWatchRunner.LastResortFonts.SANS_SERIF];;
};
webfont.extendsClass(webfont.FontWatchRunner, webfont.LastResortWebKitFontWatchRunner);

webfont.LastResortWebKitFontWatchRunner.METRICS_COMPATIBLE_FONTS = {
    "Arimo": true,
    "Cousine": true,
    "Tinos": true
};

/**
 * While loading a web font webkit applies a last resort fallback font to the
 * element on which the web font is applied.
 * See file: WebKit/Source/WebCore/css/CSSFontFaceSource.cpp.
 * Looking at the different implementation for the different platforms,
 * the last resort fallback font is different. This code uses the default
 * OS/browsers values.
 */
webfont.LastResortWebKitFontWatchRunner.prototype
    .setUpWebKitLastResortFontSizes_ = function() {
  var lastResortFonts = ['Times New Roman', 'Arial', 'Times', 'Sans', 'Serif'];
  var lastResortFontSizes = lastResortFonts.length;
  var webKitLastResortFontSizes = {};
  var fontRuler = new webfont.FontRuler(this.domHelper_, this.fontSizer_, this.fontTestString_);

  fontRuler.insert();
  fontRuler.setFont(lastResortFonts[0], this.fontDescription_);

  webKitLastResortFontSizes[fontRuler.getSize().width] = true;
  for (var i = 1; i < lastResortFontSizes; i++) {
    var font = lastResortFonts[i];
    fontRuler.setFont(font, this.fontDescription_);
    webKitLastResortFontSizes[fontRuler.getSize().width] = true;

    // Another WebKit quirk if the normal weight/style is loaded first,
    // the size of the normal weight is returned when loading another weight.
    if (this.fontDescription_[1] != '4') {
      fontRuler.setFont(font, this.fontDescription_[0] + '4');
      webKitLastResortFontSizes[fontRuler.getSize().width] = true;
    }
  }
  fontRuler.remove();
  return webKitLastResortFontSizes;
};

webfont.LastResortWebKitFontWatchRunner.prototype.check_ = function() {
  var sizeA = this.fontRulerA_.getSize();
  var sizeB = this.fontRulerB_.getSize();

  if (!this.webKitLastResortSizeChange_ && sizeA.width == sizeB.width &&
      this.webKitLastResortFontSizes_[sizeA.width]) {
    this.webKitLastResortFontSizes_ = {};
    this.webKitLastResortFontSizes_[sizeA.width] = true;
    this.webKitLastResortSizeChange_ = true;
  }
  if ((this.lastObservedSizeA_.width != sizeA.width || this.lastObservedSizeB_.width != sizeB.width) &&
      (!this.webKitLastResortFontSizes_[sizeA.width] &&
       !this.webKitLastResortFontSizes_[sizeB.width])) {
    this.finish_(this.activeCallback_);
  } else if (this.getTime_() - this.started_ >= 5000) {

    // In order to handle the fact that a font could be the same size as the
    // default browser font on a webkit browser, mark the font as active
    // after 5 seconds if the latest 2 sizes are in webKitLastResortFontSizes_
    // and the font name is known to be metrics compatible.
    if (this.webKitLastResortFontSizes_[sizeA.width]
        && this.webKitLastResortFontSizes_[sizeB.width] &&
        webfont.LastResortWebKitFontWatchRunner.METRICS_COMPATIBLE_FONTS[
          this.fontFamily_]) {
      this.finish_(this.activeCallback_);
    } else {
      this.finish_(this.inactiveCallback_);
    }
  } else {
    this.asyncCheck_();
  }
};
