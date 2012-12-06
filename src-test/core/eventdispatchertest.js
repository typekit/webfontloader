var EventDispatcherTest = TestCase('EventDispatcherTest');

EventDispatcherTest.prototype.setUp = function() {
  this.fakeHtmlElement_ = { className: '' };
  this.loadingEventCalled_ = false;
  this.fontLoadingEventCalled_ = false;
  this.fontLoading_ = '';
  this.fontActiveEventCalled_ = false;
  this.fontActive_ = '';
  this.fontInactiveEventCalled_ = false;
  this.fontInactive_ = '';
  this.activeEventCalled_ = false;
  this.inactiveEventCalled_ = false;
  var namespace = 'ns';
  var self = this;

  this.eventDispatcher_ = new webfont.EventDispatcher(new webfont.DomHelper(
      window), this.fakeHtmlElement_, {
        loading: function() {
          self.loadingEventCalled_ = true;
        },
        active: function() {
          self.activeEventCalled_ = true;
        },
        inactive: function() {
          self.inactiveEventCalled_ = true;
	      },
        fontloading: function(fontFamily, fontDescription) {
          self.fontLoadingEventCalled_ = true;
          self.fontLoading_ = fontFamily + ' ' + fontDescription;
        },
        fontactive: function(fontFamily, fontDescription) {
          self.fontActiveEventCalled_ = true;
          self.fontActive_ = fontFamily + ' ' + fontDescription;
        },
        fontinactive: function(fontFamily, fontDescription) {
          self.fontInactiveEventCalled_ = true;
          self.fontInactive_ = fontFamily + ' ' + fontDescription;
        }
  }, namespace);
};

