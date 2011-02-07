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

  var families = null;
  var descriptions = null;

  googleFontApi.load(function(fontFamilies, fontDescriptions) {
      families = fontFamilies;
      descriptions = fontDescriptions;
  });

  assertEquals('head', insert);
  assertEquals('http://fonts.googleapis.com/css?family=' +
      'Font1%7CFont2', link);

  assertNotNull(families);
  assertEquals(2, families.length);
  assertEquals('Font1', families[0]);
  assertEquals('Font2', families[1]);

  var font1Descriptions = descriptions['Font1'];
  assertNotNull(font1Descriptions);
  assertEquals(1, font1Descriptions.length);
  assertEquals('n4', font1Descriptions[0]);

  var font2Descriptions = descriptions['Font2'];
  assertNotNull(font2Descriptions);
  assertEquals(1, font2Descriptions.length);
  assertEquals('n4', font2Descriptions[0]);
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

  var families = null;
  var descriptions = null;

  googleFontApi.load(function(fontFamilies, fontDescriptions) {
      families = fontFamilies;
      descriptions = fontDescriptions;
  });

  assertEquals('head', insert);
  assertEquals('http://moo?family=Font1%7CFont2', link);

  assertNotNull(families);
  assertEquals(2, families.length);
  assertEquals('Font1', families[0]);
  assertEquals('Font2', families[1]);

  var font1Descriptions = descriptions['Font1'];
  assertNotNull(font1Descriptions);
  assertEquals(1, font1Descriptions.length);
  assertEquals('n4', font1Descriptions[0]);

  var font2Descriptions = descriptions['Font2'];
  assertNotNull(font2Descriptions);
  assertEquals(1, font2Descriptions.length);
  assertEquals('n4', font2Descriptions[0]);
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

  var families = null;
  var descriptions = null;

  googleFontApi.load(function(fontFamilies, fontDescriptions) {
      families = fontFamilies;
      descriptions = fontDescriptions;
  });

  assertEquals('head', insert);
  assertEquals('http://fonts.googleapis.com/css?family=Font1+WithSpace%7CFont2+WithSpaceToo', link);

  assertNotNull(families);
  assertEquals(2, families.length);
  assertEquals('Font1 WithSpace', families[0]);
  assertEquals('Font2 WithSpaceToo', families[1]);

  var font1Descriptions = descriptions['Font1 WithSpace'];
  assertNotNull(font1Descriptions);
  assertEquals(1, font1Descriptions.length);
  assertEquals('n4', font1Descriptions[0]);

  var font2Descriptions = descriptions['Font2 WithSpaceToo'];
  assertNotNull(font2Descriptions);
  assertEquals(1, font2Descriptions.length);
  assertEquals('n4', font2Descriptions[0]);
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

  var families = null;
  var descriptions = null;

  googleFontApi.load(function(fontFamilies, fontDescriptions) {
      families = fontFamilies;
      descriptions = fontDescriptions;
  });

  assertEquals('head', insert);
  assertEquals('http://fonts.googleapis.com/css?family=Font1+WithSpace:bi%7CFont2+WithSpaceToo:b,r', link);

  assertNotNull(families);
  assertEquals(2, families.length);
  assertEquals('Font1 WithSpace', families[0]);
  assertEquals('Font2 WithSpaceToo', families[1]);
  assertNotNull(descriptions);

  var font1Descriptions = descriptions['Font1 WithSpace'];
  assertNotNull(font1Descriptions);
  assertEquals(1, font1Descriptions.length);
  assertEquals('i7', font1Descriptions[0]);

  var font2Descriptions = descriptions['Font2 WithSpaceToo'];
  assertNotNull(font2Descriptions);
  assertEquals(2, font2Descriptions.length);
  assertEquals('n7', font2Descriptions[0]);
  assertEquals('n4', font2Descriptions[1]);
};
