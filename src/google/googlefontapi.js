/**
 * @constructor
 */
webfont.GoogleFontApi = function(userAgent, domHelper, configuration) {
  this.userAgent_ = userAgent;
  this.domHelper_ = domHelper;
  this.configuration_ = configuration;
};

webfont.GoogleFontApi.NAME = 'google';

webfont.GoogleFontApi.prototype.supportUserAgent = function(userAgent, support) {
  support(userAgent.isSupportingWebFont());
};

webfont.GoogleFontApi.prototype.getFontWatchRunnerCtor = function() {
  if (this.userAgent_.getEngine() == "AppleWebKit") {
    return webfont.LastResortWebKitFontWatchRunner;
  }
  return webfont.FontWatchRunner;
};

webfont.GoogleFontApi.prototype.load = function(onReady) {
  var domHelper = this.domHelper_;
  var nonBlockingIe = this.userAgent_.getName() == 'MSIE' &&
      this.configuration_['blocking'] != true;

  if (nonBlockingIe) {
    domHelper.whenBodyExists(webfont.bind(this, this.insertLink_, onReady));
  } else {
    this.insertLink_(onReady);
  }
};

webfont.GoogleFontApi.prototype.insertLink_ = function(onReady) {
  var domHelper = this.domHelper_;
  var fontApiUrlBuilder = new webfont.FontApiUrlBuilder(
      this.configuration_['api'], domHelper.getProtocol(), this.configuration_['text']);
  var fontFamilies = this.configuration_['families'];
  fontApiUrlBuilder.setFontFamilies(fontFamilies);

  var fontApiParser = new webfont.FontApiParser(fontFamilies);
  fontApiParser.parse();

  domHelper.insertInto('head', domHelper.createCssLink(
      fontApiUrlBuilder.build()));
  onReady(fontApiParser.getFontFamilies(), fontApiParser.getVariations(),
      fontApiParser.getFontTestStrings());
};

globalNamespaceObject.addModule(webfont.GoogleFontApi.NAME, function(configuration, domHelper) {
  var userAgentParser = new webfont.UserAgentParser(navigator.userAgent, document);
  var userAgent = userAgentParser.parse();
  return new webfont.GoogleFontApi(userAgent, domHelper, configuration);
});
