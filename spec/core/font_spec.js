describe('Font', function () {
  var Font = webfont.Font;

  describe('#quote', function () {
    var quote = function (font) {
      return new Font(font).getCssName();
    };

    it('should quote names with spaces', function () {
      expect(quote('My Family')).toEqual("'My Family'");
    });

    it('should quote names with spaces and double quotes', function () {
      expect(quote('"My Family"')).toEqual("'My Family'");
    });

    it('should quote names with spaces and single quotes', function () {
      expect(quote("'My Family'")).toEqual("'My Family'");
    });

    it('should quote multiple single quoted names separated with a comma', function () {
      expect(quote("'family 1','family 2'")).toEqual("'family 1','family 2'");
    });

    it('should quote multiple single quoted names separated with a comma and space', function () {
      expect(quote("'family 1', 'family 2'")).toEqual("'family 1','family 2'");
    });

    it('should not quote when there is no space', function () {
      expect(quote('MyFamily')).toEqual('MyFamily');
    });

    it('should remove quotes when they are unnecesssary', function () {
      expect(quote('"MyFamily"')).toEqual('MyFamily');
    });

    it('should not quote multiple names when there is no space', function () {
      expect(quote("'family-1', 'family-2'")).toEqual('family-1,family-2');
    });
  });

  describe('#toCssString', function () {
    function toCssString(fvd) {
      return new Font('My Family', fvd).toCssString();
    }

    it('should expand font styles correctly', function () {
      expect(toCssString('n4')).toEqual("normal 400 300px 'My Family'");
      expect(toCssString('i4')).toEqual("italic 400 300px 'My Family'");
      expect(toCssString('o4')).toEqual("oblique 400 300px 'My Family'");
    });

    it('should expand weights correctly', function () {
      for (var i = 1; i < 10; i += 1) {
        expect(toCssString('n' + i)).toEqual("normal " + (i * 100) + " 300px 'My Family'");
      }
    });
  });

  describe('#getCssVariation', function () {
    function toCss(fvd) {
      return new Font('My Family', fvd).getCssVariation();
    }

    it('should expand font-style', function () {
      expect(toCss('n4')).toEqual('font-style:normal;font-weight:400;');
      expect(toCss('i4')).toEqual('font-style:italic;font-weight:400;');
      expect(toCss('o4')).toEqual('font-style:oblique;font-weight:400;');
    });

    it('should expand weights correctly', function () {
      for (var i = 1; i < 10; i += 1) {
        expect(toCss('n' + i)).toEqual('font-style:normal;font-weight:' + (i * 100) + ';');
      }
    });

    it('should not expand incorrect input', function () {
      expect(toCss('')).toEqual('font-style:normal;font-weight:400;');
      expect(toCss('n')).toEqual('font-style:normal;font-weight:400;');
      expect(toCss('1')).toEqual('font-style:normal;font-weight:400;');
      expect(toCss('n1x')).toEqual('font-style:normal;font-weight:400;');
    });
  });

  describe('parseCssVariation', function () {
    function toFvd(css) {
      return Font.parseCssVariation(css);
    }

    it('should default to n4 when there is no description', function () {
      expect(toFvd('')).toEqual('n4');
      expect(toFvd(null)).toEqual('n4');
      expect(toFvd(undefined)).toEqual('n4');
    });

    it('should compact font style', function () {
      expect(toFvd('font-style: normal;')).toEqual('n4');
      expect(toFvd('font-style: italic;')).toEqual('i4');
      expect(toFvd('font-style: oblique;')).toEqual('o4');
    });

    it('should return the default value when font-style is incorrect', function () {
      expect(toFvd('font-style: other;')).toEqual('n4');
    });

    it('should compact font weight', function () {
      expect(toFvd('font-weight: normal;')).toEqual('n4');
      expect(toFvd('font-weight: bold;')).toEqual('n7');
      for (var i = 1; i < 10; i += 1) {
        expect(toFvd('font-weight: ' + (i * 100) + ';')).toEqual('n' + i);
      }
    });

    it('should return the default value when font-weight is incorrect', function () {
      expect(toFvd('font-weight: 140;')).toEqual('n4');
      expect(toFvd('font-weight: other;')).toEqual('n4');
    });

    it('should compact multiple properties', function () {
      expect(toFvd('font-weight: bold; font-style: italic;')).toEqual('i7');
      expect(toFvd('; font-weight: bold; font-style: italic;')).toEqual('i7');
      expect(toFvd('font-style:italic;font-weight:bold;')).toEqual('i7');
      expect(toFvd('   font-style:   italic    ;\n\nfont-weight:   bold;  ')).toEqual('i7');
    });

    it('should return default values for incorrect individual properties', function () {
      expect(toFvd('src: url(/font.otf)')).toEqual('n4');
      expect(toFvd('font-weight: 900; src: url(/font.otf);')).toEqual('n9');
      expect(toFvd('font-weight: 800; font-stretch:condensed;')).toEqual('n8');
    });
  });
});
