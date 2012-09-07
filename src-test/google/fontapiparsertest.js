var FontApiParserTest = TestCase('FontApiParserTest');

FontApiParserTest.prototype.testParsedValuesAreCoherent = function() {
  var fontFamilies = [ 'Tangerine', 'Droid Serif:bi',
      'Yanone Kaffeesatz:200,300,400,700',
      'Cantarell:italic,b', 'Exo:100italic', 'Lobster:200n'];
  var fontApiParser = new webfont.FontApiParser(fontFamilies);

  fontApiParser.parse();
  var parsedFontFamilies = fontApiParser.getFontFamilies();

  assertEquals(6, parsedFontFamilies.length);
  assertEquals('Tangerine', parsedFontFamilies[0]);
  assertEquals('Droid Serif', parsedFontFamilies[1]);
  assertEquals('Yanone Kaffeesatz', parsedFontFamilies[2]);
  assertEquals('Cantarell', parsedFontFamilies[3]);
  assertEquals('Exo', parsedFontFamilies[4]);
  assertEquals('Lobster', parsedFontFamilies[5]);
  var variations = fontApiParser.getVariations();

  var tangerine = variations['Tangerine'];
  assertNotNull(tangerine);
  assertEquals(1, tangerine.length);
  assertEquals('n4', tangerine[0]);

  var droidSerif = variations['Droid Serif'];
  assertNotNull(droidSerif);
  assertEquals(1, droidSerif.length);
  assertEquals('i7', droidSerif[0]);

  var yanoneKaffeesatz = variations['Yanone Kaffeesatz'];
  assertNotNull(yanoneKaffeesatz);
  assertEquals(4, yanoneKaffeesatz.length);
  assertEquals('n2', yanoneKaffeesatz[0]);
  assertEquals('n3', yanoneKaffeesatz[1]);
  assertEquals('n4', yanoneKaffeesatz[2]);
  assertEquals('n7', yanoneKaffeesatz[3]);

  var cantarell = variations['Cantarell'];
  assertNotNull(cantarell);
  assertEquals(2, cantarell.length);
  assertEquals('i4', cantarell[0]);
  assertEquals('n7', cantarell[1]);

  var exo = variations['Exo'];
  assertNotNull(exo);
  assertEquals(1, exo.length);
  assertEquals('i1', exo[0]);

  var lobster = variations['Lobster'];
  assertNotNull(lobster);
  assertEquals(1, lobster.length);
  assertEquals('n2', lobster[0]);
};

FontApiParserTest.prototype.testMixOfNumericWeightAndStyle = function() {
  var fontFamilies = [ 'Nobile:700i,b,200i,r,i700' ];
  var fontApiParser = new webfont.FontApiParser(fontFamilies);

  fontApiParser.parse();
  var parsedFontFamilies = fontApiParser.getFontFamilies();

  assertEquals(1, parsedFontFamilies.length);
  assertEquals('Nobile', parsedFontFamilies[0]);
  var variations = fontApiParser.getVariations();

  var nobile = variations['Nobile'];
  assertNotNull(nobile);
  assertEquals(4, nobile.length);
  assertEquals('i7', nobile[0]);
  assertEquals('n7', nobile[1]);
  assertEquals('i2', nobile[2]);
  assertEquals('n4', nobile[3]);
};

FontApiParserTest.prototype.testTypoBildInsteadOfBold = function() {
  var fontFamilies = [ 'Nobile:bild' ];
  var fontApiParser = new webfont.FontApiParser(fontFamilies);

  fontApiParser.parse();

  var parsedFontFamilies = fontApiParser.getFontFamilies();
  assertEquals(1, parsedFontFamilies.length);
  assertEquals('Nobile', parsedFontFamilies[0]);

  var variations = fontApiParser.getVariations();
  var nobile = variations['Nobile'];
  assertEquals(1, nobile.length);
  assertEquals('n4', nobile[0]);
};

FontApiParserTest.prototype.testNonSense = function() {
  var fontFamilies = [ 'Nobile:dwe,^%^%fewf,$9940@#!@#$%^&*()_+}POIBJ{}{' ];
  var fontApiParser = new webfont.FontApiParser(fontFamilies);

  fontApiParser.parse();
  var parsedFontFamilies = fontApiParser.getFontFamilies();

  assertEquals(1, parsedFontFamilies.length);
  assertEquals('Nobile', parsedFontFamilies[0]);

  var variations = fontApiParser.getVariations();
  var nobile = variations['Nobile'];
  assertEquals(1, nobile.length);
  assertEquals('n4', nobile[0]);
};

FontApiParserTest.prototype.testNoWeightOneSubsetDefined = function() {
  var fontFamilies = [ 'Cantarell::greek' ];
  var fontApiParser = new webfont.FontApiParser(fontFamilies);

  fontApiParser.parse();

  var parsedFontFamilies = fontApiParser.getFontFamilies();
  assertEquals(1, parsedFontFamilies.length);
  assertEquals('Cantarell', parsedFontFamilies[0]);

  var variations = fontApiParser.getVariations();
  var cantarellVariations = variations['Cantarell'];
  assertEquals(1, cantarellVariations.length);
  assertEquals('n4', cantarellVariations[0]);

  var testStrings = fontApiParser.getFontTestStrings();
  var cantarellTestStrings = testStrings['Cantarell'];
  assertNotUndefined(cantarellTestStrings);
  assertEquals(webfont.FontApiParser.INT_FONTS['greek'],
      cantarellTestStrings);
};


