var CustomCssTest = TestCase('CustomCssTest');

CustomCssTest.prototype.testFoo = function() {
  var links = [];
  var head = '';

  var fakeDomHelper = {
    createCssLink: function(link) {
      links.push(link);
    },
    insertInto: function(tag, e) {
      head = tag;
    }
  };
  var defaultModule = new webfont.CustomCss(fakeDomHelper, {
      families: [ 'Font1:n7', 'Font2:i4,i7', 'Font3' ], urls: [ 'http://moo',
          'http://meuh' ]});
  var families = null;
  var variations = null;

  defaultModule.load(function(fontFamilies, fontVariations) { families = fontFamilies; variations = fontVariations;});
  assertEquals('head', head);
  assertEquals(2, links.length);
  assertEquals('http://moo', links[0]);
  assertEquals('http://meuh', links[1]);
  assertNotNull(families);
  assertEquals(3, families.length);
  assertEquals('Font1', families[0]);
  assertEquals('Font2', families[1]);
  assertEquals('Font3', families[2]);
  assertEquals('n7', variations["Font1"][0]);
  assertEquals('i4', variations["Font2"][0]);
  assertEquals('i7', variations["Font2"][1]);
  assertEquals(undefined, variations["Font3"]);
};
