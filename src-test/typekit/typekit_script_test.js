var TypekitScriptTest = TestCase('TypeKitScriptTest');

TypekitScriptTest.prototype.testSupportAndLoadLifecycle = function() {
  var configuration = {
    'id': 'abc'
  };
  var insert = '';
  var src = '';
  var global = {};
  var fakeDomHelper = {
      insertInto: function(tag, e) {
        insert = tag;
      },
      createScriptSrc: function(srcLink) {
        src = srcLink;
      },
      getMainWindow: function() {
        return global;
      },
      getProtocol: function() {
        return 'http:';
      }
  };
  var typeKit = new webfont.TypekitScript(fakeDomHelper, configuration);

  // supportUserAgent
  var userAgent = 'user agent';
  var isSupport = null;

  typeKit.supportUserAgent(userAgent, function(support) { isSupport = support; });
  assertEquals('head', insert);
  assertEquals('http://use.typekit.com/abc.js', src);
  assertEquals(null, isSupport);

  assertNotNull(global.__webfonttypekitmodule__);
  assertNotNull(global.__webfonttypekitmodule__['abc']);

  // Typekit script calls initializer.
  global.__webfonttypekitmodule__['abc'](function(ua, config, init) {
    assertEquals('user agent', ua);
    assertEquals(config, configuration);
    assertNotNull(init);
    init(true, ['Font1', 'Font2'], {});
  });
  assertEquals(true, isSupport);

  // load
  var families = null;
  var descriptions = null;

  typeKit.load(function(fontFamilies, fontDescriptions) {
      families = fontFamilies;
      descriptions = fontDescriptions;
  });

  assertNotNull(families);
  assertEquals(2, families.length);
  assertEquals('Font1', families[0]);
  assertEquals('Font2', families[1]);

  var font1Descriptions = descriptions['Font1'];
  assertUndefined(font1Descriptions);

  var font2Descriptions = descriptions['Font2'];
  assertUndefined(font2Descriptions);
};

TypekitScriptTest.prototype.testLoadWithVariations = function() {
  var configuration = {
    'id': 'abc'
  };
  var insert = '';
  var src = '';
  var global = {};
  var fakeDomHelper = {
      insertInto: function(tag, e) {
        insert = tag;
      },
      createScriptSrc: function(srcLink) {
        src = srcLink;
      },
      getMainWindow: function() {
        return global;
      },
      getProtocol: function() {
        return 'http:';
      }
  };
  var typeKit = new webfont.TypekitScript(fakeDomHelper, configuration);

  // supportUserAgent
  var userAgent = 'user agent';
  var isSupport = null;

  typeKit.supportUserAgent(userAgent, function(support) { isSupport = support; });
  assertEquals(null, isSupport);

  assertNotNull(global.__webfonttypekitmodule__);
  assertNotNull(global.__webfonttypekitmodule__['abc']);

  // Typekit script calls initializer.
  global.__webfonttypekitmodule__['abc'](function(ua, config, init) {
    init(true, ['Font1', 'Font2'], {
        'Font1': ['n7', 'i7']
    });
  });

  // load
  var families = null;
  var descriptions = null;

  typeKit.load(function(fontFamilies, fontDescriptions) {
      families = fontFamilies;
      descriptions = fontDescriptions;
  });

  assertNotNull(families);
  assertEquals(2, families.length);
  assertEquals('Font1', families[0]);
  assertEquals('Font2', families[1]);

  var font1Descriptions = descriptions['Font1'];
  assertEquals(2, font1Descriptions.length);
  assertEquals('n7', font1Descriptions[0]);
  assertEquals('i7', font1Descriptions[1]);

  var font2Descriptions = descriptions['Font2'];
  assertUndefined(font2Descriptions);
};

TypekitScriptTest.prototype.testAlternateApi = function() {
  var configuration = {
    'id': 'abc',
    'api': '/test'
  };
  var insert = '';
  var src = '';
  var fakeDomHelper = {
      insertInto: function(tag, e) {
        insert = tag;
      },
      createScriptSrc: function(srcLink) {
        src = srcLink;
      },
      getMainWindow: function() {
        return {};
      },
      getProtocol: function() {
        return 'http:';
      }
  };
  var typeKit = new webfont.TypekitScript(fakeDomHelper, configuration);
  var userAgent = 'user agent';
  var isSupport = null;

  typeKit.supportUserAgent(userAgent, function(support) { isSupport = support; });
  assertEquals('head', insert);
  assertEquals('/test/abc.js', src);
};

TypekitScriptTest.prototype.testNoKitId = function() {
  var configuration = {
    'id': null,
  };
  var insert = null;
  var src = null;
  var fakeDomHelper = {
      insertInto: function(tag, e) {
        insert = tag;
      },
      createScriptSrc: function(srcLink) {
        src = srcLink;
      },
      getMainWindow: function() {
        return {};
      },
      getProtocol: function() {
        return 'http:';
      }
  };
  var typeKit = new webfont.TypekitScript(fakeDomHelper, configuration);
  var userAgent = 'user agent';
  var isSupport = null;

  // supportUserAgent
  typeKit.supportUserAgent(userAgent, function(support) { isSupport = support; });
  assertNull(insert);
  assertNull(src);
  assertEquals(true, isSupport);

  // load
  typeKit.load(function(fontFamilies) { families = fontFamilies; });

  assertEquals([], families);
};
