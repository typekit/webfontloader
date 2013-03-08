describe('FontVariationDescription', function () {
  var FontVariationDescription = webfont.FontVariationDescription;

  function toFvd(css) {
    return new FontVariationDescription(css).toString();
  }

  function toCss(fvd) {
    return new FontVariationDescription(fvd).toCss();
  }

  describe('#compact', function () {
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

  describe('#expand', function () {
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
});
