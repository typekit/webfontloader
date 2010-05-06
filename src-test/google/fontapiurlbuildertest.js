var FontApiUrlBuilderTest = TestCase('FontApiUrlBuilderTest');

FontApiUrlBuilderTest.prototype.testThrowsExceptionIfNoFontFamilies =
    function() {
  var fontApiUrlBuilder = new webfont.FontApiUrlBuilder("http://moo");

  try {
    fontApiUrlBuilder.build();
    fail('build should have thrown an exception.');
  } catch (e) {
    // success
  }
};

FontApiUrlBuilderTest.prototype.testBuildProperUrl = function() {
  var fontApiUrlBuilder = new webfont.FontApiUrlBuilder("http://moo");

  fontApiUrlBuilder.setFontFamilies([ 'Font1', 'Font2' ]);
  assertEquals('http://moo?family=Font1%7CFont2', fontApiUrlBuilder.build());
};

FontApiUrlBuilderTest.prototype.testBuildProperDefaultUrl = function() {
  var fontApiUrlBuilder = new webfont.FontApiUrlBuilder();

  fontApiUrlBuilder.setFontFamilies([ 'Font1', 'Font2' ]);
  assertEquals(webfont.FontApiUrlBuilder.DEFAULT_API_URL +
      '?family=Font1%7CFont2', fontApiUrlBuilder.build());
};