FontApiParserTest.prototype.testNoWeightMultipleSubsetsDefined = function() {
  var fontFamilies = [ 'Cantarell::cyrillic,greek,latin' ];
  var fontApiParser = new webfont.FontApiParser(fontFamilies);

  fontApiParser.parse();

  var parsedFontFamilies = fontApiParser.getFontFamilies();
  assertEquals(1, parsedFontFamilies.length);
  assertEquals('Cantarell', parsedFontFamilies[0]);

  var variations = fontApiParser.getVariations();
  var cantarellVariations = variations['Cantarell'];
  assertEquals(1, cantarellVariations.length);
  assertEquals('n4', cantarellVariations[0]);

  var testStrings = fontApiParser.getFontTestStrings();
  var cantarellTestStrings = testStrings['Cantarell'];
  assertNotUndefined(cantarellTestStrings);
  assertEquals(webfont.FontApiParser.INT_FONTS['cyrillic'],
      cantarellTestStrings);
};


FontApiParserTest.prototype.testWeightAndMultipleSubsetsDefined = function() {
  var fontFamilies = [ 'Cantarell:regular,bold:cyrillic,greek,latin' ];
  var fontApiParser = new webfont.FontApiParser(fontFamilies);

  fontApiParser.parse();

  var parsedFontFamilies = fontApiParser.getFontFamilies();
  assertEquals(1, parsedFontFamilies.length);
  assertEquals('Cantarell', parsedFontFamilies[0]);

  var variations = fontApiParser.getVariations();
  var cantarellVariations = variations['Cantarell'];
  assertEquals(2, cantarellVariations.length);
  assertEquals('n4', cantarellVariations[0]);
  assertEquals('n7', cantarellVariations[1]);

  var testStrings = fontApiParser.getFontTestStrings();
  var cantarellTestStrings = testStrings['Cantarell'];
  assertNotUndefined(cantarellTestStrings);
  assertEquals(webfont.FontApiParser.INT_FONTS['cyrillic'],
      cantarellTestStrings);
};


FontApiParserTest.prototype.testHanumanIsBackwardCompatible = function() {
  var fontFamilies = [ 'Hanuman' ];
  var fontApiParser = new webfont.FontApiParser(fontFamilies);

  fontApiParser.parse();

  var parsedFontFamilies = fontApiParser.getFontFamilies();
  assertEquals(1, parsedFontFamilies.length);
  assertEquals('Hanuman', parsedFontFamilies[0]);

  var variations = fontApiParser.getVariations();
  var hanumanVariations = variations['Hanuman'];
  assertEquals(1, hanumanVariations.length);
  assertEquals('n4', hanumanVariations[0]);

  var testStrings = fontApiParser.getFontTestStrings();
  var hanumanTestStrings = testStrings['Hanuman'];
  assertNotUndefined(hanumanTestStrings);
  assertEquals(webfont.FontApiParser.INT_FONTS['Hanuman'],
      hanumanTestStrings);
};


FontApiParserTest.prototype.testHanumanIsForwardCompatible = function() {
  var fontFamilies = [ 'Hanuman::khmer' ];
  var fontApiParser = new webfont.FontApiParser(fontFamilies);

  fontApiParser.parse();

  var parsedFontFamilies = fontApiParser.getFontFamilies();
  assertEquals(1, parsedFontFamilies.length);
  assertEquals('Hanuman', parsedFontFamilies[0]);

  var variations = fontApiParser.getVariations();
  var hanumanVariations = variations['Hanuman'];
  assertEquals(1, hanumanVariations.length);
  assertEquals('n4', hanumanVariations[0]);

  var testStrings = fontApiParser.getFontTestStrings();
  var hanumanTestStrings = testStrings['Hanuman'];
  assertNotUndefined(hanumanTestStrings);
  assertEquals(webfont.FontApiParser.INT_FONTS['khmer'],
      hanumanTestStrings);
};

FontApiParserTest.prototype.testPlusReplacedWithSpace = function() {
  var fontFamilies = [ 'Erica+One', 'Droid+Serif::latin',
      'Yanone+Kaffeesatz:400,700:latin'];
  var fontApiParser = new webfont.FontApiParser(fontFamilies);

  fontApiParser.parse();
  var parsedFontFamilies = fontApiParser.getFontFamilies();

  assertEquals(3, parsedFontFamilies.length);
  assertEquals('Erica One', parsedFontFamilies[0]);
  assertEquals('Droid Serif', parsedFontFamilies[1]);
  assertEquals('Yanone Kaffeesatz', parsedFontFamilies[2]);
  var variations = fontApiParser.getVariations();

  var ericaOne = variations['Erica One'];
  assertNotNull(ericaOne);
  assertEquals(1, ericaOne.length);
  assertEquals('n4', ericaOne[0]);

  var droidSerif = variations['Droid Serif'];
  assertNotNull(droidSerif);
  assertEquals(1, droidSerif.length);
  assertEquals('n4', droidSerif[0]);

  var yanoneKaffeesatz = variations['Yanone Kaffeesatz'];
  assertNotNull(yanoneKaffeesatz);
  assertEquals(2, yanoneKaffeesatz.length);
  assertEquals('n4', yanoneKaffeesatz[0]);
  assertEquals('n7', yanoneKaffeesatz[1]);
};
