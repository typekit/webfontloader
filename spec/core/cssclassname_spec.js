describe('CssClassName', function () {
  var CssClassName = webfont.CssClassName,
      sanitizer = new CssClassName();

  describe('#sanitize', function () {
    it('should sanitize spaces in names', function () {
      expect(sanitizer.sanitize(' My Family ')).toEqual('myfamily');
    });

    it('should sanitize numbers in names', function () {
      expect(sanitizer.sanitize('99 My Family 99')).toEqual('99myfamily99');;
    });

    it('should sanitize other characters', function () {
      expect(sanitizer.sanitize('_My+Family!-')).toEqual('myfamily');
    });
  });

  describe('#build', function () {
    it('should build many parts', function () {
      expect(sanitizer.build('pre_', 'My Family', '_post')).toEqual('pre-myfamily-post');
    });

    it('should build some parts', function () {
      expect(sanitizer.build('pre!', 'My Family')).toEqual('pre-myfamily');
    });
  });

  describe('#constructor', function () {
    it('should use a hyphen as a default separator', function () {
      var sanitizer = new CssClassName();

      expect(sanitizer.build('pre', 'post')).toEqual('pre-post');
    });

    it('should use the configured separator', function () {
      var sanitizer = new CssClassName('_');

      expect(sanitizer.build('pre', 'post')).toEqual('pre_post');
    });
  });
});
