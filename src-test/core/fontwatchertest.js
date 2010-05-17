var FontWatcherTest = TestCase('FontWatcherTest');

FontWatcherTest.prototype.setUp = function() {
  var self = this;

  this.classNames_ = {};
  this.classNamesCount_ = 0;
  this.fakeDomHelper_ = {
    removeElement: function() {},
    createElement: function(name, attrs) {
      var element = document.createElement(name);

      for (var attr in attrs) {
        element.setAttribute(attr, attrs[attr]);
      }
      return element;
    },
    insertInto: function() {},
    appendClassName: function(e, name) {
      self.classNames_[name] = true;
      self.classNamesCount_++;
    },
    removeClassName: function(e, name) {
      var exists = self.classNames_[name];
      if (exists) {
        self.classNames_[name] = false;
        self.classNamesCount_--;
      }
    }
  };
  this.fakeHtmlElement_ = { className: '' };
  this.loadingEventCalled_ = false;
  this.fontLoadingEventCalled_ = 0;
  this.fontLoading_ = [];
  this.fontActiveEventCalled_ = 0;
  this.fontActive_ = [];
  this.fontInactvieEventCalled_ = 0;
  this.fontInactive_ = [];
  this.activeEventCalled_ = 0;

  var namespace = 'ns';

  this.callbacks_ = {
      loading: function() {
        self.loadingEventCalled_ = true;
      },
      active: function() {
        self.activeEventCalled_++;
      },
      fontloading: function(fontFamily, fontDescription) {
        self.fontLoadingEventCalled_++;
        self.fontLoading_.push(fontFamily + ' ' + fontDescription);
      },
      fontactive: function(fontFamily, fontDescription) {
        self.fontActiveEventCalled_++;
        self.fontActive_.push(fontFamily + ' ' + fontDescription);
      },
      fontinactive: function(fontFamily, fontDescription) {
        self.fontInactvieEventCalled_++;
        self.fontInactive_.push(fontFamily + ' ' + fontDescription);
      }
  };
  this.eventDispatcher_ = new webfont.EventDispatcher(this.fakeDomHelper_,
      this.fakeHtmlElement_, this.callbacks_, namespace);
};

FontWatcherTest.prototype.testWatchOneFontAlreadyLoaded = function() {
  var fontWatcher = new webfont.FontWatcher(this.fakeDomHelper_,
      this.eventDispatcher_, {
        getWidth: function(element) {
          var fontFamily = element.style.fontFamily;
          var requestedFont = fontFamily.substring(0, fontFamily.indexOf(','));

          if (requestedFont.indexOf("DEFAULT_FONT") != -1) {
            return 1;
          } else {
            return 2;
          }
        }
  }, function() {}, function() { return 0; });
  var fontFamilies = [ 'fontFamily1' ];

  fontWatcher.watch(fontFamilies, {}, false);
  assertEquals(1, this.fontLoadingEventCalled_);
  assertEquals(1, this.fontLoading_.length);
  assertEquals('fontFamily1 n4', this.fontLoading_[0]);
  assertEquals(1, this.fontActiveEventCalled_);
  assertEquals(1, this.fontActive_.length);
  assertEquals('fontFamily1 n4', this.fontActive_[0]);
};

FontWatcherTest.prototype.testWatchMultipleFontsAlreadyLoaded = function() {
  var fontWatcher = new webfont.FontWatcher(this.fakeDomHelper_, this.eventDispatcher_,{
        getWidth: function(element) {
          var fontFamily = element.style.fontFamily;
          var requestedFont = fontFamily.substring(0, fontFamily.indexOf(','));

          if (requestedFont.indexOf("DEFAULT_FONT") != -1) {
            return 1;
          } else {
            return 2;
          }
        }
  }, function() {}, function() { return 0; });
  var fontFamilies = [ 'fontFamily1', 'fontFamily2', 'fontFamily3' ];

  fontWatcher.watch(fontFamilies, {}, false);
  assertEquals(3, this.fontLoadingEventCalled_);
  assertEquals(3, this.fontLoading_.length);
  assertEquals('fontFamily1 n4', this.fontLoading_[0]);
  assertEquals('fontFamily2 n4', this.fontLoading_[1]);
  assertEquals('fontFamily3 n4', this.fontLoading_[2]);
  assertEquals(3, this.fontActiveEventCalled_);
  assertEquals(3, this.fontActive_.length);
  assertEquals('fontFamily1 n4', this.fontActive_[0]);
  assertEquals('fontFamily2 n4', this.fontActive_[1]);
  assertEquals('fontFamily3 n4', this.fontActive_[2]);
};

