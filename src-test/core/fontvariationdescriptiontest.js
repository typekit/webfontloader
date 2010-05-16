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
