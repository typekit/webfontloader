var AscenderScriptTest = TestCase('AscenderScriptTest');

AscenderScriptTest.prototype.testLoadAndFamilyVariations = function(){

  var insert, css, element;
  var key = 'ec2de397-11ae-4c10-937f-bf94283a70c1';
  var onReadyTriggered = false;

  var fakeDomHelper = {
      insertInto: function(tag, el) {
        insert = tag;
        element = el;
      },
      createCssLink: function(cssLink) {
        css = cssLink;
        return '<link href="' + css + '" type="text/css" />';
      },
      getProtocol: function() {
        return 'http:';
      }
  };

  var configuration = {
    key:key,
    families: ['AndyBold','Arial:bold,regular']
  };

  var fakeOnReady = function(){
    onReadyTriggered = true;
  };

  var as = new webfont.AscenderScript(fakeDomHelper, configuration);

  assertFalse(onReadyTriggered);
  as.load(fakeOnReady);

  assertEquals('http://webfonts.fontslive.com/css/' + key + '.css', css);
  assertEquals('<link href="http://webfonts.fontslive.com/css/' + key + '.css" type="text/css" />', element);
  assertEquals('head', insert);
  assertTrue(onReadyTriggered);

  assertEquals(['n4'], as.parseVariations('regular'));
  assertEquals(['n7'], as.parseVariations('bold'));
  assertEquals(['i4'], as.parseVariations('italic'));
  assertEquals(['i7'], as.parseVariations('bolditalic'));
  assertEquals(['n4'], as.parseVariations('regular,'));
  assertEquals(['n4','n7'], as.parseVariations('regular,bold'));
  assertEquals(['n4','n7'], as.parseVariations('regular,,bold'));
  assertEquals(['n4','n7'], as.parseVariations('n4,n7'));

};