FontWatcherTest.prototype.testWatchOneFontWaitForLoad = function() {
  var async = false;
  var fontWatcher = new webfont.FontWatcher(this.fakeDomHelper_,
      this.eventDispatcher_, {

        count_: 0,

        getWidth: function(element) {
          var fontFamily = element.style.fontFamily;
          var requestedFont = fontFamily.substring(0, fontFamily.indexOf(','));

          if (requestedFont.indexOf("DEFAULT_FONT") != -1) {
            return 1;
          } else if (this.count_ == 0) {
            this.count_++;
            return 1;
          } else if (this.count_ == 1) {
            return 2;
	  }
        }
  }, function(func, timeout) {
    async = true;
    func();
  }, function() { return 0; });
  var fontFamilies = [ 'fontFamily1' ];

  fontWatcher.watch(fontFamilies, {}, false);
  assertTrue(async);
  assertEquals(1, this.fontLoadingEventCalled_);
  assertEquals(1, this.fontLoading_.length);
  assertEquals('fontFamily1 n4', this.fontLoading_[0]);
  assertEquals(1, this.fontActiveEventCalled_);
  assertEquals(1, this.fontActive_.length);
  assertEquals('fontFamily1 n4', this.fontActive_[0]);
};

FontWatcherTest.prototype.testWatchMultipleFontsWaitForLoad = function() {
  var async = 0;
  var fontWatcher = new webfont.FontWatcher(this.fakeDomHelper_,
      this.eventDispatcher_, {

        font1Count_: 0,
        font2Count_: 0,
        font3Count_: 0,

        getWidth: function(element) {
          var fontFamily = element.style.fontFamily;
          var requestedFont = fontFamily.substring(0, fontFamily.indexOf(','));

          if (requestedFont.indexOf("DEFAULT_FONT") != -1) {
            return 1;
          } else if (requestedFont.indexOf("fontFamily1") != -1 &&
              this.font1Count_ != 2) {
            this.font1Count_++;
            return 1;
          } else if (requestedFont.indexOf("fontFamily2") != -1 &&
              this.font2Count_ != 1) {
            this.font2Count_++;
            return 1;
          } else if (requestedFont.indexOf("fontFamily3") != -1 &&
              this.font3Count_ != 5) {
            this.font3Count_++;
            return 1;
          } else {
            return 2;
	  }
        }
  }, function(func, timeout) {
    async++;
    func();
  }, function() { return 0; });
  var fontFamilies = [ 'fontFamily1', 'fontFamily2', 'fontFamily3' ];

  fontWatcher.watch(fontFamilies, {}, false);
  assertEquals(8, async);
  assertEquals(3, this.fontLoadingEventCalled_);
  assertEquals(3, this.fontLoading_.length);
  assertEquals('fontFamily1 n4', this.fontLoading_[0]);
  assertEquals('fontFamily2 n4', this.fontLoading_[1]);
  assertEquals('fontFamily3 n4', this.fontLoading_[2]);
  assertEquals(3, this.fontActiveEventCalled_);
  assertEquals(3, this.fontActive_.length);
  assertEquals('fontFamily1 n4', this.fontActive_[0]);
  assertEquals('fontFamily2 n4', this.fontActive_[1]);
  assertEquals('fontFamily3 n4', this.fontActive_[2]);
};

