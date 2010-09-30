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
  if (userAgent.getPlatform().match(/iPad|iPod|iPhone/) != null) {
    support(false);
  }
  return support(userAgent.isSupportingWebFont());
};

webfont.GoogleFontApi.prototype.load = function(onReady) {
  var fontApiUrlBuilder = new webfont.FontApiUrlBuilder(
      this.configuration_['api']);
  var fontFamilies = this.configuration_['families'];
  var domHelper = this.domHelper_;
  var nonBlockingIe = this.userAgent_.getName() == 'MSIE' &&
      this.configuration_['blocking'] != true;

  fontApiUrlBuilder.setFontFamilies(fontFamilies);

  if (nonBlockingIe) {
    domHelper.whenBodyExists(function() {
      domHelper.insertInto('head', domHelper.createCssLink(
          fontApiUrlBuilder.build()));
    });
  } else {
    domHelper.insertInto('head', domHelper.createCssLink(
        fontApiUrlBuilder.build()));
  }
  var fontApiParser = new webfont.FontApiParser(fontFamilies);

  fontApiParser.parse();
  onReady(fontApiParser.getFontFamilies(), fontApiParser.getVariations(),
      fontApiParser.getFontTestStrings());
};

window['WebFont'].addModule(webfont.GoogleFontApi.NAME, function(configuration) {
  var userAgentParser = new webfont.UserAgentParser(navigator.userAgent, document);
  var userAgent = userAgentParser.parse();
  return new webfont.GoogleFontApi(userAgent,
      new webfont.DomHelper(document, userAgent), configuration);
});
