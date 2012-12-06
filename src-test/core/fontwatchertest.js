var FontWatcherTest = TestCase('FontWatcherTest');

FontWatcherTest.prototype.setUp = function() {
  var self = this;

  this.fontLoadingEventCalled_ = 0;
  this.fontLoading_ = {};
  this.fontActiveEventCalled_ = 0;
  this.fontActive_ = {};
  this.fontInactiveEventCalled_ = 0;
  this.fontInactive_ = {};
  this.activeEventCalled_ = 0;
  this.inactiveEventCalled_ = 0;
  this.fakeEventDispatcher_ = {
    dispatchLoading: function() {
      fail('dispatchLoading should not be called by FontWatcher.');
    },
    dispatchFontLoading: function(fontFamily, fontDescription) {
      self.fontLoadingEventCalled_++;
      self.fontLoading_[fontFamily + ' ' + fontDescription] = true;
    },
    dispatchFontActive: function(fontFamily, fontDescription) {
      self.fontActiveEventCalled_++;
      self.fontActive_[fontFamily + ' ' + fontDescription] = true;
    },
    dispatchFontInactive: function(fontFamily, fontDescription) {
      self.fontInactiveEventCalled_++;
      self.fontInactive_[fontFamily + ' ' + fontDescription] = true;
    },
    dispatchActive: function() {
      self.activeEventCalled_++;
    },
    dispatchInactive: function() {
      self.inactiveEventCalled_++;
    }
  };

  this.fakeDomHelper_ = {
    createElement: function(name, attrs, innerHtml) {
      var element = document.createElement(name);
      return element;
    },
    insertInto: function() {},
    removeElement: function() {},
    setStyle: function() {}
  };

  this.userAgent_ = new webfont.UserAgent('Firefox', '3.6', 'Gecko', '1.9.2', 'Macintosh', '10.6', undefined, true);

  this.fakeFontSizer_ = {
    getSize: function() {
      fail('Fake getSize should not be called.');
    }
  };

  this.fakeAsyncCall_ = function() {
    fail('Fake asyncCall should not be called.');
  };

  this.fakeGetTime_ = function() {
    fail('Fake getTime should not be called.');
  };

  // Mock out FontWatchRunner to return active/inactive for families we give it
  this.originalFontWatchRunner_ = webfont.FontWatchRunner;
  this.fontWatchRunnerActiveFamilies_ = [];
  this.testStringCount_ = 0;
  this.testStrings_ = {};
  webfont.FontWatchRunner = function(activeCallback, inactiveCallback, domHelper,
      fontSizer, asyncCall, getTime, fontFamily, fontDescription, checkWebkitFallbackBug, opt_fontTestString) {
    if (opt_fontTestString) {
      self.testStringCount_++;
      self.testStrings_[fontFamily] = opt_fontTestString;
    }
    this.activeCallback_ = activeCallback;
    this.inactiveCallback_ = inactiveCallback;
    this.fontFamily_ = fontFamily;
    this.fontDescription_ = fontDescription;
  };

  webfont.FontWatchRunner.prototype.start = function() {
    if (self.fontWatchRunnerActiveFamilies_.indexOf(this.fontFamily_) > -1) {
      this.activeCallback_(this.fontFamily_, this.fontDescription_);
    } else {
      this.inactiveCallback_(this.fontFamily_, this.fontDescription_);
    }
  };
};

FontWatcherTest.prototype.tearDown = function() {
  // Replace the original FontWatchRunner implementation
  webfont.FontWatchRunner = this.originalFontWatchRunner_;
};

FontWatcherTest.prototype.testWatchOneFontNotLast = function() {
  var fontFamilies = [ 'fontFamily1' ];
  this.fontWatchRunnerActiveFamilies_ = [ 'fontFamily1' ];

  var fontWatcher = new webfont.FontWatcher(this.userAgent_, this.fakeDomHelper_, this.fakeEventDispatcher_,
      this.fakeFontSizer_, this.fakeAsyncCall_, this.fakeGetTime_);

  fontWatcher.watch(fontFamilies, {}, {}, webfont.FontWatchRunner, false);

  assertEquals(0, this.fontInactiveEventCalled_);
  assertEquals(0, this.activeEventCalled_);
  assertEquals(0, this.inactiveEventCalled_);
};

FontWatcherTest.prototype.testWatchOneFontActive = function() {
  var fontFamilies = [ 'fontFamily1' ];
  this.fontWatchRunnerActiveFamilies_ = [ 'fontFamily1' ];

  var fontWatcher = new webfont.FontWatcher(this.userAgent_, this.fakeDomHelper_, this.fakeEventDispatcher_,
      this.fakeFontSizer_, this.fakeAsyncCall_, this.fakeGetTime_);

  fontWatcher.watch(fontFamilies, {}, {}, webfont.FontWatchRunner, true);

  assertEquals(1, this.fontLoadingEventCalled_);
  assertEquals(true, this.fontLoading_['fontFamily1 n4']);
  assertEquals(1, this.fontActiveEventCalled_);
  assertEquals(true, this.fontActive_['fontFamily1 n4']);
  assertEquals(0, this.fontInactiveEventCalled_);
  assertEquals(1, this.activeEventCalled_);
  assertEquals(0, this.inactiveEventCalled_);
};