FontWatcherTest.prototype.testWatchMultipleFontsWaitForLoadAndLoaded =
    function() {
  var async = 0;
  var fontWatcher = new webfont.FontWatcher(this.fakeDomHelper_,
      this.eventDispatcher_, {

        font1Count_: 0,
        font3Count_: 0,

        getWidth: function(element) {
          var fontFamily = element.style.fontFamily;
          var requestedFont = fontFamily.substring(0, fontFamily.indexOf(','));

          if (requestedFont.indexOf("DEFAULT_FONT") != -1) {
            return 1;
          } else if (requestedFont.indexOf("fontFamily1") != -1 &&
              this.font1Count_ != 2) {
            this.font1Count_++;
            return 1;
          } else if (requestedFont.indexOf("fontFamily3") != -1 &&
              this.font3Count_ != 5) {
            this.font3Count_++;
            return 1;
          } else {
            return 2;
	  }
        }
  }, function(func, timeout) {
    async++;
    func();
  }, function() { return 0; });
  var fontFamilies = [ 'fontFamily1', 'fontFamily2', 'fontFamily3' ];

  fontWatcher.watch(fontFamilies, {}, false);
  assertEquals(7, async);
  assertEquals(3, this.fontLoadingEventCalled_);
  assertEquals(3, this.fontLoading_.length);
  assertEquals('fontFamily1 n4', this.fontLoading_[0]);
  assertEquals('fontFamily2 n4', this.fontLoading_[1]);
  assertEquals('fontFamily3 n4', this.fontLoading_[2]);
  assertEquals(3, this.fontActiveEventCalled_);
  assertEquals(3, this.fontActive_.length);
  assertEquals('fontFamily1 n4', this.fontActive_[0]);
  assertEquals('fontFamily2 n4', this.fontActive_[1]);
  assertEquals('fontFamily3 n4', this.fontActive_[2]);
};

FontWatcherTest.prototype.testWatchOneFontWaitForLoadInactive = function() {
  var time = 0;
  var fontWatcher = new webfont.FontWatcher(this.fakeDomHelper_,
      this.eventDispatcher_, {

        count_: 0,

        getWidth: function(element) {
          return 1;
        }
  }, function(func, timeout) {
    func();
  }, function() {
    time += 2500;
    return time;
  });
  var fontFamilies = [ 'fontFamily1' ];

  fontWatcher.watch(fontFamilies, {}, false);
  assertEquals(1, this.fontLoadingEventCalled_);
  assertEquals(1, this.fontLoading_.length);
  assertEquals('fontFamily1 n4', this.fontLoading_[0]);
  assertEquals(1, this.fontInactvieEventCalled_);
  assertEquals(1, this.fontInactive_.length);
  assertEquals('fontFamily1 n4', this.fontInactive_[0]);
};

FontWatcherTest.prototype.testWatchMultipleFontsWaitForLoadAndInactive =
    function() {
  var count = 0;
  var async = 0;
  var fontWatcher = new webfont.FontWatcher(this.fakeDomHelper_,
      this.eventDispatcher_, {

        font1Count_: 0,
        font3Count_: 0,

        getWidth: function(element) {
          var fontFamily = element.style.fontFamily;
          var requestedFont = fontFamily.substring(0, fontFamily.indexOf(','));

          if (requestedFont.indexOf("DEFAULT_FONT") != -1) {
            return 1;
          } else if (requestedFont.indexOf("fontFamily1") != -1 &&
              this.font1Count_ != 2) {
            this.font1Count_++;
            return 1;
          } else if (requestedFont.indexOf("fontFamily2") != -1) {
            return 1;
          } else if (requestedFont.indexOf("fontFamily3") != -1 &&
              this.font3Count_ != 5) {
            this.font3Count_++;
            return 1;
          } else {
            return 2;
	  }
        }
  }, function(func, timeout) {
    async++;
    func();
  }, function() {
    if (++count == 5) {
      return 5001;
    }
    return 0;
  });
  var fontFamilies = [ 'fontFamily1', 'fontFamily2', 'fontFamily3' ];

  fontWatcher.watch(fontFamilies, {}, false);
  assertEquals(9, async);
  assertEquals(3, this.fontLoadingEventCalled_);
  assertEquals(3, this.fontLoading_.length);
  assertEquals('fontFamily1 n4', this.fontLoading_[0]);
  assertEquals('fontFamily2 n4', this.fontLoading_[1]);
  assertEquals('fontFamily3 n4', this.fontLoading_[2]);
  assertEquals(2, this.fontActiveEventCalled_);
  assertEquals(2, this.fontActive_.length);
  assertEquals('fontFamily1 n4', this.fontActive_[0]);
  assertEquals('fontFamily3 n4', this.fontActive_[1]);
  assertEquals(1, this.fontInactvieEventCalled_);
  assertEquals('fontFamily2 n4', this.fontInactive_[0]);
};

