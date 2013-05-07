describe('modules.Ascender', function () {
  var Ascender = webfont.modules.Ascender,
      Font = webfont.Font;

  var configuration = {
    key: 'ec2de397-11ae-4c10-937f-bf94283a70c1',
    families: ['AndyBold', 'Arial:bold,regular']
  };

  describe('load family and variations', function () {
    var fakeDomHelper = null,
        fakeOnReady = null,
        ascender = null;

    beforeEach(function () {
      fakeDomHelper = {
        insertInto: jasmine.createSpy('insertInto'),
        createCssLink: jasmine.createSpy('createCssLink'),
        getProtocol: jasmine.createSpy('getProtocol').andReturn('http:')
      };

      fakeOnReady = jasmine.createSpy('onReady');

      ascender = new Ascender(fakeDomHelper, configuration);
      ascender.load(fakeOnReady);
    });

    it('should create the link correctly', function () {
      expect(fakeDomHelper.createCssLink).toHaveBeenCalledWith('http://webfonts.fontslive.com/css/ec2de397-11ae-4c10-937f-bf94283a70c1.css');
      expect(fakeDomHelper.insertInto.calls[0].args[0]).toEqual('head');
    });

    it('should pass the fonts correctly', function () {
      expect(fakeOnReady).toHaveBeenCalledWith([
        new Font('AndyBold', 'n4'),
        new Font('Arial', 'n7'),
        new Font('Arial', 'n4')
      ]);
    });

    it('should parse variations correctly', function () {
      expect(ascender.parseVariations('regular')).toEqual(['n4']);
      expect(ascender.parseVariations('bold')).toEqual(['n7']);
      expect(ascender.parseVariations('italic')).toEqual(['i4']);
      expect(ascender.parseVariations('bolditalic')).toEqual(['i7']);
      expect(ascender.parseVariations('regular,')).toEqual(['n4']);
      expect(ascender.parseVariations('regular,bold')).toEqual(['n4', 'n7']);
      expect(ascender.parseVariations('regular,,bold')).toEqual(['n4', 'n7']);
      expect(ascender.parseVariations('n4,n7')).toEqual(['n4', 'n7']);
    });

    it('should parse font families correctly', function () {
      expect(ascender.parseFamilyAndVariations('Arial')).toEqual([new Font('Arial')]);
      expect(ascender.parseFamilyAndVariations('Arial:bold,regular')).toEqual([new Font('Arial', 'n7'), new Font('Arial', 'n4')]);
      expect(ascender.parseFamilyAndVariations('Arial:n4,n7')).toEqual([new Font('Arial', 'n4'), new Font('Arial', 'n7')]);
    });

    it('should parse multiple font families correctly', function () {
      expect(ascender.parseFamiliesAndVariations(['Arial', 'Sans:n4,n7'])).toEqual([
        new Font('Arial', 'n4'),
        new Font('Sans', 'n4'),
        new Font('Sans', 'n7')
      ]);
    });
  })
});
