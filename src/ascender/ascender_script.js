goog.provide('webfont.AscenderScript');

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
  var AscenderScript = webfont.AscenderScript;

  AscenderScript.prototype.supportUserAgent = function(userAgent, support) {
    return support(userAgent.getBrowserInfo().hasWebFontSupport());
  };

  AscenderScript.prototype.load = function(onReady) {
    var key = this.configuration_['key'];
    var protocol = this.domHelper_.getProtocol();
    var url = protocol + '//webfonts.fontslive.com/css/' + key + '.css';
    this.domHelper_.insertInto('head', this.domHelper_.createCssLink(url));
    var fv = this.parseFamiliesAndVariations(this.configuration_['families']);
    onReady(fv.families, fv.variations);
  };

  AscenderScript.prototype.parseFamiliesAndVariations = function(providedFamilies){
    var families, variations, fv;
    families = [];
    variations = {};
    for(var i = 0, len = providedFamilies.length; i < len; i++){
      fv = this.parseFamilyAndVariations(providedFamilies[i]);
      families.push(fv.family);
      variations[fv.family] = fv.variations;
    }
    return { families:families, variations:variations };
  };

  AscenderScript.prototype.parseFamilyAndVariations = function(providedFamily){
    var family, variations, parts;
    parts = providedFamily.split(':');
    family = parts[0];
    variations = [];
    if(parts[1]){
      variations = this.parseVariations(parts[1]);
    }else{
      variations = ['n4'];
    }
    return { family:family, variations:variations };
  };

  AscenderScript.prototype.parseVariations = function(source){
    var providedVariations = source.split(',');
    var variations = [];
    for(var i = 0, len = providedVariations.length; i < len; i++){
      var pv = providedVariations[i];
      if(pv){
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