FontWatcherTest.prototype.testWatchMultipleFontsAlreadyLoadedAndLastBatchOnDone
    = function() {
  var fontWatcher = new webfont.FontWatcher(this.fakeDomHelper_, this.eventDispatcher_,{
        getWidth: function(element) {
          var fontFamily = element.style.fontFamily;
          var requestedFont = fontFamily.substring(0, fontFamily.indexOf(','));

          if (requestedFont.indexOf("DEFAULT_FONT") != -1) {
            return 1;
          } else {
            return 2;
          }
        }
  }, function() {}, function() { return 0; });
  var fontFamilies = [ 'fontFamily1', 'fontFamily2', 'fontFamily3' ];

  fontWatcher.watch(fontFamilies, {}, true);
  assertEquals(3, this.fontLoadingEventCalled_);
  assertEquals(3, this.fontLoading_.length);
  assertEquals('fontFamily1 n4', this.fontLoading_[0]);
  assertEquals('fontFamily2 n4', this.fontLoading_[1]);
  assertEquals('fontFamily3 n4', this.fontLoading_[2]);
  assertEquals(3, this.fontActiveEventCalled_);
  assertEquals(3, this.fontActive_.length);
  assertEquals('fontFamily1 n4', this.fontActive_[0]);
  assertEquals('fontFamily2 n4', this.fontActive_[1]);
  assertEquals('fontFamily3 n4', this.fontActive_[2]);
  assertEquals(1, this.activeEventCalled_);
  assertEquals(4, this.classNamesCount_);
  assertEquals(true, this.classNames_['ns-fontfamily1-n4-active']);
  assertEquals(true, this.classNames_['ns-fontfamily2-n4-active']);
  assertEquals(true, this.classNames_['ns-fontfamily3-n4-active']);
  assertEquals(true, this.classNames_['ns-active']);
};

FontWatcherTest.prototype.testWatchMultipleFontsWaitForLoadAndLastBatchOnDone =
    function() {
  var async = 0;
  var fontWatcher = new webfont.FontWatcher(this.fakeDomHelper_,
      this.eventDispatcher_, {

        font1Count_: 0,
        font2Count_: 0,
        font3Count_: 0,

        getWidth: function(element) {
          var fontFamily = element.style.fontFamily;
          var requestedFont = fontFamily.substring(0, fontFamily.indexOf(','));

          if (requestedFont.indexOf("DEFAULT_FONT") != -1) {
            return 1;
          } else if (requestedFont.indexOf("fontFamily1") != -1 &&
              this.font1Count_ != 2) {
            this.font1Count_++;
            return 1;
          } else if (requestedFont.indexOf("fontFamily2") != -1 &&
              this.font2Count_ != 1) {
            this.font2Count_++;
            return 1;
          } else if (requestedFont.indexOf("fontFamily3") != -1 &&
              this.font3Count_ != 5) {
            this.font3Count_++;
            return 1;
          } else {
            return 2;
	  }
        }
  }, function(func, timeout) {
    async++;
    func();
  }, function() { return 0; });
  var fontFamilies = [ 'fontFamily1', 'fontFamily2', 'fontFamily3' ];

  fontWatcher.watch(fontFamilies, {}, true);
  assertEquals(8, async);
  assertEquals(3, this.fontLoadingEventCalled_);
  assertEquals(3, this.fontLoading_.length);
  assertEquals('fontFamily1 n4', this.fontLoading_[0]);
  assertEquals('fontFamily2 n4', this.fontLoading_[1]);
  assertEquals('fontFamily3 n4', this.fontLoading_[2]);
  assertEquals(3, this.fontActiveEventCalled_);
  assertEquals(3, this.fontActive_.length);
  assertEquals('fontFamily1 n4', this.fontActive_[0]);
  assertEquals('fontFamily2 n4', this.fontActive_[1]);
  assertEquals('fontFamily3 n4', this.fontActive_[2]);
  assertEquals(1, this.activeEventCalled_);
  assertEquals(true, this.classNames_['ns-fontfamily1-n4-active']);
  assertEquals(true, this.classNames_['ns-fontfamily2-n4-active']);
  assertEquals(true, this.classNames_['ns-fontfamily3-n4-active']);
  assertEquals(true, this.classNames_['ns-active']);
  assertEquals(4, this.classNamesCount_);
};

