describe('AscenderScript', function () {
  var AscenderScript = webfont.AscenderScript;

  var configuration = {
    key: 'ec2de397-11ae-4c10-937f-bf94283a70c1',
    families: ['AndyBold', 'Arial:bold,regular']
  };

  describe('load family and variations', function () {
    var fakeDomHelper = {
      insertInto: jasmine.createSpy('insertInto'),
      createCssLink: jasmine.createSpy('createCssLink'),
      getProtocol: jasmine.createSpy('getProtocol').andReturn('http:')
    };

    var fakeOnReady = jasmine.createSpy('onReady');

    var as = new AscenderScript(fakeDomHelper, configuration);

    as.load(fakeOnReady);

    it('should create the link correctly', function () {
      expect(fakeDomHelper.createCssLink).toHaveBeenCalledWith('http://webfonts.fontslive.com/css/ec2de397-11ae-4c10-937f-bf94283a70c1.css');
      expect(fakeDomHelper.insertInto.calls[0].args[0]).toEqual('head');
    });

    it('should parse variations correctly', function () {
      expect(as.parseVariations('regular')).toEqual(['n4']);
      expect(as.parseVariations('bold')).toEqual(['n7']);
      expect(as.parseVariations('italic')).toEqual(['i4']);
      expect(as.parseVariations('bolditalic')).toEqual(['i7']);
      expect(as.parseVariations('regular,')).toEqual(['n4']);
      expect(as.parseVariations('regular,bold')).toEqual(['n4', 'n7']);
      expect(as.parseVariations('regular,,bold')).toEqual(['n4', 'n7']);
      expect(as.parseVariations('n4,n7')).toEqual(['n4', 'n7']);
    });
  })
});
