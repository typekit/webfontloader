/**
 * @constructor
 */
webfont.FontApiParser = function(fontFamilies) {
  this.fontFamilies_ = fontFamilies;
  this.parsedFontFamilies_ = [];
  this.variations_ = {};
  this.fontTestStrings_ = {};
  this.fvd_ = new webfont.FontVariationDescription();
};

webfont.FontApiParser.VARIATIONS = {
  'ultralight': 'n2',
  'light': 'n3',
  'regular': 'n4',
  'bold': 'n7',
  'italic': 'i4',
  'bolditalic': 'i7',
  'ul': 'n2',
  'l': 'n3',
  'r': 'n4',
  'b': 'n7',
  'i': 'i4',
  'bi': 'i7'
};

webfont.FontApiParser.INT_FONTS = {
  'latin': webfont.FontWatchRunner.DEFAULT_TEST_STRING,
  'cyrillic': '&#1081;&#1103;&#1046;',
  'greek': '&#945;&#946;&#931;',
  'khmer': '&#x1780;&#x1781;&#x1782;',
  'Hanuman': '&#x1780;&#x1781;&#x1782;' // For backward compatibility
};

webfont.FontApiParser.prototype.parse = function() {
  var length = this.fontFamilies_.length;

  for (var i = 0; i < length; i++) {
    var elements = this.fontFamilies_[i].split(":");
    var fontFamily = elements[0].replace(/\+/g, " ");
    var variations = ['n4'];

    if (elements.length >= 2) {
      var fvds = this.parseVariations_(elements[1]);

      if (fvds.length > 0) {
        variations = fvds;
      }
      if (elements.length == 3) {
        var subsets = this.parseSubsets_(elements[2]);
        if (subsets.length > 0) {
          var fontTestString = webfont.FontApiParser.INT_FONTS[subsets[0]];

          if (fontTestString) {
	    this.fontTestStrings_[fontFamily] = fontTestString;
	  }
	}
      }
    }

    // For backward compatibility
    if (!this.fontTestStrings_[fontFamily]) {
      var hanumanTestString = webfont.FontApiParser.INT_FONTS[fontFamily];
      if (hanumanTestString) {
        this.fontTestStrings_[fontFamily] = hanumanTestString;
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

  if (!variations) {
    return finalVariations;
  }
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


webfont.FontApiParser.prototype.parseSubsets_ = function(subsets) {
  var finalSubsets = [];

  if (!subsets) {
    return finalSubsets;
  }
  return subsets.split(",");
};


webfont.FontApiParser.prototype.getFontFamilies = function() {
  return this.parsedFontFamilies_;
};

webfont.FontApiParser.prototype.getVariations = function() {
  return this.variations_;
};

webfont.FontApiParser.prototype.getFontTestStrings = function() {
  return this.fontTestStrings_;
};
