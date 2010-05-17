webfont.FontApiParser = function(fontFamilies) {
  this.fontFamilies_ = fontFamilies;
  this.parsedFontFamilies_ = [];
  this.variations_ = {};
  this.fvd_ = new webfont.FontVariationDescription();
};

webfont.FontApiParser.VARIATIONS = {
  'ultralight': 'ultralight',
  'light': 'light',
  'regular': 'regular',
  'bold': 'bold',
  'italic': 'italic',
  'bolditalic': 'bolditalic',
  'ul': 'ultralight',
  'l': 'light',
  'r': 'regular',
  'b': 'bold',
  'i': 'italic',
  'bi': 'bolditalic'
};

webfont.FontApiParser.VARIATIONS = {
  'ultralight': 'n2',
  'light': 'n3',
  'regular': 'i4',
  'bold': 'i7',
  'italic': 'i4',
  'bolditalic': 'i7',
  'ul': 'n2',
  'l': 'n3',
  'r': 'n4',
  'b': 'n7',
  'i': 'i4',
  'bi': 'i7'
};

webfont.FontApiParser.VARIATIONS_TO_CSS = {
  'ultralight': 'font-weight: 200',
  'light': 'font-weight: 300',
  'regular': 'font-style: normal;font-weight: normal',
  'bold': 'font-weight: bold',
  'italic': 'font-style: italic',
  'bolditalic': 'font-style: italic;font-weight: bold'
};

webfont.FontApiParser.prototype.parse = function() {
  var length = this.fontFamilies_.length;

  for (var i = 0; i < length; i++) {
    var pair = this.fontFamilies_[i].split(":");
    var fontFamily = pair[0];
    var variations = null;

    if (pair.length == 2) {
      var fvds = this.parseVariations_(pair[1]);

      if (fvds.length > 0) {
        variations = fvds;
      }
    }
    this.parsedFontFamilies_.push(fontFamily);
    this.variations_[fontFamily] = variations;
  }
};

webfont.FontApiParser.prototype.generateFontVariationDescription_ = function(variation) {
  if (!variation.match(/^[\w ]+$/)) {
    return '';
  }

  var fvd = webfont.FontApiParser.VARIATIONS[variation];

  if (fvd) {
    return fvd;
  } else {
    var groups = variation.match(/^(\d*)(\w*)$/);
    var numericMatch = groups[1];
    var styleMatch = groups[2];
    var s = styleMatch ? styleMatch : 'n';
    var w = numericMatch ? numericMatch.substr(0, 1) : '4';
    var css = this.fvd_.expand([s, w].join(''));
    if (css) {
      return this.fvd_.compact(css);
    } else {
      return null;
    }
  }
};

webfont.FontApiParser.prototype.parseVariations_ = function(variations) {
  var finalVariations = [];
  var providedVariations = variations.split(",");
  var length = providedVariations.length;

  for (var i = 0; i < length; i++) {
    var variation = providedVariations[i];
    var fvd = this.generateFontVariationDescription_(variation);

    if (fvd) {
      finalVariations.push(fvd);
    }
  }
  return finalVariations;
};

webfont.FontApiParser.prototype.getFontFamilies = function() {
  return this.parsedFontFamilies_;
};

webfont.FontApiParser.prototype.getVariations = function() {
  return this.variations_;
};
