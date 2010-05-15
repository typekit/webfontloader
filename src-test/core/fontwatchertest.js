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
  this.familyLoadingEventCalled_ = 0;
  this.fontFamilyLoading_ = [];
  this.familyActiveEventCalled_ = 0;
  this.fontFamilyActive_ = [];
  this.familyInactvieEventCalled_ = 0;
  this.fontFamilyInactive_ = [];
  this.activeEventCalled_ = 0;

  var namespace = 'ns';

  this.callbacks_ = {
      loading: function() {
        self.loadingEventCalled_ = true;
      },
      active: function() {
        self.activeEventCalled_++;
      },
      familyloading: function(fontFamily) {
        self.familyLoadingEventCalled_++;
        self.fontFamilyLoading_.push(fontFamily);
      },
      familyactive: function(fontFamily) {
        self.familyActiveEventCalled_++;
        self.fontFamilyActive_.push(fontFamily);
      },
      familyinactive: function(fontFamily) {
        self.familyInactvieEventCalled_++;
        self.fontFamilyInactive_.push(fontFamily);
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

  fontWatcher.watch(fontFamilies, false);
  assertEquals(1, this.familyLoadingEventCalled_);
  assertEquals(1, this.fontFamilyLoading_.length);
  assertEquals('fontFamily1', this.fontFamilyLoading_[0]);
  assertEquals(1, this.familyActiveEventCalled_);
  assertEquals(1, this.fontFamilyActive_.length);
  assertEquals('fontFamily1', this.fontFamilyActive_[0]);
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

  fontWatcher.watch(fontFamilies, false);
  assertEquals(3, this.familyLoadingEventCalled_);
  assertEquals(3, this.fontFamilyLoading_.length);
  assertEquals('fontFamily1', this.fontFamilyLoading_[0]);
  assertEquals('fontFamily2', this.fontFamilyLoading_[1]);
  assertEquals('fontFamily3', this.fontFamilyLoading_[2]);
  assertEquals(3, this.familyActiveEventCalled_);
  assertEquals(3, this.fontFamilyActive_.length);
  assertEquals('fontFamily1', this.fontFamilyActive_[0]);
  assertEquals('fontFamily2', this.fontFamilyActive_[1]);
  assertEquals('fontFamily3', this.fontFamilyActive_[2]);
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

  fontWatcher.watch(fontFamilies, false);
  assertTrue(async);
  assertEquals(1, this.familyLoadingEventCalled_);
  assertEquals(1, this.fontFamilyLoading_.length);
  assertEquals('fontFamily1', this.fontFamilyLoading_[0]);
  assertEquals(1, this.familyActiveEventCalled_);
  assertEquals(1, this.fontFamilyActive_.length);
  assertEquals('fontFamily1', this.fontFamilyActive_[0]);
};

FontWatcherTest.prototype.testWatchMultipleFontsWaitForLoad = function() {
  var async = 0;
  var fontWatcher = new webfont.FontWatcher(this.fakeDomHelper_,
      this.eventDispatcher_, {

        fontFamily1Count_: 0,
        fontFamily2Count_: 0,
        fontFamily3Count_: 0,

        getWidth: function(element) {
          var fontFamily = element.style.fontFamily;
          var requestedFont = fontFamily.substring(0, fontFamily.indexOf(','));

          if (requestedFont.indexOf("DEFAULT_FONT") != -1) {
            return 1;
          } else if (requestedFont.indexOf("fontFamily1") != -1 &&
              this.fontFamily1Count_ != 2) {
            this.fontFamily1Count_++;
            return 1;
          } else if (requestedFont.indexOf("fontFamily2") != -1 &&
              this.fontFamily2Count_ != 1) {
            this.fontFamily2Count_++;
            return 1;
          } else if (requestedFont.indexOf("fontFamily3") != -1 &&
              this.fontFamily3Count_ != 5) {
            this.fontFamily3Count_++;
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

  fontWatcher.watch(fontFamilies, false);
  assertEquals(8, async);
  assertEquals(3, this.familyLoadingEventCalled_);
  assertEquals(3, this.fontFamilyLoading_.length);
  assertEquals('fontFamily1', this.fontFamilyLoading_[0]);
  assertEquals('fontFamily2', this.fontFamilyLoading_[1]);
  assertEquals('fontFamily3', this.fontFamilyLoading_[2]);
  assertEquals(3, this.familyActiveEventCalled_);
  assertEquals(3, this.fontFamilyActive_.length);
  assertEquals('fontFamily1', this.fontFamilyActive_[0]);
  assertEquals('fontFamily2', this.fontFamilyActive_[1]);
  assertEquals('fontFamily3', this.fontFamilyActive_[2]);
};

FontWatcherTest.prototype.testWatchMultipleFontsWaitForLoadAndLoaded =
    function() {
  var async = 0;
  var fontWatcher = new webfont.FontWatcher(this.fakeDomHelper_,
      this.eventDispatcher_, {

        fontFamily1Count_: 0,
        fontFamily3Count_: 0,

        getWidth: function(element) {
          var fontFamily = element.style.fontFamily;
          var requestedFont = fontFamily.substring(0, fontFamily.indexOf(','));

          if (requestedFont.indexOf("DEFAULT_FONT") != -1) {
            return 1;
          } else if (requestedFont.indexOf("fontFamily1") != -1 &&
              this.fontFamily1Count_ != 2) {
            this.fontFamily1Count_++;
            return 1;
          } else if (requestedFont.indexOf("fontFamily3") != -1 &&
              this.fontFamily3Count_ != 5) {
            this.fontFamily3Count_++;
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

  fontWatcher.watch(fontFamilies, false);
  assertEquals(7, async);
  assertEquals(3, this.familyLoadingEventCalled_);
  assertEquals(3, this.fontFamilyLoading_.length);
  assertEquals('fontFamily1', this.fontFamilyLoading_[0]);
  assertEquals('fontFamily2', this.fontFamilyLoading_[1]);
  assertEquals('fontFamily3', this.fontFamilyLoading_[2]);
  assertEquals(3, this.familyActiveEventCalled_);
  assertEquals(3, this.fontFamilyActive_.length);
  assertEquals('fontFamily1', this.fontFamilyActive_[0]);
  assertEquals('fontFamily2', this.fontFamilyActive_[1]);
  assertEquals('fontFamily3', this.fontFamilyActive_[2]);
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

  fontWatcher.watch(fontFamilies, false);
  assertEquals(1, this.familyLoadingEventCalled_);
  assertEquals(1, this.fontFamilyLoading_.length);
  assertEquals('fontFamily1', this.fontFamilyLoading_[0]);
  assertEquals(1, this.familyInactvieEventCalled_);
  assertEquals(1, this.fontFamilyInactive_.length);
  assertEquals('fontFamily1', this.fontFamilyInactive_[0]);
};

FontWatcherTest.prototype.testWatchMultipleFontsWaitForLoadAndInactive =
    function() {
  var count = 0;
  var async = 0;
  var fontWatcher = new webfont.FontWatcher(this.fakeDomHelper_,
      this.eventDispatcher_, {

        fontFamily1Count_: 0,
        fontFamily3Count_: 0,

        getWidth: function(element) {
          var fontFamily = element.style.fontFamily;
          var requestedFont = fontFamily.substring(0, fontFamily.indexOf(','));

          if (requestedFont.indexOf("DEFAULT_FONT") != -1) {
            return 1;
          } else if (requestedFont.indexOf("fontFamily1") != -1 &&
              this.fontFamily1Count_ != 2) {
            this.fontFamily1Count_++;
            return 1;
          } else if (requestedFont.indexOf("fontFamily2") != -1) {
            return 1;
          } else if (requestedFont.indexOf("fontFamily3") != -1 &&
              this.fontFamily3Count_ != 5) {
            this.fontFamily3Count_++;
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

  fontWatcher.watch(fontFamilies, false);
  assertEquals(9, async);
  assertEquals(3, this.familyLoadingEventCalled_);
  assertEquals(3, this.fontFamilyLoading_.length);
  assertEquals('fontFamily1', this.fontFamilyLoading_[0]);
  assertEquals('fontFamily2', this.fontFamilyLoading_[1]);
  assertEquals('fontFamily3', this.fontFamilyLoading_[2]);
  assertEquals(2, this.familyActiveEventCalled_);
  assertEquals(2, this.fontFamilyActive_.length);
  assertEquals('fontFamily1', this.fontFamilyActive_[0]);
  assertEquals('fontFamily3', this.fontFamilyActive_[1]);
  assertEquals(1, this.familyInactvieEventCalled_);
  assertEquals('fontFamily2', this.fontFamilyInactive_[0]);
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

  fontWatcher.watch(fontFamilies, true);
  assertEquals(3, this.familyLoadingEventCalled_);
  assertEquals(3, this.fontFamilyLoading_.length);
  assertEquals('fontFamily1', this.fontFamilyLoading_[0]);
  assertEquals('fontFamily2', this.fontFamilyLoading_[1]);
  assertEquals('fontFamily3', this.fontFamilyLoading_[2]);
  assertEquals(3, this.familyActiveEventCalled_);
  assertEquals(3, this.fontFamilyActive_.length);
  assertEquals('fontFamily1', this.fontFamilyActive_[0]);
  assertEquals('fontFamily2', this.fontFamilyActive_[1]);
  assertEquals('fontFamily3', this.fontFamilyActive_[2]);
  assertEquals(1, this.activeEventCalled_);
  assertEquals(true, this.classNames_['ns-fontfamily1-active']);
  assertEquals(true, this.classNames_['ns-fontfamily2-active']);
  assertEquals(true, this.classNames_['ns-fontfamily3-active']);
  assertEquals(true, this.classNames_['ns-active']);
  assertEquals(4, this.classNamesCount_);
};

FontWatcherTest.prototype.testWatchMultipleFontsWaitForLoadAndLastBatchOnDone =
    function() {
  var async = 0;
  var fontWatcher = new webfont.FontWatcher(this.fakeDomHelper_,
      this.eventDispatcher_, {

        fontFamily1Count_: 0,
        fontFamily2Count_: 0,
        fontFamily3Count_: 0,

        getWidth: function(element) {
          var fontFamily = element.style.fontFamily;
          var requestedFont = fontFamily.substring(0, fontFamily.indexOf(','));

          if (requestedFont.indexOf("DEFAULT_FONT") != -1) {
            return 1;
          } else if (requestedFont.indexOf("fontFamily1") != -1 &&
              this.fontFamily1Count_ != 2) {
            this.fontFamily1Count_++;
            return 1;
          } else if (requestedFont.indexOf("fontFamily2") != -1 &&
              this.fontFamily2Count_ != 1) {
            this.fontFamily2Count_++;
            return 1;
          } else if (requestedFont.indexOf("fontFamily3") != -1 &&
              this.fontFamily3Count_ != 5) {
            this.fontFamily3Count_++;
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

  fontWatcher.watch(fontFamilies, true);
  assertEquals(8, async);
  assertEquals(3, this.familyLoadingEventCalled_);
  assertEquals(3, this.fontFamilyLoading_.length);
  assertEquals('fontFamily1', this.fontFamilyLoading_[0]);
  assertEquals('fontFamily2', this.fontFamilyLoading_[1]);
  assertEquals('fontFamily3', this.fontFamilyLoading_[2]);
  assertEquals(3, this.familyActiveEventCalled_);
  assertEquals(3, this.fontFamilyActive_.length);
  assertEquals('fontFamily1', this.fontFamilyActive_[0]);
  assertEquals('fontFamily2', this.fontFamilyActive_[1]);
  assertEquals('fontFamily3', this.fontFamilyActive_[2]);
  assertEquals(1, this.activeEventCalled_);
  assertEquals(true, this.classNames_['ns-fontfamily1-active']);
  assertEquals(true, this.classNames_['ns-fontfamily2-active']);
  assertEquals(true, this.classNames_['ns-fontfamily3-active']);
  assertEquals(true, this.classNames_['ns-active']);
  assertEquals(4, this.classNamesCount_);
};

FontWatcherTest.prototype
    .testWatchMultipleFontsWaitForLoadAndLastBatchOnDoneWithVariations =
    function() {
  var async = 0;
  var fontWatcher = new webfont.FontWatcher(this.fakeDomHelper_,
      this.eventDispatcher_, {

        fontFamily1Count_: 0,
        fontFamily2Count_: 0,
        fontFamily3Count_: 0,

        getWidth: function(element) {
          var fontFamily = element.style.fontFamily;
          var requestedFont = fontFamily.substring(0, fontFamily.indexOf(','));

          if (requestedFont.indexOf("DEFAULT_FONT") != -1) {
            return 1;
          } else if (requestedFont.indexOf("fontFamily1") != -1 &&
              this.fontFamily1Count_ != 2) {
            this.fontFamily1Count_++;
            return 1;
          } else if (requestedFont.indexOf("fontFamily2") != -1 &&
              this.fontFamily2Count_ != 1) {
            this.fontFamily2Count_++;
            return 1;
          } else if (requestedFont.indexOf("fontFamily3") != -1 &&
              this.fontFamily3Count_ != 5) {
            this.fontFamily3Count_++;
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

  fontWatcher.watch(fontFamilies, true, { 'fontFamily1': [ 'font-style: italic;font-weight: bold' ],
      'fontFamily2': null,
      'fontFamily3': [ 'font-style: normal;font-weight: normal',
          'font-style: italic', 'font-weight: bold' ]},
          function(family, variation) {
            return family + ' (' + variation + ')';
          });
  assertEquals(8, async);
  assertEquals(5, this.familyLoadingEventCalled_);
  assertEquals(5, this.fontFamilyLoading_.length);
  assertEquals('fontFamily1 (font-style: italic;font-weight: bold)',
      this.fontFamilyLoading_[0]);
  assertEquals('fontFamily2', this.fontFamilyLoading_[1]);
  assertEquals('fontFamily3 (font-style: normal;font-weight: normal)',
      this.fontFamilyLoading_[2]);
  assertEquals('fontFamily3 (font-style: italic)', this.fontFamilyLoading_[3]);
  assertEquals('fontFamily3 (font-weight: bold)', this.fontFamilyLoading_[4]);
  assertEquals(5, this.familyActiveEventCalled_);
  assertEquals(5, this.fontFamilyActive_.length);
  assertEquals('fontFamily1 (font-style: italic;font-weight: bold)',
      this.fontFamilyActive_[0]);
  assertEquals('fontFamily2', this.fontFamilyActive_[1]);
  assertEquals('fontFamily3 (font-style: normal;font-weight: normal)',
      this.fontFamilyActive_[2]);
  assertEquals('fontFamily3 (font-style: italic)', this.fontFamilyActive_[3]);
  assertEquals('fontFamily3 (font-weight: bold)', this.fontFamilyActive_[4]);
  assertEquals(1, this.activeEventCalled_);
  assertEquals(6, this.classNamesCount_);
  assertEquals(true, this.classNames_[
      'ns-fontfamily1fontstyleitalicfontweightbold-active']);
  assertEquals(true, this.classNames_['ns-fontfamily2-active']);
  assertEquals(true, this.classNames_[
      'ns-fontfamily3fontstylenormalfontweightnormal-active']);
  assertEquals(true, this.classNames_['ns-fontfamily3fontstyleitalic-active']);
  assertEquals(true, this.classNames_['ns-fontfamily3fontweightbold-active']);
  assertEquals(true, this.classNames_['ns-active']);
};
