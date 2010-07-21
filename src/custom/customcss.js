/**
 *
 * WebFont.load({
 *   custom: {
 *     families: ['Font1', 'Font2'],
 *    urls: [ 'http://moo', 'http://meuh' ] }
 * });
 *
 * @constructor
 */
webfont.CustomCss = function(domHelper, configuration) {
  this.domHelper_ = domHelper;
  this.configuration_ = configuration;
};

webfont.CustomCss.NAME = 'custom';

webfont.CustomCss.prototype.load = function(onReady) {
  var urls = this.configuration_['urls'] || [];
  var families = this.configuration_['families'] || [];

  for (var i = 0, len = urls.length; i < len; i++) {
    var url = urls[i];

    this.domHelper_.insertInto('head', this.domHelper_.createCssLink(url));
  }
  onReady(families);
};

webfont.CustomCss.prototype.supportUserAgent = function(userAgent, support) {
  return support(userAgent.isSupportingWebFont());
};

window['WebFont'].addModule(webfont.CustomCss.NAME, function(configuration) {
  var userAgentParser = new webfont.UserAgentParser(navigator.userAgent);
  var userAgent = userAgentParser.parse();
  var domHelper = new webfont.DomHelper(document, userAgent);
  return new webfont.CustomCss(domHelper, configuration);
});
