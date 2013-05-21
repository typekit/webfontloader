goog.provide('webfont.GoogleFontApi');

goog.require('webfont.FontApiUrlBuilder');
goog.require('webfont.FontApiParser');
goog.require('webfont.FontWatchRunner');
goog.require('webfont.LastResortWebKitFontWatchRunner');

/**
 * @constructor
 * @implements {webfont.FontModule}
 */
webfont.GoogleFontApi = function(domHelper, configuration) {
  var userAgentParser = new webfont.UserAgentParser(navigator.userAgent, document);

  this.userAgent_ = userAgentParser.parse();
  this.domHelper_ = domHelper;
  this.configuration_ = configuration;
};

goog.scope(function () {
  var GoogleFontApi = webfont.GoogleFontApi,
      FontWatchRunner = webfont.FontWatchRunner,
      LastResortWebKitFontWatchRunner = webfont.LastResortWebKitFontWatchRunner,
      FontApiUrlBuilder = webfont.FontApiUrlBuilder,
      FontApiParser = webfont.FontApiParser;

  GoogleFontApi.prototype.supportUserAgent = function(userAgent, support) {
    support(userAgent.getBrowserInfo().hasWebFontSupport());
  };

  GoogleFontApi.prototype.getFontWatchRunnerCtor = function() {
    if (this.userAgent_.getEngine() == "AppleWebKit") {
      return LastResortWebKitFontWatchRunner;
    }
    return FontWatchRunner;
  };

  GoogleFontApi.prototype.load = function(onReady) {
    var domHelper = this.domHelper_;
    var nonBlockingIe = this.userAgent_.getName() == 'MSIE' &&
        this.configuration_['blocking'] != true;

    if (nonBlockingIe) {
      domHelper.whenBodyExists(goog.bind(this.insertLink_, this, onReady));
    } else {
      this.insertLink_(onReady);
    }
  };

  GoogleFontApi.prototype.insertLink_ = function(onReady) {
    var domHelper = this.domHelper_;
    var fontApiUrlBuilder = new FontApiUrlBuilder(
        this.configuration_['api'], domHelper.getProtocol(), this.configuration_['text']);
    var fontFamilies = this.configuration_['families'];
    fontApiUrlBuilder.setFontFamilies(fontFamilies);

    var fontApiParser = new FontApiParser(fontFamilies);
    fontApiParser.parse();

    domHelper.insertInto('head', domHelper.createCssLink(
        fontApiUrlBuilder.build()));
    onReady(fontApiParser.getFonts(), fontApiParser.getFontTestStrings());
  };
});
