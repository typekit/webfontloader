var FontApiParserTest = TestCase('FontApiParserTest');

FontApiParserTest.prototype.testParsedValuesAreCoherent = function() {
  var fontFamilies = [ 'Tangerine', 'Droid Serif:bi',
      'Yanone Kaffeesatz:200,300,400,700',
      'Cantarell:italic,b' ];
  var fontApiParser = new webfont.FontApiParser(fontFamilies);

  fontApiParser.parse();
  var parsedFontFamilies = fontApiParser.getFontFamilies();

  assertEquals(4, parsedFontFamilies.length);
  assertEquals('Tangerine', parsedFontFamilies[0]);
  assertEquals('Droid Serif', parsedFontFamilies[1]);
  assertEquals('Yanone Kaffeesatz', parsedFontFamilies[2]);
  assertEquals('Cantarell', parsedFontFamilies[3]);
  var variations = fontApiParser.getVariations();
  var tangerine = variations['Tangerine'];

  assertNull(tangerine);
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

  assertNull(nobile);
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

  assertNull(nobile);
};
