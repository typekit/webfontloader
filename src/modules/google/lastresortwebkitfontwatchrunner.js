goog.provide('webfont.modules.LastResortWebKitFontWatchRunner');

goog.require('webfont.Font');
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
 * @extends webfont.FontWatchRunner
 */
webfont.modules.LastResortWebKitFontWatchRunner = function(activeCallback,
    inactiveCallback, domHelper, font,
    browserInfo, opt_timeout, opt_metricCompatibleFonts, opt_fontTestString) {

  goog.base(this, activeCallback, inactiveCallback, domHelper,
            font, browserInfo, opt_timeout, opt_metricCompatibleFonts, opt_fontTestString);

  this.webKitLastResortFontWidths_ = this.setUpWebKitLastResortFontWidths_();
  this.webKitLastResortWidthChange_ = false;
  this.lastObservedWidthA_ = this.lastResortWidths_[webfont.FontWatchRunner.LastResortFonts.SERIF];
  this.lastObservedWidthB_ = this.lastResortWidths_[webfont.FontWatchRunner.LastResortFonts.SANS_SERIF];;
};

goog.inherits(webfont.modules.LastResortWebKitFontWatchRunner, webfont.FontWatchRunner)

webfont.modules.LastResortWebKitFontWatchRunner.METRICS_COMPATIBLE_FONTS = {
    "Arimo": true,
    "Cousine": true,
    "Tinos": true
};

goog.scope(function () {
  var LastResortWebKitFontWatchRunner = webfont.modules.LastResortWebKitFontWatchRunner,
      Font = webfont.Font,
      FontRuler = webfont.FontRuler;

  /**
   * While loading a web font webkit applies a last resort fallback font to the
   * element on which the web font is applied.
   * See file: WebKit/Source/WebCore/css/CSSFontFaceSource.cpp.
   * Looking at the different implementation for the different platforms,
   * the last resort fallback font is different. This code uses the default
   * OS/browsers values.
   */
  LastResortWebKitFontWatchRunner.prototype
      .setUpWebKitLastResortFontWidths_ = function() {
    var lastResortFonts = ['Times New Roman', 'Arial', 'Times', 'Sans', 'Serif'];
    var variation = this.font_.getVariation();
    var lastResortFontWidths = lastResortFonts.length;
    var webKitLastResortFontWidths = {};
    var fontRuler = new FontRuler(this.domHelper_, this.fontTestString_);

    fontRuler.insert();
    fontRuler.setFont(new Font(lastResortFonts[0], variation));

    webKitLastResortFontWidths[fontRuler.getWidth()] = true;
    for (var i = 1; i < lastResortFontWidths; i++) {
      var font = lastResortFonts[i];
      fontRuler.setFont(new Font(font, variation));
      webKitLastResortFontWidths[fontRuler.getWidth()] = true;

      // Another WebKit quirk if the normal weight/style is loaded first,
      // the size of the normal weight is returned when loading another weight.
      if (variation.toString().charAt(1) != '4') {
        fontRuler.setFont(new Font(font, variation.charAt(0) + '4'));
        webKitLastResortFontWidths[fontRuler.getWidth()] = true;
      }
    }
    fontRuler.remove();
    return webKitLastResortFontWidths;
  };

  /**
   * @override
   */
  LastResortWebKitFontWatchRunner.prototype.check_ = function() {
    var widthA = this.fontRulerA_.getWidth();
    var widthB = this.fontRulerB_.getWidth();

    if (!this.webKitLastResortWidthChange_ && widthA == widthB &&
        this.webKitLastResortFontWidths_[widthA]) {
      this.webKitLastResortFontWidths_ = {};
      this.webKitLastResortFontWidths_[widthA] = true;
      this.webKitLastResortWidthChange_ = true;
    }
    if ((this.lastObservedWidthA_ != widthA || this.lastObservedWidthB_ != widthB) &&
        (!this.webKitLastResortFontWidths_[widthA] &&
         !this.webKitLastResortFontWidths_[widthB])) {
      this.finish_(this.activeCallback_);
    } else if (this.hasTimedOut_()) {

      // In order to handle the fact that a font could be the same size as the
      // default browser font on a webkit browser, mark the font as active
      // after 5 seconds if the latest 2 widths are in webKitLastResortFontWidths_
      // and the font name is known to be metrics compatible.
      if (this.webKitLastResortFontWidths_[widthA]
          && this.webKitLastResortFontWidths_[widthB] &&
          LastResortWebKitFontWatchRunner.METRICS_COMPATIBLE_FONTS[
            this.font_.getName()]) {
        this.finish_(this.activeCallback_);
      } else {
        this.finish_(this.inactiveCallback_);
      }
    } else {
      this.asyncCheck_();
    }
  };
});
