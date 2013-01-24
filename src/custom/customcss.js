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
  var familiesConfiguration = this.configuration_['families'] || [];

  for (var i = 0, len = urls.length; i < len; i++) {
	var url = urls[i];
    this.domHelper_.insertInto('head', this.domHelper_.createCssLink(url));
  }

  var families = [];
  var variations = {};
  var testStrings = {};

  for (var i = 0, len = familiesConfiguration.length; i < len; i++) {
    var components = familiesConfiguration[i].split(':');
    var family = components[0];
    var familyVariations = components[1];
    var familyTestString = components[2];

    families.push(family);

    if (familyVariations) {
      var newVariations = familyVariations.split(',');
      var existingVariations = variations[family];
      if (existingVariations) {
        variations[family] = existingVariations.concat(newVariations);
      } else {
        variations[family] = newVariations;
      }
    }

    if (familyTestString) {
      testStrings[family] = familyTestString;
    }
  }

  onReady(families, variations, testStrings);
};

webfont.CustomCss.prototype.supportUserAgent = function(userAgent, support) {
  return support(userAgent.isSupportingWebFont());
};

globalNamespaceObject.addModule(webfont.CustomCss.NAME, function(configuration, domHelper) {
  return new webfont.CustomCss(domHelper, configuration);
});
