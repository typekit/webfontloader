goog.provide('webfont.modules.GoogleFontApi');

goog.require('webfont.modules.FontApiUrlBuilder');
goog.require('webfont.modules.FontApiParser');
goog.require('webfont.FontWatchRunner');
goog.require('webfont.modules.LastResortWebKitFontWatchRunner');

/**
 * @constructor
 * @implements {webfont.FontModule}
 */
webfont.modules.GoogleFontApi = function(userAgent, domHelper, configuration) {
  this.userAgent_ = userAgent;
  this.domHelper_ = domHelper;
  this.configuration_ = configuration;
};

webfont.modules.GoogleFontApi.NAME = 'google';

goog.scope(function () {
  var GoogleFontApi = webfont.modules.GoogleFontApi,
      FontWatchRunner = webfont.FontWatchRunner,
      LastResortWebKitFontWatchRunner = webfont.modules.LastResortWebKitFontWatchRunner,
      FontApiUrlBuilder = webfont.modules.FontApiUrlBuilder,
      FontApiParser = webfont.modules.FontApiParser;

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

globalNamespaceObject.addModule(webfont.modules.GoogleFontApi.NAME, function(configuration, domHelper) {
  var userAgentParser = new webfont.UserAgentParser(navigator.userAgent, document);
  var userAgent = userAgentParser.parse();
  return new webfont.modules.GoogleFontApi(userAgent, domHelper, configuration);
});
