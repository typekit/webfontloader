goog.provide('webfont.modules.google.FontApiParser');

goog.require('webfont.Font');

/**
 * @constructor
 */
webfont.modules.google.FontApiParser = function(fontFamilies) {
  this.fontFamilies_ = fontFamilies;
  this.parsedFonts_ = [];
  this.fontTestStrings_ = {};
};

webfont.modules.google.FontApiParser.INT_FONTS = {
  'latin': webfont.FontWatchRunner.DEFAULT_TEST_STRING,
  'latin-ext': '\u00E7\u00F6\u00FC\u011F\u015F',
  'cyrillic': '\u0439\u044f\u0416',
  'greek': '\u03b1\u03b2\u03a3',
  'khmer': '\u1780\u1781\u1782',
  'Hanuman': '\u1780\u1781\u1782' // For backward compatibility
};

webfont.modules.google.FontApiParser.WEIGHTS = {
  'thin': '1',
  'extralight': '2',
  'extra-light': '2',
  'ultralight': '2',
  'ultra-light': '2',
  'light': '3',
  'regular': '4',
  'book': '4',
  'medium': '5',
  'semi-bold': '6',
  'semibold': '6',
  'demi-bold': '6',
  'demibold': '6',
  'bold': '7',
  'extra-bold': '8',
  'extrabold': '8',
  'ultra-bold': '8',
  'ultrabold': '8',
  'black': '9',
  'heavy': '9',
  'l': '3',
  'r': '4',
  'b': '7'
};

webfont.modules.google.FontApiParser.STYLES = {
  'i': 'i',
  'italic': 'i',
  'n': 'n',
  'normal': 'n'
};

webfont.modules.google.FontApiParser.VARIATION_MATCH =
    new RegExp("^(thin|(?:(?:extra|ultra)-?)?light|regular|book|medium|" +
        "(?:(?:semi|demi|extra|ultra)-?)?bold|black|heavy|l|r|b|[1-9]00)?(n|i" +
        "|normal|italic)?$");

goog.scope(function () {
  var FontApiParser = webfont.modules.google.FontApiParser,
      Font = webfont.Font;

  FontApiParser.prototype.parse = function() {
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
            var fontTestString = FontApiParser.INT_FONTS[subsets[0]];

            if (fontTestString) {
              this.fontTestStrings_[fontFamily] = fontTestString;
            }
          }
        }
      }

      // For backward compatibility
      if (!this.fontTestStrings_[fontFamily]) {
        var hanumanTestString = FontApiParser.INT_FONTS[fontFamily];
        if (hanumanTestString) {
          this.fontTestStrings_[fontFamily] = hanumanTestString;
        }
      }

      for (var j = 0; j < variations.length; j += 1) {
        this.parsedFonts_.push(new Font(fontFamily, variations[j]));
      }
    }
  };

  FontApiParser.prototype.generateFontVariationDescription_ = function(variation) {
    if (!variation.match(/^[\w-]+$/)) {
      return '';
    }
    var normalizedVariation = variation.toLowerCase();
    var groups = FontApiParser.VARIATION_MATCH.exec(normalizedVariation);
    if (groups == null) {
      return '';
    }
    var styleMatch = this.normalizeStyle_(groups[2]);
    var weightMatch = this.normalizeWeight_(groups[1]);
    return [styleMatch, weightMatch].join('');
  };


  FontApiParser.prototype.normalizeStyle_ = function(parsedStyle) {
    if (parsedStyle == null || parsedStyle == '') {
      return 'n';
    }
    return FontApiParser.STYLES[parsedStyle];
  };


  FontApiParser.prototype.normalizeWeight_ = function(parsedWeight) {
    if (parsedWeight == null || parsedWeight == '') {
      return '4';
    }
    var weight = FontApiParser.WEIGHTS[parsedWeight];
    if (weight) {
      return weight;
    }
    if (isNaN(parsedWeight)) {
      return '4';
    }
    return parsedWeight.substr(0, 1);
  };


  FontApiParser.prototype.parseVariations_ = function(variations) {
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


  FontApiParser.prototype.parseSubsets_ = function(subsets) {
    var finalSubsets = [];

    if (!subsets) {
      return finalSubsets;
    }
    return subsets.split(",");
  };


  FontApiParser.prototype.getFonts = function() {
    return this.parsedFonts_;
  };

  FontApiParser.prototype.getFontTestStrings = function() {
    return this.fontTestStrings_;
  };
});