EventDispatcherTest.prototype.testClassNamesOnActiveLoad = function() {
  this.eventDispatcher_.dispatchLoading();
  assertEquals('ns-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFontLoading('My Family', 'n4');
  assertEquals('ns-loading ns-myfamily-n4-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFontActive('My Family', 'n4');
  assertEquals('ns-loading ns-myfamily-n4-active', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchActive();
  assertEquals('ns-myfamily-n4-active ns-active', this.fakeHtmlElement_.className);
};

EventDispatcherTest.prototype.testEventsOnActiveLoad = function() {
  this.eventDispatcher_.dispatchLoading();
  assertTrue(this.loadingEventCalled_);
  this.eventDispatcher_.dispatchFontLoading('fontFamilyLoading', 'n4');
  assertTrue(this.fontLoadingEventCalled_);
  assertEquals('fontFamilyLoading n4', this.fontLoading_);
  this.eventDispatcher_.dispatchFontActive('fontFamilyActive', 'n4');
  assertTrue(this.fontActiveEventCalled_);
  assertEquals('fontFamilyActive n4', this.fontActive_);
  this.eventDispatcher_.dispatchActive();
  assertTrue(this.activeEventCalled_);
};

EventDispatcherTest.prototype.testClassNamesOnInactiveFontButActive = function() {
  this.eventDispatcher_.dispatchLoading();
  assertEquals('ns-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFontLoading('My Family', 'n4');
  assertEquals('ns-loading ns-myfamily-n4-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFontInactive('My Family', 'n4');
  assertEquals('ns-loading ns-myfamily-n4-inactive', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchActive();
  assertEquals('ns-myfamily-n4-inactive ns-active', this.fakeHtmlElement_.className);
};

EventDispatcherTest.prototype.testEventsOnInactiveFontButActive = function() {
  this.eventDispatcher_.dispatchLoading();
  assertTrue(this.loadingEventCalled_);
  this.eventDispatcher_.dispatchFontLoading('fontFamilyLoading', 'n4');
  assertTrue(this.fontLoadingEventCalled_);
  assertEquals('fontFamilyLoading n4', this.fontLoading_);
  this.eventDispatcher_.dispatchFontInactive('fontFamilyInactive', 'n4');
  assertTrue(this.fontInactiveEventCalled_);
  assertEquals('fontFamilyInactive n4', this.fontInactive_);
  this.eventDispatcher_.dispatchActive();
  assertTrue(this.activeEventCalled_);
};

EventDispatcherTest.prototype.testClassNamesOnInactiveLoad = function() {
  this.eventDispatcher_.dispatchLoading();
  assertEquals('ns-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFontLoading('My Family', 'n4');
  assertEquals('ns-loading ns-myfamily-n4-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFontInactive('My Family', 'n4');
  assertEquals('ns-loading ns-myfamily-n4-inactive', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchInactive();
  assertEquals('ns-myfamily-n4-inactive ns-inactive', this.fakeHtmlElement_.className);
};

EventDispatcherTest.prototype.testEventsOnInactiveLoad = function() {
  this.eventDispatcher_.dispatchLoading();
  assertTrue(this.loadingEventCalled_);
  this.eventDispatcher_.dispatchFontLoading('fontFamilyLoading', 'n4');
  assertTrue(this.fontLoadingEventCalled_);
  assertEquals('fontFamilyLoading n4', this.fontLoading_);
  this.eventDispatcher_.dispatchFontInactive('fontFamilyInactive', 'n4');
  assertTrue(this.fontInactiveEventCalled_);
  assertEquals('fontFamilyInactive n4', this.fontInactive_);
  this.eventDispatcher_.dispatchInactive();
  assertTrue(this.inactiveEventCalled_);
};

EventDispatcherTest.prototype.testClassNamesOnInactive = function() {
  this.eventDispatcher_.dispatchInactive();
  assertEquals('ns-inactive', this.fakeHtmlElement_.className);
};

EventDispatcherTest.prototype.testEventsOnInactive = function() {
  this.eventDispatcher_.dispatchInactive();
  assertTrue(this.inactiveEventCalled_);
};

EventDispatcherTest.prototype.testClassNamesOnInactiveThenActiveLoad = function() {
  this.eventDispatcher_.dispatchLoading();
  assertEquals('ns-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFontLoading('My Family', 'n4');
  assertEquals('ns-loading ns-myfamily-n4-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFontInactive('My Family', 'n4');
  assertEquals('ns-loading ns-myfamily-n4-inactive', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchInactive();
  assertEquals('ns-myfamily-n4-inactive ns-inactive', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchLoading();
  assertEquals('ns-myfamily-n4-inactive ns-inactive ns-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFontLoading('My Family 2', 'n4');
  assertEquals('ns-myfamily-n4-inactive ns-inactive ns-loading ns-myfamily2-n4-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFontActive('My Family 2', 'n4');
  assertEquals('ns-myfamily-n4-inactive ns-inactive ns-loading ns-myfamily2-n4-active', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchActive();
  assertEquals('ns-myfamily-n4-inactive ns-myfamily2-n4-active ns-active', this.fakeHtmlElement_.className);
};

EventDispatcherTest.prototype.testClassNamesOnInactiveThenActiveLoadSameFont = function() {
  this.eventDispatcher_.dispatchLoading();
  assertEquals('ns-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFontLoading('My Family', 'n4');
  assertEquals('ns-loading ns-myfamily-n4-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFontInactive('My Family', 'n4');
  assertEquals('ns-loading ns-myfamily-n4-inactive', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchInactive();
  assertEquals('ns-myfamily-n4-inactive ns-inactive', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchLoading();
  assertEquals('ns-myfamily-n4-inactive ns-inactive ns-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFontLoading('My Family', 'n4');
  assertEquals('ns-myfamily-n4-inactive ns-inactive ns-loading ns-myfamily-n4-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFontActive('My Family', 'n4');
  assertEquals('ns-inactive ns-loading ns-myfamily-n4-active', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchActive();
  assertEquals('ns-myfamily-n4-active ns-active', this.fakeHtmlElement_.className);
};

EventDispatcherTest.prototype.testClassNamesOnActiveThenInactiveLoad = function() {
  this.eventDispatcher_.dispatchLoading();
  assertEquals('ns-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFontLoading('My Family', 'n4');
  assertEquals('ns-loading ns-myfamily-n4-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFontActive('My Family', 'n4');
  assertEquals('ns-loading ns-myfamily-n4-active', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchActive();
  assertEquals('ns-myfamily-n4-active ns-active', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchLoading();
  assertEquals('ns-myfamily-n4-active ns-active ns-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFontLoading('My Family 2', 'n4');
  assertEquals('ns-myfamily-n4-active ns-active ns-loading ns-myfamily2-n4-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFontInactive('My Family 2', 'n4');
  assertEquals('ns-myfamily-n4-active ns-active ns-loading ns-myfamily2-n4-inactive', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchInactive();
  assertEquals('ns-myfamily-n4-active ns-active ns-myfamily2-n4-inactive', this.fakeHtmlElement_.className);
};

EventDispatcherTest.prototype.testClassNamesOnActiveThenInactiveLoadSameFont = function() {
  this.eventDispatcher_.dispatchLoading();
  assertEquals('ns-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFontLoading('My Family', 'n4');
  assertEquals('ns-loading ns-myfamily-n4-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFontActive('My Family', 'n4');
  assertEquals('ns-loading ns-myfamily-n4-active', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchActive();
  assertEquals('ns-myfamily-n4-active ns-active', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchLoading();
  assertEquals('ns-myfamily-n4-active ns-active ns-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFontLoading('My Family', 'n4');
  assertEquals('ns-myfamily-n4-active ns-active ns-loading ns-myfamily-n4-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFontInactive('My Family', 'n4');
  assertEquals('ns-myfamily-n4-active ns-active ns-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchInactive();
  assertEquals('ns-myfamily-n4-active ns-active', this.fakeHtmlElement_.className);
};

EventDispatcherTest.prototype.testClassNamesOnActiveThenActiveLoad = function() {
  this.eventDispatcher_.dispatchLoading();
  assertEquals('ns-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFontLoading('My Family', 'n4');
  assertEquals('ns-loading ns-myfamily-n4-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFontActive('My Family', 'n4');
  assertEquals('ns-loading ns-myfamily-n4-active', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchActive();
  assertEquals('ns-myfamily-n4-active ns-active', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchLoading();
  assertEquals('ns-myfamily-n4-active ns-active ns-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFontLoading('My Family 2', 'n4');
  assertEquals('ns-myfamily-n4-active ns-active ns-loading ns-myfamily2-n4-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFontActive('My Family 2', 'n4');
  assertEquals('ns-myfamily-n4-active ns-active ns-loading ns-myfamily2-n4-active', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchActive();
  assertEquals('ns-myfamily-n4-active ns-active ns-myfamily2-n4-active', this.fakeHtmlElement_.className);
};

EventDispatcherTest.prototype.testClassNamesOnActiveThenActiveLoadSameFont = function() {
  this.eventDispatcher_.dispatchLoading();
  assertEquals('ns-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFontLoading('My Family', 'n4');
  assertEquals('ns-loading ns-myfamily-n4-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFontActive('My Family', 'n4');
  assertEquals('ns-loading ns-myfamily-n4-active', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchActive();
  assertEquals('ns-myfamily-n4-active ns-active', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchLoading();
  assertEquals('ns-myfamily-n4-active ns-active ns-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFontLoading('My Family', 'n4');
  assertEquals('ns-myfamily-n4-active ns-active ns-loading ns-myfamily-n4-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFontActive('My Family', 'n4');
  assertEquals('ns-myfamily-n4-active ns-active ns-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchActive();
  assertEquals('ns-myfamily-n4-active ns-active', this.fakeHtmlElement_.className);
};

EventDispatcherTest.prototype.testClassNamesOnInactiveThenInactiveLoad = function() {
  this.eventDispatcher_.dispatchLoading();
  assertEquals('ns-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFontLoading('My Family', 'n4');
  assertEquals('ns-loading ns-myfamily-n4-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFontInactive('My Family', 'n4');
  assertEquals('ns-loading ns-myfamily-n4-inactive', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchInactive();
  assertEquals('ns-myfamily-n4-inactive ns-inactive', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchLoading();
  assertEquals('ns-myfamily-n4-inactive ns-inactive ns-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFontLoading('My Family 2', 'n4');
  assertEquals('ns-myfamily-n4-inactive ns-inactive ns-loading ns-myfamily2-n4-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFontInactive('My Family 2', 'n4');
  assertEquals('ns-myfamily-n4-inactive ns-inactive ns-loading ns-myfamily2-n4-inactive', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchInactive();
  assertEquals('ns-myfamily-n4-inactive ns-inactive ns-myfamily2-n4-inactive', this.fakeHtmlElement_.className);
};

EventDispatcherTest.prototype.testClassNamesOnInactiveThenInactiveLoadSameFont = function() {
  this.eventDispatcher_.dispatchLoading();
  assertEquals('ns-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFontLoading('My Family', 'n4');
  assertEquals('ns-loading ns-myfamily-n4-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFontInactive('My Family', 'n4');
  assertEquals('ns-loading ns-myfamily-n4-inactive', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchInactive();
  assertEquals('ns-myfamily-n4-inactive ns-inactive', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchLoading();
  assertEquals('ns-myfamily-n4-inactive ns-inactive ns-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFontLoading('My Family', 'n4');
  assertEquals('ns-myfamily-n4-inactive ns-inactive ns-loading ns-myfamily-n4-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFontInactive('My Family', 'n4');
  assertEquals('ns-myfamily-n4-inactive ns-inactive ns-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchInactive();
  assertEquals('ns-myfamily-n4-inactive ns-inactive', this.fakeHtmlElement_.className);
};
