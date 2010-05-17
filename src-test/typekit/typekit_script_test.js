var TypekitScriptTest = TestCase('TypeKitScriptTest');

TypekitScriptTest.prototype.testSupportAndLoadLifecycle = function() {
  var configuration = {
    'id': 'abc'
  };
  var insert = '';
  var src = '';
  var fakeDomHelper = {
      insertInto: function(tag, e) {
        insert = tag;
      },
      createScriptSrc: function(srcLink) {
        src = srcLink;
      }
  };
  var global = {};
  var typeKit = new webfont.TypekitScript(global, fakeDomHelper, configuration);

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
    init(true, ['Font1', 'Font2']);
  });
  assertEquals(true, isSupport);

  // load
  var families = null;

  typeKit.load(function(fontFamilies) { families = fontFamilies; });

  assertNotNull(families);
  assertEquals(2, families.length);
  assertEquals('Font1', families[0]);
  assertEquals('Font2', families[1]);
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
      }
  };
  var typeKit = new webfont.TypekitScript({}, fakeDomHelper, configuration);
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
      }
  };
  var typeKit = new webfont.TypekitScript({}, fakeDomHelper, configuration);
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
