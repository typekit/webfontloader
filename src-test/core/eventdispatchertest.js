var EventDispatcherTest = TestCase('EventDispatcherTest');

EventDispatcherTest.prototype.setUp = function() {
  this.fakeHtmlElement_ = { className: '' };
  this.loadingEventCalled_ = false;
  this.fontLoadingEventCalled_ = false;
  this.fontLoading_ = '';
  this.fontActiveEventCalled_ = false;
  this.fontActive_ = '';
  this.fontInactvieEventCalled_ = false;
  this.fontInactive_ = '';
  this.activeEventCalled_ = false;
  this.inactiveEventCalled_ = false;
  var namespace = 'ns';
  var self = this;

  this.eventDispatcher_ = new webfont.EventDispatcher(new webfont.DomHelper(
      document), this.fakeHtmlElement_, {
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
          self.fontInactvieEventCalled_ = true;
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

EventDispatcherTest.prototype.testClassNamesOnInactiveLoad = function() {
  this.eventDispatcher_.dispatchLoading();
  assertEquals('ns-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFontLoading('My Family', 'n4');
  assertEquals('ns-loading ns-myfamily-n4-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFontInactive('My Family', 'n4');
  assertEquals('ns-loading ns-myfamily-n4-inactive', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchActive();
  assertEquals('ns-myfamily-n4-inactive ns-active', this.fakeHtmlElement_.className);
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

EventDispatcherTest.prototype.testEventsOnInactiveLoad = function() {
  this.eventDispatcher_.dispatchLoading();
  assertTrue(this.loadingEventCalled_);
  this.eventDispatcher_.dispatchFontLoading('fontFamilyLoading', 'n4');
  assertTrue(this.fontLoadingEventCalled_);
  assertEquals('fontFamilyLoading n4', this.fontLoading_);
  this.eventDispatcher_.dispatchFontInactive('fontFamilyInactive', 'n4');
  assertTrue(this.fontInactvieEventCalled_);
  assertEquals('fontFamilyInactive n4', this.fontInactive_);
  this.eventDispatcher_.dispatchActive();
  assertTrue(this.activeEventCalled_);
};

EventDispatcherTest.prototype.testClassNamesOnInactive = function() {
  this.eventDispatcher_.dispatchInactive();
  assertEquals('ns-inactive', this.fakeHtmlElement_.className);
};

EventDispatcherTest.prototype.testEventsOnInactive = function() {
  this.eventDispatcher_.dispatchInactive();
  assertTrue(this.inactiveEventCalled_);
};
