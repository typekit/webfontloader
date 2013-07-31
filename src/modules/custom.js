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

/**
 * @const
 * @type {string}
 */
webfont.modules.Custom.NAME = 'custom';

goog.scope(function () {
  var Custom = webfont.modules.Custom,
      Font = webfont.Font;

  Custom.prototype.load = function(onReady) {
    var i, len;
    var urls = this.configuration_['urls'] || [];
    var familiesConfiguration = this.configuration_['families'] || [];

    for (i = 0, len = urls.length; i < len; i++) {
      var url = urls[i];

      this.domHelper_.insertInto('head', this.domHelper_.createCssLink(url));
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
