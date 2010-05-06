var DefaultModuleTest = TestCase('DefaultModuleTest');

DefaultModuleTest.prototype.testFoo = function() {
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
  var defaultModule = new webfont.DefaultModule(fakeDomHelper, {
      families: [ 'Font1', 'Font2', 'Font3' ], urls: [ 'http://moo',
          'http://meuh' ]});
  var fonts = null;

  defaultModule.load(function(fontFamilies) { fonts = fontFamilies; });
  assertEquals('head', head);
  assertEquals(2, links.length);
  assertEquals('http://moo', links[0]);
  assertEquals('http://meuh', links[1]);
  assertNotNull(fonts);
  assertEquals(3, fonts.length);
  assertEquals('Font1', fonts[0]);
  assertEquals('Font2', fonts[1]);
  assertEquals('Font3', fonts[2]);
};