FontWatcherTest.prototype.testWatchOneFontInactive = function() {
  var fontFamilies = [ 'fontFamily1' ];
  this.fontWatchRunnerActiveFamilies_ = [];

  var fontWatcher = new webfont.FontWatcher(this.userAgent_, this.fakeDomHelper_, this.fakeEventDispatcher_,
      this.fakeFontSizer_, this.fakeAsyncCall_, this.fakeGetTime_);

  fontWatcher.watch(fontFamilies, {}, {}, webfont.FontWatchRunner, true);

  assertEquals(1, this.fontLoadingEventCalled_);
  assertEquals(true, this.fontLoading_['fontFamily1 n4']);
  assertEquals(0, this.fontActiveEventCalled_);
  assertEquals(1, this.fontInactiveEventCalled_);
  assertEquals(true, this.fontInactive_['fontFamily1 n4']);
  assertEquals(0, this.activeEventCalled_);
  assertEquals(1, this.inactiveEventCalled_);
};

FontWatcherTest.prototype.testWatchMultipleFontsActive = function() {
  var fontFamilies = [ 'fontFamily1', 'fontFamily2', 'fontFamily3' ];
  this.fontWatchRunnerActiveFamilies_ = [ 'fontFamily1', 'fontFamily2', 'fontFamily3' ];

  var fontWatcher = new webfont.FontWatcher(this.userAgent_, this.fakeDomHelper_, this.fakeEventDispatcher_,
      this.fakeFontSizer_, this.fakeAsyncCall_, this.fakeGetTime_);

  fontWatcher.watch(fontFamilies, {}, {}, webfont.FontWatchRunner, true);

  assertEquals(3, this.fontLoadingEventCalled_);
  assertEquals(true, this.fontLoading_['fontFamily1 n4']);
  assertEquals(true, this.fontLoading_['fontFamily2 n4']);
  assertEquals(true, this.fontLoading_['fontFamily3 n4']);
  assertEquals(3, this.fontActiveEventCalled_);
  assertEquals(true, this.fontActive_['fontFamily1 n4']);
  assertEquals(true, this.fontActive_['fontFamily2 n4']);
  assertEquals(true, this.fontActive_['fontFamily3 n4']);
  assertEquals(0, this.fontInactiveEventCalled_);
  assertEquals(1, this.activeEventCalled_);
  assertEquals(0, this.inactiveEventCalled_);
};

FontWatcherTest.prototype.testWatchMultipleFontsInactive = function() {
  var fontFamilies = [ 'fontFamily1', 'fontFamily2', 'fontFamily3' ];
  this.fontWatchRunnerActiveFamilies_ = [];

  var fontWatcher = new webfont.FontWatcher(this.userAgent_, this.fakeDomHelper_, this.fakeEventDispatcher_,
      this.fakeFontSizer_, this.fakeAsyncCall_, this.fakeGetTime_);

  fontWatcher.watch(fontFamilies, {}, {}, webfont.FontWatchRunner, true);

  assertEquals(3, this.fontLoadingEventCalled_);
  assertEquals(true, this.fontLoading_['fontFamily1 n4']);
  assertEquals(true, this.fontLoading_['fontFamily2 n4']);
  assertEquals(true, this.fontLoading_['fontFamily3 n4']);
  assertEquals(0, this.fontActiveEventCalled_);
  assertEquals(3, this.fontInactiveEventCalled_);
  assertEquals(true, this.fontInactive_['fontFamily1 n4']);
  assertEquals(true, this.fontInactive_['fontFamily2 n4']);
  assertEquals(true, this.fontInactive_['fontFamily3 n4']);
  assertEquals(0, this.activeEventCalled_);
  assertEquals(1, this.inactiveEventCalled_);
};

FontWatcherTest.prototype.testWatchMultipleFontsMixed = function() {
  var fontFamilies = [ 'fontFamily1', 'fontFamily2', 'fontFamily3' ];
  this.fontWatchRunnerActiveFamilies_ = [ 'fontFamily1', 'fontFamily3' ];

  var fontWatcher = new webfont.FontWatcher(this.userAgent_, this.fakeDomHelper_, this.fakeEventDispatcher_,
      this.fakeFontSizer_, this.fakeAsyncCall_, this.fakeGetTime_);

  fontWatcher.watch(fontFamilies, {}, {}, webfont.FontWatchRunner, true);

  assertEquals(3, this.fontLoadingEventCalled_);
  assertEquals(true, this.fontLoading_['fontFamily1 n4']);
  assertEquals(true, this.fontLoading_['fontFamily2 n4']);
  assertEquals(true, this.fontLoading_['fontFamily3 n4']);
  assertEquals(2, this.fontActiveEventCalled_);
  assertEquals(true, this.fontActive_['fontFamily1 n4']);
  assertEquals(true, this.fontActive_['fontFamily3 n4']);
  assertEquals(1, this.fontInactiveEventCalled_);
  assertEquals(true, this.fontInactive_['fontFamily2 n4']);
  assertEquals(1, this.activeEventCalled_);
  assertEquals(0, this.inactiveEventCalled_);
};

