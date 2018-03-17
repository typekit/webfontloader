goog.provide('webfont.modules.google.GoogleFontApi');

goog.require('webfont.modules.google.FontApiUrlBuilder');
goog.require('webfont.modules.google.FontApiParser');
goog.require('webfont.FontWatchRunner');
goog.require('webfont.StyleSheetWaiter');

/**
 * @constructor
 * @implements {webfont.FontModule}
 */
webfont.modules.google.GoogleFontApi = function(domHelper, configuration) {
  this.domHelper_ = domHelper;
  this.configuration_ = configuration;
};

/**
 * @const
 * @type {string}
 */
webfont.modules.google.GoogleFontApi.NAME = 'google';

goog.scope(function () {
  var GoogleFontApi = webfont.modules.google.GoogleFontApi,
      FontWatchRunner = webfont.FontWatchRunner,
      StyleSheetWaiter = webfont.StyleSheetWaiter,
      FontApiUrlBuilder = webfont.modules.google.FontApiUrlBuilder,
      FontApiParser = webfont.modules.google.FontApiParser;

  GoogleFontApi.METRICS_COMPATIBLE_FONTS = {
    "Arimo": true,
    "Cousine": true,
    "Tinos": true
  };

  GoogleFontApi.prototype.load = function(onReady) {
    var waiter = new StyleSheetWaiter();
    var domHelper = this.domHelper_;
    var fontApiUrlBuilder = new FontApiUrlBuilder(
        this.configuration_['api'],
        this.configuration_['text']
    );
    var fontFamilies = this.configuration_['families'];
    fontApiUrlBuilder.setFontFamilies(fontFamilies);

    var fontApiParser = new FontApiParser(fontFamilies);
    fontApiParser.parse();

    domHelper.loadStylesheet(fontApiUrlBuilder.build(), waiter.startWaitingLoad());
    waiter.waitWhileNeededThen(function() {
      onReady(fontApiParser.getFonts(), fontApiParser.getFontTestStrings(), GoogleFontApi.METRICS_COMPATIBLE_FONTS);
    });
  };
});
