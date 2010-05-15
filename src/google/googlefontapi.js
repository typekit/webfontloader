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
  onReady(fontApiParser.getFontFamilies(), fontApiParser.getVariations(), function(_fontFamily, _variation) {
    var sb = [];
    var styleGroup = _variation.match(/font-style: (\w+);?/);
    var weightGroup = _variation.match(/font-weight: (\w+);?/);

    if (weightGroup && weightGroup[1]) {
      if (weightGroup[1] != 'normal') {
        sb.push(' ');
        sb.push(weightGroup[1]);
      }
    }
    if (styleGroup && styleGroup[1]) {
      if (styleGroup[1] != 'normal') {
        if (sb.length == 0) {
          sb.push(' ');
        }
        sb.push(styleGroup[1]);
      }
    }
    return _fontFamily + sb.join('');
  });
};

WebFont.addModule(webfont.GoogleFontApi.NAME, function(configuration) {
  var userAgentParser = new webfont.UserAgentParser(navigator.userAgent);
  var userAgent = userAgentParser.parse();
  return new webfont.GoogleFontApi(userAgent,
      new webfont.DomHelper(document), configuration);
});
