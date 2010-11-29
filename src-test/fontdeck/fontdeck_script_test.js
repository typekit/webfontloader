var FontdeckScriptTest = TestCase('FontdeckScriptTest');

FontdeckScriptTest.prototype.testSupportAndLoadLifecycle = function() {
  var configuration = {
    'id': '161'
  };
  var apiResponse = {
    'css':'http://dev.int.fontdeck.com/s/css/uH5+KWQnibDTJRYggGJ9XZLTAgw/webfontloader/161.css',
    'provides':['Fertigo Pro Regular', 'Fertigo Pro Bold']
  };
  var insert = '';
  var src = '';
  var fakeDomHelper = {
      insertInto: function(tag, e) {
        insert = tag;
      },
      createScriptSrc: function(srcLink) {
        src = srcLink;
      },
      createCssLink: function(cssLink) {
        css = cssLink;
        return '<link href="' + css + '" type="text/css" />';
      }
  };
  var global = {};
  var fontdeck = new webfont.FontdeckScript(global, fakeDomHelper, configuration);

  // supportUserAgent
  var userAgent = 'user agent';
  var isSupport = null;

  fontdeck.supportUserAgent(userAgent, function(support) { isSupport = support; });
  assertEquals('head', insert);
  assertEquals('http://dev.int.fontdeck.com/api/v1/project-info?project=161&domain=localhost&callback=window.__webfontfontdeckmodule__[161]', src);
  assertEquals(null, isSupport);

  assertNotNull(global.__webfontfontdeckmodule__);
  assertNotNull(global.__webfontfontdeckmodule__['161']);
  
  // Call the callback function passing in dummy API response.
  global.__webfontfontdeckmodule__['161'](apiResponse);
  
  assertEquals(fontdeck.fontFamilies_, apiResponse.provides);

};