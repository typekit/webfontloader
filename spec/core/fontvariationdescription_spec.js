describe('FontVariationDescription', function () {
  var FontVariationDescription = webfont.FontVariationDescription,
      fvd = new FontVariationDescription();

  describe('#compact', function () {
    it('should default to n4 when there is no description', function () {
      expect(fvd.compact('')).toEqual('n4');
    });

    it('should compact font style', function () {
      expect(fvd.compact('font-style: normal;')).toEqual('n4');
      expect(fvd.compact('font-style: italic;')).toEqual('i4');
      expect(fvd.compact('font-style: oblique;')).toEqual('o4');
    });

    it('should return the default value when font-style is incorrect', function () {
      expect(fvd.compact('font-style: other;')).toEqual('n4');
    });

    it('should compact font weight', function () {
      expect(fvd.compact('font-weight: normal;')).toEqual('n4');
      expect(fvd.compact('font-weight: bold;')).toEqual('n7');
      for (var i = 1; i < 10; i += 1) {
        expect(fvd.compact('font-weight: ' + (i * 100) + ';')).toEqual('n' + i);
      }
    });

    it('should return the default value when font-weight is incorrect', function () {
      expect(fvd.compact('font-weight: 140;')).toEqual('n4');
      expect(fvd.compact('font-weight: other;')).toEqual('n4');
    });

    it('should compact multiple properties', function () {
      expect(fvd.compact('font-weight: bold; font-style: italic;')).toEqual('i7');
      expect(fvd.compact('; font-weight: bold; font-style: italic;')).toEqual('i7');
      expect(fvd.compact('font-style:italic;font-weight:bold;')).toEqual('i7');
      expect(fvd.compact('   font-style:   italic    ;\n\nfont-weight:   bold;  ')).toEqual('i7');
    });

    it('should return default values for incorrect individual properties', function () {
      expect(fvd.compact('src: url(/font.otf)')).toEqual('n4');
      expect(fvd.compact('font-weight: 900; src: url(/font.otf);')).toEqual('n9');
      expect(fvd.compact('font-weight: 800; font-stretch:condensed;')).toEqual('n8');
    });
  });

  describe('#expand', function () {
    it('should expand font-style', function () {
      expect(fvd.expand('n4')).toEqual('font-style:normal;font-weight:400;');
      expect(fvd.expand('i4')).toEqual('font-style:italic;font-weight:400;');
      expect(fvd.expand('o4')).toEqual('font-style:oblique;font-weight:400;');
    });

    it('should expand weights correctly', function () {
      for (var i = 1; i < 10; i += 1) {
        expect(fvd.expand('n' + i)).toEqual('font-style:normal;font-weight:' + (i * 100) + ';');
      }
    });

    it('should not expand incorrect input', function () {
      expect(fvd.expand('')).toBeNull();
      expect(fvd.expand('n')).toBeNull();
      expect(fvd.expand('1')).toBeNull();
      expect(fvd.expand('n1x')).toBeNull();
    });
  });
});
