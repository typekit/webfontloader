var EventDispatcherTest = TestCase('EventDispatcherTest');

EventDispatcherTest.prototype.setUp = function() {
  this.fakeHtmlElement_ = { className: '' };
  this.loadingEventCalled_ = false;
  this.familyLoadingEventCalled_ = false;
  this.fontFamilyLoading_ = '';
  this.familyActiveEventCalled_ = false;
  this.fontFamilyActive_ = '';
  this.familyFailedEventCalled_ = false;
  this.fontFamilyFailed_ = '';
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
        familyloading: function(fontFamily) {
          self.familyLoadingEventCalled_ = true;
          self.fontFamilyLoading_ = fontFamily;
        },
        familyactive: function(fontFamily) {
          self.familyActiveEventCalled_ = true;
          self.fontFamilyActive_ = fontFamily;
        },
        familyfailed: function(fontFamily) {
          self.familyFailedEventCalled_ = true;
          self.fontFamilyFailed_ = fontFamily;
        }
  }, namespace);
};

EventDispatcherTest.prototype.testClassNamesOnActiveLoad = function() {
  this.eventDispatcher_.dispatchLoading();
  assertEquals('ns-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFamilyLoading('My Family');
  assertEquals('ns-loading ns-MyFamily-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFamilyActive('My Family');
  assertEquals('ns-loading ns-MyFamily-active', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchActive();
  assertEquals('ns-MyFamily-active ns-active', this.fakeHtmlElement_.className);
};

EventDispatcherTest.prototype.testClassNamesOnInactiveLoad = function() {
  this.eventDispatcher_.dispatchLoading();
  assertEquals('ns-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFamilyLoading('My Family');
  assertEquals('ns-loading ns-MyFamily-loading', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchFamilyFailed('My Family');
  assertEquals('ns-loading ns-MyFamily-failed', this.fakeHtmlElement_.className);
  this.eventDispatcher_.dispatchActive();
  assertEquals('ns-MyFamily-failed ns-active', this.fakeHtmlElement_.className);
};

EventDispatcherTest.prototype.testEventsOnActiveLoad = function() {
  this.eventDispatcher_.dispatchLoading();
  assertTrue(this.loadingEventCalled_);
  this.eventDispatcher_.dispatchFamilyLoading('fontFamilyLoading');
  assertTrue(this.familyLoadingEventCalled_);
  assertEquals('fontFamilyLoading', this.fontFamilyLoading_);
  this.eventDispatcher_.dispatchFamilyActive('fontFamilyActive');
  assertTrue(this.familyActiveEventCalled_);
  assertEquals('fontFamilyActive', this.fontFamilyActive_);
  this.eventDispatcher_.dispatchActive();
  assertTrue(this.activeEventCalled_);
};

EventDispatcherTest.prototype.testEventsOnInactiveLoad = function() {
  this.eventDispatcher_.dispatchLoading();
  assertTrue(this.loadingEventCalled_);
  this.eventDispatcher_.dispatchFamilyLoading('fontFamilyLoading');
  assertTrue(this.familyLoadingEventCalled_);
  assertEquals('fontFamilyLoading', this.fontFamilyLoading_);
  this.eventDispatcher_.dispatchFamilyFailed('fontFamilyInactive');
  assertTrue(this.familyFailedEventCalled_);
  assertEquals('fontFamilyInactive', this.fontFamilyFailed_);
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
