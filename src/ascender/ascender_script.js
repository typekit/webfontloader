goog.provide('webfont.AscenderScript');

goog.require('webfont.Font');

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
      Font = webfont.Font;

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
   * @return {Array.<webfont.Font>}
   */
  AscenderScript.prototype.parseFamiliesAndVariations = function (providedFamilies) {
    var fonts = [];

    for (var i = 0, len = providedFamilies.length; i < len; i++) {
      fonts.push.apply(fonts, this.parseFamilyAndVariations(providedFamilies[i]));
    }
    return fonts;
  };

  /**
   * @param {string} providedFamily
   * @return {Array.<webfont.Font>}
   */
  AscenderScript.prototype.parseFamilyAndVariations = function (providedFamily){
    var parts = providedFamily.split(':'),
        familyName = parts[0];

    if (parts[1]) {
      var variations = this.parseVariations(parts[1]),
          result = [];

      for (var i = 0; i < variations.length; i += 1) {
        result.push(new Font(familyName, variations[i]));
      }
      return result;
    }
    return [new Font(familyName)];
  };

  /**
   * @param {string} source
   * @return {Array.<string>}
   */
  AscenderScript.prototype.parseVariations = function (source) {
    var providedVariations = source.split(','),
        variations = [];

    for (var i = 0, len = providedVariations.length; i < len; i++){
      var pv = providedVariations[i];

      if (pv) {
        var v = AscenderScript.VARIATIONS[pv];
        variations.push(v ? v : pv);
      }
    }
    return variations;
  };
});

globalNamespaceObject.addModule(webfont.AscenderScript.NAME, function(configuration, domHelper) {
  return new webfont.AscenderScript(domHelper, configuration);
});
