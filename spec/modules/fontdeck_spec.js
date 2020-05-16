describe('modules.Fontdeck', function () {
  var Fontdeck = webfont.modules.Fontdeck,
      Font = webfont.Font;

  var configuration = {
    id: '2282'
  };

  var apiResponse = {
    "domain" : "localhost",
    "cssurl" : "https://f.fontdeck.com/s/css/03BmCXiV2AHwX/Rp+OBFTfD2oFs/localhost/2282.css",
    "project" : 2282,
    "cssbase" : "https://f.fontdeck.com/s/css/03BmCXiV2AHwX/Rp+OBFTfD2oFs",
    "fonts" : [
      {
        "font_family" : "'Fertigo Pro Regular', Fertigo, Constantia, Palatino, serif",
        "font_size_adjust" : 0.508,
        "name" : "Fertigo Pro Regular",
        "style" : "normal",
        "weight" : "normal",
        "font_urls" : {
          "eot" : "https://f.fontdeck.com/f/1/SUlFR0tid0kAA2vb11Ly/IGWDK+wV8TMAfV0J1Ej1J1GFRT1bssqrn6a.eot",
          "ttf" : "https://f.fontdeck.com/f/1/SUlFR0tid0kAA2vb11Ly/IGWDK+wV8TMAfV0J1Ej1J1GFRT1bssqrn6a.ttf",
          "woff" : "https://f.fontdeck.com/f/1/SUlFR0tid0kAA2vb11Ly/IGWDK+wV8TMAfV0J1Ej1J1GFRT1bssqrn6a.woff",
          "svg" : "https://f.fontdeck.com/f/1/SUlFR0tid0kAA2vb11Ly/IGWDK+wV8TMAfV0J1Ej1J1GFRT1bssqrn6a.svg#104"
        },
        "id" : 104
      },
      {
        "font_family" : "'Bodoni Display Bold Italic', Georgia, 'Times New Roman', Times, serif",
        "font_size_adjust" : 0.45,
        "name" : "Bodoni Display Bold Italic",
        "style" : "italic",
        "weight" : "bold",
        "font_urls" : {
          "eot" : "https://f.fontdeck.com/f/1/azJEbTVyc1QAA11+CAE5C93+l/bAQx1ipRo6Maba19w3Yy5ng+qVWlfj.eot",
          "ttf" : "https://f.fontdeck.com/f/1/azJEbTVyc1QAA11+CAE5C93+l/bAQx1ipRo6Maba19w3Yy5ng+qVWlfj.ttf",
          "woff" : "https://f.fontdeck.com/f/1/azJEbTVyc1QAA11+CAE5C93+l/bAQx1ipRo6Maba19w3Yy5ng+qVWlfj.woff",
          "svg" : "https://f.fontdeck.com/f/1/azJEbTVyc1QAA11+CAE5C93+l/bAQx1ipRo6Maba19w3Yy5ng+qVWlfj.svg#2256"
        },
        "id" : 2256
      }
    ]
  };

  var fakeDomHelper = null,
      global = null;

  beforeEach(function () {
    global = {
      location: {}
    };

    fakeDomHelper = {
      loadScript: jasmine.createSpy('loadScript'),
      getLoadWindow: jasmine.createSpy('getLoadWindow').andReturn(global),
      getHostName: function () { return 'test-host-name';  }
    };
  });

  describe('support and load life cycle', function () {
    var fontdeck = null,
        onReady = jasmine.createSpy('onReady');

    beforeEach(function () {
      fontdeck = new Fontdeck(fakeDomHelper, configuration);
      fontdeck.load(onReady);
    });

    it('should create the script correctly', function () {
      expect(fakeDomHelper.loadScript).toHaveBeenCalled();
      expect(fakeDomHelper.loadScript.calls[0].args[0]).toEqual('https://f.fontdeck.com/s/css/js/test-host-name/2282.js');
    });

    it('should have created a global', function () {
      expect(global.__webfontfontdeckmodule__).not.toBeNull();
      expect(global.__webfontfontdeckmodule__['2282']).not.toBeNull();
    });

    it('should load correctly after calling the callback', function () {
      global.__webfontfontdeckmodule__['2282'](true, apiResponse);

      expect(fontdeck.fonts_).toEqual([new Font(apiResponse.fonts[0].name), new Font(apiResponse.fonts[1].name, 'i7')]);
    });
  });

  describe('no project id', function () {
    var fontdeck = null,
        support = null;

    beforeEach(function () {
      fontdeck = new Fontdeck(fakeDomHelper, { id: null });
    });

    it('should not have loaded any fonts', function () {
      expect(fontdeck.fonts_).toEqual([]);
    });
  });
});
