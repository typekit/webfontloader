var FontdeckScriptTest = TestCase('FontdeckScriptTest');

FontdeckScriptTest.prototype.testSupportAndLoadLifecycle = function() {
  var configuration = {
    'id': '2282'
  };
  var apiResponse = {
    "domain" : "localhost",
    "cssurl" : "http://f.fontdeck.com/s/css/03BmCXiV2AHwX/Rp+OBFTfD2oFs/localhost/2282.css",
    "project" : 2282,
    "cssbase" : "http://f.fontdeck.com/s/css/03BmCXiV2AHwX/Rp+OBFTfD2oFs",
    "fonts" : [
      {
        "font_family" : "'Fertigo Pro Regular', Fertigo, Constantia, Palatino, serif",
        "font_size_adjust" : 0.508,
        "name" : "Fertigo Pro Regular",
        "style" : "normal",
        "weight" : "normal",
        "font_urls" : {
          "eot" : "http://f.fontdeck.com/f/1/SUlFR0tid0kAA2vb11Ly/IGWDK+wV8TMAfV0J1Ej1J1GFRT1bssqrn6a.eot",
          "ttf" : "http://f.fontdeck.com/f/1/SUlFR0tid0kAA2vb11Ly/IGWDK+wV8TMAfV0J1Ej1J1GFRT1bssqrn6a.ttf",
          "woff" : "http://f.fontdeck.com/f/1/SUlFR0tid0kAA2vb11Ly/IGWDK+wV8TMAfV0J1Ej1J1GFRT1bssqrn6a.woff",
          "svg" : "http://f.fontdeck.com/f/1/SUlFR0tid0kAA2vb11Ly/IGWDK+wV8TMAfV0J1Ej1J1GFRT1bssqrn6a.svg#104"
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
          "eot" : "http://f.fontdeck.com/f/1/azJEbTVyc1QAA11+CAE5C93+l/bAQx1ipRo6Maba19w3Yy5ng+qVWlfj.eot",
          "ttf" : "http://f.fontdeck.com/f/1/azJEbTVyc1QAA11+CAE5C93+l/bAQx1ipRo6Maba19w3Yy5ng+qVWlfj.ttf",
          "woff" : "http://f.fontdeck.com/f/1/azJEbTVyc1QAA11+CAE5C93+l/bAQx1ipRo6Maba19w3Yy5ng+qVWlfj.woff",
          "svg" : "http://f.fontdeck.com/f/1/azJEbTVyc1QAA11+CAE5C93+l/bAQx1ipRo6Maba19w3Yy5ng+qVWlfj.svg#2256"
        },
        "id" : 2256
      }
    ]
  };
  var insert = '';
  var global = {
    location: {
      hostname: 'test-host-name'
    }
  };
  var src = '';
  var fakeDomHelper = {
    insertInto: function(tag, e) {
      insert = tag;
    },
    createScriptSrc: function(srcLink) {
      src = srcLink;
    },
    getLoadWindow: function() {
      // No hostname to verify fallback behavior for empty iframe
      return {
        location: {}
      };
    },
    getMainWindow: function() {
      return global;
    },
    getProtocol: function() {
      return 'https:';
    }
  };
  var fontdeck = new webfont.FontdeckScript(fakeDomHelper, configuration);

  // supportUserAgent
  var userAgent = 'user agent';
  var isSupport = null;

  fontdeck.supportUserAgent(userAgent, function(support) { isSupport = support; });
  assertEquals('head', insert);
  assertEquals('https://f.fontdeck.com/s/css/js/test-host-name/2282.js', src);
  assertEquals(null, isSupport);

  assertNotNull(global.__webfontfontdeckmodule__);
  assertNotNull(global.__webfontfontdeckmodule__['2282']);

  // Call the callback function passing in dummy API response.
  global.__webfontfontdeckmodule__['2282'](true, apiResponse);

  assertEquals(fontdeck.fontFamilies_, [apiResponse.fonts[0].name, apiResponse.fonts[1].name]);
  assertEquals(fontdeck.fontVariations_[apiResponse.fonts[0].name], ['n4']);
  assertEquals(fontdeck.fontVariations_[apiResponse.fonts[1].name], ['i7']);

  assertEquals(true, isSupport);
};

FontdeckScriptTest.prototype.testNoProjectId = function() {
  var configuration = {
    'id': null
  };
  var insert = '';
  var src = '';
  var fakeDomHelper = {
    getMainWindow: function() {
      return {};
    }
  };
  var fontdeck = new webfont.FontdeckScript(fakeDomHelper, configuration);

  // supportUserAgent
  var userAgent = 'user agent';
  var isSupport = null;

  fontdeck.supportUserAgent(userAgent, function(support) { isSupport = support; });

  assertEquals(fontdeck.fontFamilies_, []);
  assertEquals(fontdeck.fontVariations_, []);
  assertEquals(true, isSupport);
}
