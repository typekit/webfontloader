describe('AscenderScript', function () {
  var AscenderScript = webfont.AscenderScript,
      Font = webfont.Font;

  var configuration = {
    key: 'ec2de397-11ae-4c10-937f-bf94283a70c1',
    families: ['AndyBold', 'Arial:bold,regular']
  };

  describe('load family and variations', function () {
    var fakeDomHelper = null,
        fakeOnReady = null,
        ascenderScript = null;

    beforeEach(function () {
      fakeDomHelper = {
        insertInto: jasmine.createSpy('insertInto'),
        createCssLink: jasmine.createSpy('createCssLink'),
        getProtocol: jasmine.createSpy('getProtocol').andReturn('http:')
      };

      fakeOnReady = jasmine.createSpy('onReady');

      ascenderScript = new AscenderScript(fakeDomHelper, configuration);
      ascenderScript.load(fakeOnReady);
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
      expect(ascenderScript.parseVariations('regular')).toEqual(['n4']);
      expect(ascenderScript.parseVariations('bold')).toEqual(['n7']);
      expect(ascenderScript.parseVariations('italic')).toEqual(['i4']);
      expect(ascenderScript.parseVariations('bolditalic')).toEqual(['i7']);
      expect(ascenderScript.parseVariations('regular,')).toEqual(['n4']);
      expect(ascenderScript.parseVariations('regular,bold')).toEqual(['n4', 'n7']);
      expect(ascenderScript.parseVariations('regular,,bold')).toEqual(['n4', 'n7']);
      expect(ascenderScript.parseVariations('n4,n7')).toEqual(['n4', 'n7']);
    });

    it('should parse font families correctly', function () {
      expect(ascenderScript.parseFamilyAndVariations('Arial')).toEqual([new Font('Arial')]);
      expect(ascenderScript.parseFamilyAndVariations('Arial:bold,regular')).toEqual([new Font('Arial', 'n7'), new Font('Arial', 'n4')]);
      expect(ascenderScript.parseFamilyAndVariations('Arial:n4,n7')).toEqual([new Font('Arial', 'n4'), new Font('Arial', 'n7')]);
    });

    it('should parse multiple font families correctly', function () {
      expect(ascenderScript.parseFamiliesAndVariations(['Arial', 'Sans:n4,n7'])).toEqual([
        new Font('Arial', 'n4'),
        new Font('Sans', 'n4'),
        new Font('Sans', 'n7')
      ]);
    });
  })
});
