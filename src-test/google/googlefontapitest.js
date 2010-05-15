var GoogleFontApiTest = TestCase('GoogleFontApiTest');

GoogleFontApiTest.prototype.testCallOnReadyWithFontFamilyLoading = function() {
  var insert = '';
  var link = '';
  var fakeDomHelper = {
      insertInto: function(tag, e) {
        insert = tag;
      },
      createCssLink: function(csslink) {
        link = csslink;
      }
  };
  var userAgent = new webfont.UserAgent("Test", "1.0", true);
  var googleFontApi = new webfont.GoogleFontApi(userAgent, fakeDomHelper,
      { families: [ 'Font1', 'Font2' ] });
  var fonts = null;

  googleFontApi.load(function(fontFamilies) { fonts = fontFamilies; });
  assertEquals('head', insert);
  assertEquals('//fonts.googleapis.com/css?family=' +
      'Font1%7CFont2', link);
  assertNotNull(fonts);
  assertEquals(2, fonts.length);
  assertEquals('Font1', fonts[0]);
  assertEquals('Font2', fonts[1]);
};

GoogleFontApiTest.prototype.testCallOnReadyWithFontFamilyLoadingApiUrlChanged =
    function() {
  var insert = '';
  var link = '';
  var fakeDomHelper = {
      insertInto: function(tag, e) {
        insert = tag;
      },
      createCssLink: function(csslink) {
        link = csslink;
      }
  };
  var userAgent = new webfont.UserAgent("Test", "1.0", true);
  var googleFontApi = new webfont.GoogleFontApi(userAgent, fakeDomHelper,
      { api: 'http://moo',  families: [ 'Font1', 'Font2' ] });
  var fonts = null;

  googleFontApi.load(function(fontFamilies) { fonts = fontFamilies; });
  assertEquals('head', insert);
  assertEquals('http://moo?family=Font1%7CFont2', link);
  assertNotNull(fonts);
  assertEquals(2, fonts.length);
  assertEquals('Font1', fonts[0]);
  assertEquals('Font2', fonts[1]);
};

GoogleFontApiTest.prototype.testSpacesReplacedByPlus = function() {
  var insert = '';
  var link = '';
  var fakeDomHelper = {
      insertInto: function(tag, e) {
        insert = tag;
      },
      createCssLink: function(csslink) {
        link = csslink;
      }
  };
  var userAgent = new webfont.UserAgent("Test", "1.0", true);
  var googleFontApi = new webfont.GoogleFontApi(userAgent, fakeDomHelper,
      { families: [ 'Font1 WithSpace', 'Font2 WithSpaceToo' ] });
  var fonts = null;

  googleFontApi.load(function(fontFamilies) { fonts = fontFamilies; });
  assertEquals('head', insert);
  assertEquals('//fonts.googleapis.com/css?family=Font1+WithSpace%7CFont2+WithSpaceToo', link);
  assertNotNull(fonts);
  assertEquals(2, fonts.length);
  assertEquals('Font1 WithSpace', fonts[0]);
  assertEquals('Font2 WithSpaceToo', fonts[1]);
};

GoogleFontApiTest.prototype.testLoadWithVariations = function() {
  var insert = '';
  var link = '';
  var fakeDomHelper = {
      insertInto: function(tag, e) {
        insert = tag;
      },
      createCssLink: function(csslink) {
        link = csslink;
      }
  };
  var userAgent = new webfont.UserAgent("Test", "1.0", true);
  var googleFontApi = new webfont.GoogleFontApi(userAgent, fakeDomHelper,
      { families: [ 'Font1 WithSpace:bi', 'Font2 WithSpaceToo:b,r' ] });
  var fonts = null;
  var variations = null;
  var transformName = null;

  googleFontApi.load(function(fontFamilies, opt_variations,
      opt_transformName) {
      fonts = fontFamilies;
      variations = opt_variations;
      transformName = opt_transformName
  });
  assertEquals('head', insert);
  assertEquals('//fonts.googleapis.com/css?family=Font1+WithSpace:bi%7CFont2+WithSpaceToo:b,r', link);
  assertNotNull(fonts);
  assertEquals(2, fonts.length);
  assertEquals('Font1 WithSpace', fonts[0]);
  assertEquals('Font2 WithSpaceToo', fonts[1]);
  assertNotNull(variations);
  var font1 = variations['Font1 WithSpace'];

  assertNotNull(font1);
  assertEquals(1, font1.length);
  assertEquals('font-style: italic;font-weight: bold', font1[0]);
  var font2 = variations['Font2 WithSpaceToo'];

  assertNotNull(font2);
  assertEquals(2, font2.length);
  assertEquals('font-weight: bold', font2[0]);
  assertEquals('font-style: normal;font-weight: normal', font2[1]);
  assertNotNull(transformName);
  assertEquals('Font2 WithSpaceToo bold', transformName('Font2 WithSpaceToo',
      font2[0]));
  assertEquals('Font2 WithSpaceToo', transformName('Font2 WithSpaceToo',
      font2[1]));
};
