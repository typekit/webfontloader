webfont.FontApiParser = function(fontFamilies) {
  this.fontFamilies_ = fontFamilies;
  this.parsedFontFamilies_ = [];
  this.variations_ = {};
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
      var cssRules = this.parseVariations_(pair[1]);

      if (cssRules.length > 0) {
        variations = cssRules;
      }
    }
    this.parsedFontFamilies_.push(fontFamily);
    this.variations_[fontFamily] = variations;
  }
};

webfont.FontApiParser.prototype.generateCssRule_ = function(variation) {
  if (!variation.match(/^[\w ]+$/)) {
    return '';
  }
  var sb = [];
  var groups = variation.match(/^(\d*)(\w*)$/);
  var numericWeight = groups[1];
  var variationString = groups[2];

  if (variationString) {
    var normalizedVariation = webfont.FontApiParser.VARIATIONS[variationString];
    var cssRule = webfont.FontApiParser.VARIATIONS_TO_CSS[normalizedVariation];

    if (cssRule) {
      sb.push(cssRule);
    }
  }
  if (numericWeight) {
    sb.push('font-weight: ' + numericWeight);
  }
  return sb.join(';');
};

webfont.FontApiParser.prototype.parseVariations_ = function(variations) {
  var finalVariations = [];
  var providedVariations = variations.split(",");
  var length = providedVariations.length;

  for (var i = 0; i < length; i++) {
    var variation = providedVariations[i];
    var cssRule = this.generateCssRule_(variation);

    if (cssRule) {
      finalVariations.push(cssRule);
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
