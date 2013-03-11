goog.provide('webfont.AscenderScript');

goog.require('webfont.FontFamily');
goog.require('webfont.FontVariationDescription');

/**
 *
 * WebFont.load({
 *   ascender: {
 *     key:'ec2de397-11ae-4c10-937f-bf94283a70c1',
 *     families:['AyitaPro:regular,bold,bolditalic,italic']
 *   }
 * });
 *
 * @constructor
 * @implements {webfont.FontModule}
 */
webfont.AscenderScript = function(domHelper, configuration) {
  this.domHelper_ = domHelper;
  this.configuration_ = configuration;
};

webfont.AscenderScript.NAME = 'ascender';

webfont.AscenderScript.VARIATIONS = {
  'regular': 'n4',
  'bold': 'n7',
  'italic': 'i4',
  'bolditalic': 'i7',
  'r': 'n4',
  'b': 'n7',
  'i': 'i4',
  'bi': 'i7'
};

goog.scope(function () {
  var AscenderScript = webfont.AscenderScript,
      FontFamily = webfont.FontFamily,
      FontVariationDescription = webfont.FontVariationDescription;

  AscenderScript.prototype.supportUserAgent = function(userAgent, support) {
    return support(userAgent.getBrowserInfo().hasWebFontSupport());
  };

  AscenderScript.prototype.load = function(onReady) {
    var key = this.configuration_['key'];
    var protocol = this.domHelper_.getProtocol();
    var url = protocol + '//webfonts.fontslive.com/css/' + key + '.css';
    this.domHelper_.insertInto('head', this.domHelper_.createCssLink(url));
    var fv = this.parseFamiliesAndVariations(this.configuration_['families']);
    onReady(fv);
  };

  /**
   * @param {Array.<string>} providedFamilies
   * @return {Array.<webfont.FontFamily>}
   */
  AscenderScript.prototype.parseFamiliesAndVariations = function (providedFamilies) {
    var families = [];

    for (var i = 0, len = providedFamilies.length; i < len; i++) {
      families.push.apply(families, this.parseFamilyAndVariations(providedFamilies[i]));
    }
    return families;
  };

  /**
   * @param {string} providedFamily
   * @return {Array.<webfont.FontFamily>}
   */
  AscenderScript.prototype.parseFamilyAndVariations = function (providedFamily){
    var parts = providedFamily.split(':'),
        familyName = parts[0];

    if (parts[1]) {
      var variations = this.parseVariations(parts[1]),
          result = [];

      for (var i = 0; i < variations.length; i += 1) {
        result.push(new FontFamily(familyName, variations[i]));
      }
      return result;
    }
    return [new FontFamily(familyName)];
  };

  /**
   * @param {string} source
   * @return {Array.<webfont.FontVariationDescription>}
   */
  AscenderScript.prototype.parseVariations = function (source) {
    var providedVariations = source.split(','),
        variations = [];

    for (var i = 0, len = providedVariations.length; i < len; i++){
      var pv = providedVariations[i];

      if (pv) {
        var v = AscenderScript.VARIATIONS[pv];
        variations.push(new FontVariationDescription(v ? v : pv));
      }
    }
    return variations;
  };
});

globalNamespaceObject.addModule(webfont.AscenderScript.NAME, function(configuration, domHelper) {
  return new webfont.AscenderScript(domHelper, configuration);
});
