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
      { family: [ 'Font1', 'Font2' ] });
  var fonts = null;

  googleFontApi.load(function(fontFamilies) { fonts = fontFamilies; });
  assertEquals('head', insert);
  assertEquals('http://themes.googleusercontent.com/fonts/api?family=' +
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
      { api: 'http://moo',  family: [ 'Font1', 'Font2' ] });
  var fonts = null;

  googleFontApi.load(function(fontFamilies) { fonts = fontFamilies; });
  assertEquals('head', insert);
  assertEquals('http://moo?family=Font1%7CFont2', link);
  assertNotNull(fonts);
  assertEquals(2, fonts.length);
  assertEquals('Font1', fonts[0]);
  assertEquals('Font2', fonts[1]);
};
