goog.provide('webfont.modules.Custom');

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
webfont.modules.Custom = function(domHelper, configuration) {
  this.domHelper_ = domHelper;
  this.configuration_ = configuration;
};

webfont.modules.Custom.NAME = 'custom';

goog.scope(function () {
  var Custom = webfont.modules.Custom,
      Font = webfont.Font;

  Custom.prototype.load = function(onReady) {
    var i, len;
    var urls = this.configuration_['urls'] || [];
    var familiesConfiguration = this.configuration_['families'] || [];

    for (i = 0, len = urls.length; i < len; i++) {
      this.domHelper_.loadStylesheet(urls[i]);
    }

    var fonts = [];

    for (i = 0, len = familiesConfiguration.length; i < len; i++) {
      var components = familiesConfiguration[i].split(":");

      if (components[1]) {
        var variations = components[1].split(",");

        for (var j = 0; j < variations.length; j += 1) {
          fonts.push(new Font(components[0], variations[j]));
        }
      } else {
        fonts.push(new Font(components[0]));
      }
    }

    onReady(fonts);
  };

  Custom.prototype.supportUserAgent = function(userAgent, support) {
    return support(userAgent.getBrowserInfo().hasWebFontSupport());
  };
});

globalNamespaceObject.addModule(webfont.modules.Custom.NAME, function(configuration, domHelper) {
  return new webfont.modules.Custom(domHelper, configuration);
});
