var FontVariationDescriptionTest = TestCase('FontVariationDescription');

FontVariationDescriptionTest.prototype.setUp = function() {
  this.fvd_ = new webfont.FontVariationDescription();
};

FontVariationDescriptionTest.prototype.testCompactEmptyString = function() {
  assertEquals('n4', this.fvd_.compact(''));
};

FontVariationDescriptionTest.prototype.testCompactFontStyle = function() {
  assertEquals('n4', this.fvd_.compact('font-style: normal;'));
  assertEquals('i4', this.fvd_.compact('font-style: italic;'));
  assertEquals('o4', this.fvd_.compact('font-style: oblique;'));
};

FontVariationDescriptionTest.prototype.testCompactInvalidFontStyle = function() {
  assertEquals('n4', this.fvd_.compact('font-style: other;'));
};

FontVariationDescriptionTest.prototype.testCompactFontWeight = function() {
  assertEquals('n4', this.fvd_.compact('font-weight: normal;'));
  assertEquals('n7', this.fvd_.compact('font-weight: bold;'));
  assertEquals('n1', this.fvd_.compact('font-weight: 100;'));
  assertEquals('n2', this.fvd_.compact('font-weight: 200;'));
  assertEquals('n3', this.fvd_.compact('font-weight: 300;'));
  assertEquals('n4', this.fvd_.compact('font-weight: 400;'));
  assertEquals('n5', this.fvd_.compact('font-weight: 500;'));
  assertEquals('n6', this.fvd_.compact('font-weight: 600;'));
  assertEquals('n7', this.fvd_.compact('font-weight: 700;'));
  assertEquals('n8', this.fvd_.compact('font-weight: 800;'));
  assertEquals('n9', this.fvd_.compact('font-weight: 900;'));
};

FontVariationDescriptionTest.prototype.testCompactInvalidFontWeight = function() {
  assertEquals('n4', this.fvd_.compact('font-weight: 140;'));
  assertEquals('n4', this.fvd_.compact('font-weight: other;'));
};

FontVariationDescriptionTest.prototype.testCompactAllProperties = function() {
  assertEquals('i7', this.fvd_.compact('font-style: italic; font-weight: bold;'));
  assertEquals('i7', this.fvd_.compact('; font-style: italic; font-weight: bold'));
  assertEquals('i7', this.fvd_.compact('font-style:italic;font-weight:bold;'));
  assertEquals('i7', this.fvd_.compact('  font-style:   italic   ;\n\nfont-weight   : bold;  '));
};

FontVariationDescriptionTest.prototype.testInvalidProperties = function() {
  assertEquals('n4', this.fvd_.compact('src: url(/font.otf);'));
  assertEquals('n9', this.fvd_.compact('font-weight: 900; src: url(/font.otf);'));
  assertEquals('n8', this.fvd_.compact('font-weight: 800; font-stretch:condensed'));
};

FontVariationDescriptionTest.prototype.testExpandFontStyle = function() {
  assertEquals('font-style:normal;font-weight:400;', this.fvd_.expand('n4'));
  assertEquals('font-style:italic;font-weight:400;', this.fvd_.expand('i4'));
  assertEquals('font-style:oblique;font-weight:400;', this.fvd_.expand('o4'));
};

FontVariationDescriptionTest.prototype.testExpandFontWeight = function() {
  assertEquals('font-style:normal;font-weight:100;', this.fvd_.expand('n1'));
  assertEquals('font-style:normal;font-weight:200;', this.fvd_.expand('n2'));
  assertEquals('font-style:normal;font-weight:300;', this.fvd_.expand('n3'));
  assertEquals('font-style:normal;font-weight:400;', this.fvd_.expand('n4'));
  assertEquals('font-style:normal;font-weight:500;', this.fvd_.expand('n5'));
  assertEquals('font-style:normal;font-weight:600;', this.fvd_.expand('n6'));
  assertEquals('font-style:normal;font-weight:700;', this.fvd_.expand('n7'));
  assertEquals('font-style:normal;font-weight:800;', this.fvd_.expand('n8'));
  assertEquals('font-style:normal;font-weight:900;', this.fvd_.expand('n9'));
};

FontVariationDescriptionTest.prototype.testExpandInvalid = function() {
  assertEquals(null, this.fvd_.expand(''));
  assertEquals(null, this.fvd_.expand('n'));
  assertEquals(null, this.fvd_.expand('1'));
  assertEquals(null, this.fvd_.expand('n1x'));
};
