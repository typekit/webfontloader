describe('CssFontFamilyName', function () {
  var CssFontFamilyName = webfont.CssFontFamilyName,
      sanitizer = new CssFontFamilyName();

  describe('#quote', function () {
    it('should quote names with spaces', function () {
      expect(sanitizer.quote('My Family')).toEqual("'My Family'");
    });

    it('should quote names with spaces and double quotes', function () {
      expect(sanitizer.quote('"My Family"')).toEqual("'My Family'");
    });

    it('should quote names with spaces and single quotes', function () {
      expect(sanitizer.quote("'My Family'")).toEqual("'My Family'");
    });

    it('should quote multiple single quoted names separated with a comma', function () {
      expect(sanitizer.quote("'family 1','family 2'")).toEqual("'family 1','family 2'");
    });

    it('should quote multiple single quoted names separated with a comma and space', function () {
      expect(sanitizer.quote("'family 1', 'family 2'")).toEqual("'family 1','family 2'");
    });

    it('should not quote when there is no space', function () {
      expect(sanitizer.quote('MyFamily')).toEqual('MyFamily');
    });

    it('should remove quotes when they are unnecesssary', function () {
      expect(sanitizer.quote('"MyFamily"')).toEqual('MyFamily');
    });

    it('should not quote multiple names when there is no space', function () {
      expect(sanitizer.quote("'family-1', 'family-2'")).toEqual('family-1,family-2');
    });
  });
});
