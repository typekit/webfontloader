var FontTest = TestCase('FontTest');

FontTest.prototype.setUp = function() {
  this.fontModuleLoader_ = new webfont.FontModuleLoader();
};

FontTest.prototype.testFontLoad = function() {
  var browserInfo = new webfont.BrowserInfo(true, false, false);
  var userAgent = new webfont.UserAgent('Firefox', '3.6', 'Gecko', '1.9.2',
      'Macintosh', '10.6', undefined, browserInfo);
  var font = new webfont.WebFont(window, this.fontModuleLoader_,
      function(func, timeout) { func(); }, userAgent);
  var testModule = null;

  font.addModule('test', function(conf, domHelper) {
    testModule = new function() {
      this.conf = conf;
      this.domHelper = domHelper;
      this.loadCalled = false;
      this.supportUserAgentCalled = false;
    };
    testModule.load = function(onReady) {
      this.loadCalled = true;
      onReady([]);
    };
    testModule.supportUserAgent = function(ua, support) {
      this.supportUserAgentCalled = true;
      support(true);
    };
    return testModule;
  });

  assertEquals(0, font.moduleFailedLoading_);
  assertEquals(0, font.moduleLoading_);

  var loadingEventCalled = false;
  font.load({
      test: {
        somedata: 'in french a cow says meuh'
      },
      loading: function() {
        loadingEventCalled = true;
      }
  });

  assertEquals(1, font.moduleFailedLoading_);
  assertEquals(0, font.moduleLoading_);
  assertNotNull(testModule);
  assertNotUndefined(testModule.conf);
  assertNotNull(testModule.conf);
  assertNotUndefined(testModule.domHelper);
  assertNotNull(testModule.domHelper);
  assertSame(window, testModule.domHelper.getMainWindow());
  assertSame(window, testModule.domHelper.getLoadWindow());
  assertEquals('in french a cow says meuh', testModule.conf.somedata);
  assertTrue(testModule.loadCalled);
  assertTrue(testModule.supportUserAgentCalled);
  assertTrue(loadingEventCalled);
};

FontTest.prototype.testFontLoadWithContext = function() {
  var fakeMainWindow = {};
  var browserInfo = new webfont.BrowserInfo(true, false, false);
  var userAgent = new webfont.UserAgent('Firefox', '3.6', 'Gecko', '1.9.2',
      'Macintosh', '10.6', undefined, browserInfo);
  var font = new webfont.WebFont(fakeMainWindow, this.fontModuleLoader_,
      function(func, timeout) { func(); }, userAgent);
  var testModule = null;

  font.addModule('test', function(conf, domHelper) {
    testModule = new function() {
      this.domHelper = domHelper;
    };
    testModule.load = function() {};
    testModule.supportUserAgent = function(ua, support) {
      support(true);
    };
    return testModule;
  });

  font.load({
    test: {
      somedata: 'in french a cow says meuh'
    },
    context: window
  });

  assertNotUndefined(testModule.domHelper);
  assertNotNull(testModule.domHelper);
  assertSame(fakeMainWindow, testModule.domHelper.getMainWindow());
  assertSame(window, testModule.domHelper.getLoadWindow());
};

FontTest.prototype.testFontInactive = function() {
  var userAgent = new webfont.UserAgent('Firefox', '3.0', false);
  var font = new webfont.WebFont(window, this.fontModuleLoader_,
      function(func, timeout) { func(); }, userAgent);
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
