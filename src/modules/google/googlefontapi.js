goog.provide('webfont.modules.google.GoogleFontApi');

goog.require('webfont.modules.google.FontApiUrlBuilder');
goog.require('webfont.modules.google.FontApiParser');
goog.require('webfont.FontWatchRunner');

/**
 * @constructor
 * @implements {webfont.FontModule}
 */
webfont.modules.google.GoogleFontApi = function(userAgent, domHelper, configuration) {
  this.userAgent_ = userAgent;
  this.domHelper_ = domHelper;
  this.configuration_ = configuration;
};

webfont.modules.google.GoogleFontApi.NAME = 'google';

goog.scope(function () {
  var GoogleFontApi = webfont.modules.google.GoogleFontApi,
      FontWatchRunner = webfont.FontWatchRunner,
      FontApiUrlBuilder = webfont.modules.google.FontApiUrlBuilder,
      FontApiParser = webfont.modules.google.FontApiParser;

  GoogleFontApi.prototype.supportUserAgent = function(userAgent, support) {
    support(userAgent.getBrowserInfo().hasWebFontSupport());
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

globalNamespaceObject.addModule(webfont.modules.google.GoogleFontApi.NAME, function(configuration, domHelper) {
  var userAgentParser = new webfont.UserAgentParser(navigator.userAgent, document);
  var userAgent = userAgentParser.parse();
  return new webfont.modules.google.GoogleFontApi(userAgent, domHelper, configuration);
});
