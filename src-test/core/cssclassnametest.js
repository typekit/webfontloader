var CssClassNameTest = TestCase('CssClassName');

CssClassNameTest.prototype.setUp = function() {
  this.sanitizer_ = new webfont.CssClassName();
};

CssClassNameTest.prototype.testSanitizeSpacesInName = function() {
  var result = this.sanitizer_.sanitize(' My Family ');

  assertEquals('MyFamily', result);
};

CssClassNameTest.prototype.testSanitizeNumbersInName = function() {
  var result = this.sanitizer_.sanitize('99 My Family 99');

  assertEquals('99MyFamily99', result);
};

CssClassNameTest.prototype.testSanitizeOtherChars = function() {
  var result = this.sanitizer_.sanitize('_My+Family!-');

  assertEquals('MyFamily', result);
};

CssClassNameTest.prototype.testBuildManyParts = function() {
  var result = this.sanitizer_.build('pre_', 'My Family', '_post');

  assertEquals('pre-MyFamily-post', result);
};

CssClassNameTest.prototype.testBuildSomeParts = function() {
  var result = this.sanitizer_.build('pre!', 'My Family');

  assertEquals('pre-MyFamily', result);
};

CssClassNameTest.prototype.testBuildOtherJoinChar = function() {
  this.sanitizer_ = new webfont.CssClassName('_');
  var result = this.sanitizer_.build('pre', 'My Family');

  assertEquals('pre_MyFamily', result);
};
