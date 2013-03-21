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
});
