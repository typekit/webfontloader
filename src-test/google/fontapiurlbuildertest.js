var FontApiUrlBuilderTest = TestCase('FontApiUrlBuilderTest');

FontApiUrlBuilderTest.prototype.testThrowsExceptionIfNoFontFamilies =
    function() {
  var fontApiUrlBuilder = new webfont.FontApiUrlBuilder("http://moo", "http:");

  try {
    fontApiUrlBuilder.build();
    fail('build should have thrown an exception.');
  } catch (e) {
    // success
  }
};

FontApiUrlBuilderTest.prototype.testBuildProperUrl = function() {
  var fontApiUrlBuilder = new webfont.FontApiUrlBuilder("http://moo", "http:");

  fontApiUrlBuilder.setFontFamilies([ 'Font1', 'Font2' ]);
  assertEquals('http://moo?family=Font1%7CFont2', fontApiUrlBuilder.build());
};

FontApiUrlBuilderTest.prototype.testBuildProperDefaultUrl = function() {
  var fontApiUrlBuilder = new webfont.FontApiUrlBuilder(undefined, "http:");

  fontApiUrlBuilder.setFontFamilies([ 'Font1', 'Font2' ]);
  assertEquals("http:" + webfont.FontApiUrlBuilder.DEFAULT_API_URL +
      '?family=Font1%7CFont2', fontApiUrlBuilder.build());
};


FontApiUrlBuilderTest.prototype.testBuildProperUrlWithSubsets = function() {
  var fontApiUrlBuilder = new webfont.FontApiUrlBuilder(undefined, "http:");

  fontApiUrlBuilder.setFontFamilies([ 'Font1:bold:greek,cyrillic',
      'Font2:italic', 'Font3' ]);
  assertEquals("http:" + webfont.FontApiUrlBuilder.DEFAULT_API_URL +
	       '?family=Font1:bold%7CFont2:italic%7CFont3' +
      '&subset=greek,cyrillic', fontApiUrlBuilder.build());
};

FontApiUrlBuilderTest.prototype.testBuildProperUrlWithSubsetsNoVariations =
    function() {
  var fontApiUrlBuilder = new webfont.FontApiUrlBuilder(undefined, "http:");

  fontApiUrlBuilder.setFontFamilies([ 'Font1:bold,italic:greek,cyrillic',
      'Font2:italic', 'Font3::latin' ]);
  assertEquals("http:" + webfont.FontApiUrlBuilder.DEFAULT_API_URL +
	       '?family=Font1:bold,italic%7CFont2:italic%7CFont3' +
      '&subset=greek,cyrillic,latin', fontApiUrlBuilder.build());
};
