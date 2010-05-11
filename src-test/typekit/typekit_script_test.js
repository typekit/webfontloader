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

  assertNotNull(global.__typekitScriptModules__);
  assertNotNull(global.__typekitScriptModules__['abc']);
  assertNotNull(global.__typekitScriptModules__['abc']['init']);
  assertEquals('user agent', global.__typekitScriptModules__['abc']['ua']);

  global.__typekitScriptModules__['abc']['init'](true, ['Font1', 'Font2']);
  assertEquals(true, isSupport);

  // load
  var fonts = null;

  typeKit.load(function(fontFamilies) { fonts = fontFamilies; });

  assertNotNull(fonts);
  assertEquals(2, fonts.length);
  assertEquals('Font1', fonts[0]);
  assertEquals('Font2', fonts[1]);
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