FontWatcherTest.prototype
    .testWatchMultipleFontsWaitForLoadAndLastBatchOnDoneWithVariations =
    function() {
  var async = 0;
  var fontWatcher = new webfont.FontWatcher(this.fakeDomHelper_,
      this.eventDispatcher_, {

        font1Count_: 0,
        font2Count_: 0,
        font3Count_: 0,

        getWidth: function(element) {
          var fontFamily = element.style.fontFamily;
          var requestedFont = fontFamily.substring(0, fontFamily.indexOf(','));

          if (requestedFont.indexOf("DEFAULT_FONT") != -1) {
            return 1;
          } else if (requestedFont.indexOf("fontFamily1") != -1 &&
              this.font1Count_ != 2) {
            this.font1Count_++;
            return 1;
          } else if (requestedFont.indexOf("fontFamily2") != -1 &&
              this.font2Count_ != 1) {
            this.font2Count_++;
            return 1;
          } else if (requestedFont.indexOf("fontFamily3") != -1 &&
              this.font3Count_ != 5) {
            this.font3Count_++;
            return 1;
          } else {
            return 2;
	        }
        }
  }, function(func, timeout) {
    async++;
    func();
  }, function() { return 0; });
  var fontFamilies = [ 'fontFamily1', 'fontFamily2', 'fontFamily3' ];

  fontWatcher.watch(fontFamilies, {
      'fontFamily1': ['i7'],
      'fontFamily2': null,
      'fontFamily3': ['n4', 'i4', 'n7'] }, true);

  assertEquals(8, async);
  assertEquals(5, this.fontLoadingEventCalled_);
  assertEquals(5, this.fontLoading_.length);
  assertEquals('fontFamily1 i7',
      this.fontLoading_[0]);
  assertEquals('fontFamily2 n4', this.fontLoading_[1]);
  assertEquals('fontFamily3 n4',
      this.fontLoading_[2]);
  assertEquals('fontFamily3 i4', this.fontLoading_[3]);
  assertEquals('fontFamily3 n7', this.fontLoading_[4]);
  assertEquals(5, this.fontActiveEventCalled_);
  assertEquals(5, this.fontActive_.length);
  assertEquals('fontFamily1 i7',
      this.fontActive_[0]);
  assertEquals('fontFamily2 n4', this.fontActive_[1]);
  assertEquals('fontFamily3 n4',
      this.fontActive_[2]);
  assertEquals('fontFamily3 i4', this.fontActive_[3]);
  assertEquals('fontFamily3 n7', this.fontActive_[4]);
  assertEquals(1, this.activeEventCalled_);
  assertEquals(6, this.classNamesCount_);
  assertEquals(true, this.classNames_['ns-fontfamily1-i7-active']);
  assertEquals(true, this.classNames_['ns-fontfamily2-n4-active']);
  assertEquals(true, this.classNames_['ns-fontfamily3-n4-active']);
  assertEquals(true, this.classNames_['ns-fontfamily3-i4-active']);
  assertEquals(true, this.classNames_['ns-fontfamily3-n7-active']);
  assertEquals(true, this.classNames_['ns-active']);
};
