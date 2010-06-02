var AscenderScriptTest = TestCase('AscenderScriptTest');

AscenderScriptTest.prototype.testLoadAndFamilyVariations = function(){

  var insert, css, element;
  var cssKey = 'e8e3d05f-2a8b-4835-8889-7b8bb3351c61';
  var onReadyTriggered = false;
  
  var fakeDomHelper = {
      insertInto: function(tag, el) {
        insert = tag;
        element = el;
      },
      createCssLink: function(cssLink) {
        css = cssLink;
        return '<link href="' + css + '" type="text/css" />';
      }
  };

  var configuration = {
    cssKey:cssKey,
    families: ['AndyBold','Arial:bold,regular']
  };
  
  var fakeOnReady = function(){
    onReadyTriggered = true;
  };

  var as = new webfont.AscenderScript(fakeDomHelper, configuration);
  
  assertFalse(onReadyTriggered);
  as.load(fakeOnReady);
  
  assertEquals('http://webfonts.fontslive.com/css/' + cssKey + '.css', css);
  assertEquals('<link href="http://webfonts.fontslive.com/css/' + cssKey + '.css" type="text/css" />', element);
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
