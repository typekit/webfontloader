var CssFontFamilyNameTest = TestCase('CssFontFamilyName');

CssFontFamilyNameTest.prototype.setUp = function() {
  this.sanitizer_ = new webfont.CssFontFamilyName();
};

CssFontFamilyNameTest.prototype.testSpaceNameWithoutQuotes = function() {
  var result = this.sanitizer_.quote('My Family');

  assertEquals('"My Family"', result);
};

CssFontFamilyNameTest.prototype.testSpaceNameWithDoubleQuotes = function() {
  var result = this.sanitizer_.quote('"My Family"');

  assertEquals('"My Family"', result);
};

CssFontFamilyNameTest.prototype.testSpaceNameWithSingleQuotes = function() {
  var result = this.sanitizer_.quote('\'My Family\'');

  assertEquals('"My Family"', result);
};

CssFontFamilyNameTest.prototype.testSpaceNameWithCommasAndQuotes = function() {
  var result = this.sanitizer_.quote('\'family 1\',\'family 2\'');

  assertEquals('\"family 1\",\"family 2\"', result);
};

CssFontFamilyNameTest.prototype.testSpaceNameWithCommaSpaceAndQuotes = function() {
  var result = this.sanitizer_.quote('\'family 1\', \'family 2\'');

  assertEquals('\"family 1\",\"family 2\"', result);
};

CssFontFamilyNameTest.prototype.testNoSpaceNameWithoutQuotes = function() {
  var result = this.sanitizer_.quote('MyFamily');

  assertEquals('MyFamily', result);
};

CssFontFamilyNameTest.prototype.testNoSpaceNameWithQuotes = function() {
  var result = this.sanitizer_.quote('"MyFamily"');

  assertEquals('MyFamily', result);
};

CssFontFamilyNameTest.prototype.testNoSpaceNameWithCommasAndQuotes = function() {
  var result = this.sanitizer_.quote('\'family-1\', \'family-2\'');

  assertEquals('family-1,family-2', result);
};

