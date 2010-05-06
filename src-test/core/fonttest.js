var FontTest = TestCase('FontTest');

FontTest.prototype.setUp = function() {
  this.fakeHtmlElement_ = { className: '' };
  this.fakeDomHelper_ = {
    appendClassName: function() {},
    createElement: function(name) {
      return document.createElement(name);
    },
    insertInto: function() {},
    removeElement: function() {}
  };
  this.fontModuleLoader_ = new webfont.FontModuleLoader();
};

FontTest.prototype.testFontLoad = function() {
  var userAgent = new webfont.UserAgent('Firefox', '3.6', 'Gecko', '1.9.2',
      'Macintosh', true);
  var font = new webfont.WebFont(this.fakeDomHelper_, this.fontModuleLoader_,
      this.fakeHtmlElement_, function(func, timeout) { func(); }, userAgent);
  var self = this;
  var testModule = null;

  font.addModule('test', function(conf) {
    testModule = new function() {
      this.conf = conf;
      this.loadCalled = false;
      this.supportUserAgentCalled = false;
   };
   testModule.load = function(onReady) { this.loadCalled = true; onReady([]) };
   testModule.supportUserAgent = function(ua, support) {
     this.supportUserAgentCalled = true;
     support(true);
   };
   return testModule;
  });
  var loadingEventCalled = false;

  font.load({
      test: {
        somedata: 'in french a cow says meuh'
      },
      loading: function() {
        loadingEventCalled = true;
      }
  });
  assertNotNull(testModule)
  assertNotUndefined(testModule.conf);
  assertNotNull(testModule.conf);
  assertEquals('in french a cow says meuh', testModule.conf.somedata);
  assertTrue(testModule.loadCalled);
  assertTrue(testModule.supportUserAgentCalled);
  assertTrue(loadingEventCalled);
};

FontTest.prototype.testFontInactive = function() {
  var userAgent = new webfont.UserAgent('Firefox', '3.0', false);
  var font = new webfont.WebFont(this.fakeDomHelper_, this.fontModuleLoader_,
      this.fakeHtmlElement_, function(func, timeout) { func(); }, userAgent);
  var self = this;
  var testModule;

  font.addModule('test', function(conf) {
    testModule = new function() {
      this.conf = conf;
      this.loadCalled = false;
   };
   testModule.load = function(onReady) { };
   return testModule;
  });
  var onInactiveCalled = false;

  font.load({
      test: {
        somedata: 'in french a cow says meuh'
      },
      inactive: function() {
        onInactiveCalled = true;
      }
  });
  assertUndefined(testModule);
  assertTrue(onInactiveCalled);
};