FontWatcherTest.prototype.testWatchMultipleFontsWithDescriptions = function() {
  var fontFamilies = [ 'fontFamily1', 'fontFamily2', 'fontFamily3' ];
  this.fontWatchRunnerActiveFamilies_ = [ 'fontFamily1', 'fontFamily2' ];

  var fontDescriptions = {
    'fontFamily1': ['i7'],
    'fontFamily2': null,
    'fontFamily3': ['n4', 'i4', 'n7']
  };

  var fontWatcher = new webfont.FontWatcher(this.userAgent_, this.fakeDomHelper_, this.fakeEventDispatcher_,
      this.fakeFontSizer_, this.fakeAsyncCall_, this.fakeGetTime_);

  fontWatcher.watch(fontFamilies, fontDescriptions, {}, webfont.FontWatchRunner, true);

  assertEquals(5, this.fontLoadingEventCalled_);
  assertEquals(true, this.fontLoading_['fontFamily1 i7']);
  assertEquals(true, this.fontLoading_['fontFamily2 n4']);
  assertEquals(true, this.fontLoading_['fontFamily3 n4']);
  assertEquals(true, this.fontLoading_['fontFamily3 i4']);
  assertEquals(true, this.fontLoading_['fontFamily3 n7']);
  assertEquals(2, this.fontActiveEventCalled_);
  assertEquals(true, this.fontActive_['fontFamily1 i7']);
  assertEquals(true, this.fontActive_['fontFamily2 n4']);
  assertEquals(3, this.fontInactiveEventCalled_);
  assertEquals(true, this.fontInactive_['fontFamily3 n4']);
  assertEquals(true, this.fontInactive_['fontFamily3 i4']);
  assertEquals(true, this.fontInactive_['fontFamily3 n7']);
  assertEquals(1, this.activeEventCalled_);
  assertEquals(0, this.inactiveEventCalled_);
};

FontWatcherTest.prototype.testWatchMultipleFontsWithTestStrings = function() {
  var fontFamilies = [ 'fontFamily1', 'fontFamily2', 'fontFamily3', 'fontFamily4' ];
  this.fontWatchRunnerActiveFamilies_ = [ 'fontFamily1', 'fontFamily2' ];

  var fontTestStrings = {
    'fontFamily1': 'testString1',
    'fontFamily2': null,
    'fontFamily3': 'testString3',
    'fontFamily4': null
  };

  var fontWatcher = new webfont.FontWatcher(this.userAgent_, this.fakeDomHelper_, this.fakeEventDispatcher_,
      this.fakeFontSizer_, this.fakeAsyncCall_, this.fakeGetTime_);

  fontWatcher.watch(fontFamilies, {}, fontTestStrings, webfont.FontWatchRunner,
      true);

  assertEquals(2, this.testStringCount_);
  assertEquals('testString1', this.testStrings_['fontFamily1']);
  assertEquals('testString3', this.testStrings_['fontFamily3']);
};

FontWatcherTest.prototype.testNoWebkitBugDetectionOnNonWebkit = function() {
  var ua = new webfont.UserAgent('Firefox', '3.6', 'Gecko', '1.9.2', 'Macintosh', '10.6', undefined, true);
  var fontWatcher = new webfont.FontWatcher(ua, this.fakeDomHelper_, this.fakeEventDispatcher_,
      this.fakeFontSizer_, this.fakeAsyncCall_, this.fakeGetTime_);

  assertEquals(false, fontWatcher.checkWebkitFallbackBug_);
};

FontWatcherTest.prototype.testNoWebkitBugDetectionOnNewWebkit = function() {
  var ua = new webfont.UserAgent('Safari', '6.0.2', 'AppleWebKit', '537.6.17', 'Macintosh', '10_7_5', undefined, true);
  var fontWatcher = new webfont.FontWatcher(ua, this.fakeDomHelper_, this.fakeEventDispatcher_,
      this.fakeFontSizer_, this.fakeAsyncCall_, this.fakeGetTime_);

  assertEquals(false, fontWatcher.checkWebkitFallbackBug_);
};

FontWatcherTest.prototype.testYesWebkitBugDetectionOnOlderWebkit = function() {
  var ua = new webfont.UserAgent('Chrome', '16.0.912.75', 'AppleWebKit', '535.7', 'Android', '4.0.3', undefined, true);
  var fontWatcher = new webfont.FontWatcher(ua, this.fakeDomHelper_, this.fakeEventDispatcher_,
      this.fakeFontSizer_, this.fakeAsyncCall_, this.fakeGetTime_);

  assertEquals(true, fontWatcher.checkWebkitFallbackBug_);
};
