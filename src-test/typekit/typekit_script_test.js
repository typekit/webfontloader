var TypekitScriptTest = TestCase('TypeKitScriptTest');

TypekitScriptTest.prototype.testInsertProperScriptTag = function() {
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
  var typeKit = new webfont.TypekitScript('abc', {}, fakeDomHelper);
  var fonts = null;

  typeKit.load(function(fontFamilies) { fonts = fontFamilies; });
  assertEquals('head', insert);
  assertEquals('http://use.typekit.com/abc.js', src);
};

TypekitScriptTest.prototype.testInsertProperScriptTag = function() {
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
  var typeKit = new webfont.TypekitScript('abc', global, fakeDomHelper);
  var fonts = null;

  typeKit.load(function(fontFamilies) { fonts = fontFamilies; });
  global.__typekitScriptModules__['abc']([ 'Font1', 'Font2' ]);
  assertEquals('head', insert);
  assertEquals('http://use.typekit.com/abc.js', src);
  assertNotNull(fonts);
  assertEquals(2, fonts.length);
  assertEquals('Font1', fonts[0]);
  assertEquals('Font2', fonts[1]);
};
