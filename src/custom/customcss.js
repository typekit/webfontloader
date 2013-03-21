goog.provide('webfont.CustomCss');

goog.require('webfont.Font');

/**
 *
 * WebFont.load({
 *   custom: {
 *     families: ['Font1', 'Font2'],
 *    urls: [ 'http://moo', 'http://meuh' ] }
 * });
 *
 * @constructor
 * @implements {webfont.FontModule}
 */
webfont.CustomCss = function(domHelper, configuration) {
  this.domHelper_ = domHelper;
  this.configuration_ = configuration;
};

webfont.CustomCss.NAME = 'custom';

goog.scope(function () {
  var CustomCss = webfont.CustomCss,
      Font = webfont.Font;

  CustomCss.prototype.load = function(onReady) {
    var i, len;
    var urls = this.configuration_['urls'] || [];
    var familiesConfiguration = this.configuration_['families'] || [];

    for (i = 0, len = urls.length; i < len; i++) {
      var url = urls[i];

      this.domHelper_.insertInto('head', this.domHelper_.createCssLink(url));
    }

    var families = [];

    for (i = 0, len = familiesConfiguration.length; i < len; i++) {
      var components = familiesConfiguration[i].split(":");

      if (components[1]) {
        var variations = components[1].split(",");

        for (var j = 0; j < variations.length; j += 1) {
          families.push(new Font(components[0], variations[j]));
        }
      } else {
        families.push(new Font(components[0]));
      }
    }

    onReady(families);
  };

  CustomCss.prototype.supportUserAgent = function(userAgent, support) {
    return support(userAgent.getBrowserInfo().hasWebFontSupport());
  };
});

globalNamespaceObject.addModule(webfont.CustomCss.NAME, function(configuration, domHelper) {
  return new webfont.CustomCss(domHelper, configuration);
});
