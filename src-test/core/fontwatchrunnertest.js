var FontWatchRunnerTest = TestCase('FontWatchRunnerTest');

FontWatchRunnerTest.prototype.setUp = function() {
  var self = this;

  this.fontFamily_ = 'fontFamily1';
  this.fontDescription_ = 'n4';

  this.fontActiveCalled_ = 0;
  this.fontActive_ = {};
  this.fontInactiveCalled_ = 0;
  this.fontInactive_ = {};
  this.activeCallback_ = function(fontFamily, fontDescription) {
    self.fontActiveCalled_++;
    self.fontActive_[fontFamily + ' ' + fontDescription] = true;
  };
  this.inactiveCallback_ = function(fontFamily, fontDescription) {
    self.fontInactiveCalled_++;
    self.fontInactive_[fontFamily + ' ' + fontDescription] = true;
  };

  this.createElementCalled_ = 0;
  this.createdElements_ = [];
  this.insertIntoCalled_ = 0;
  this.removeElementCalled_ = 0;
  this.fakeDomHelper_ = {
    createElement: function(name, attrs, innerHtml) {
      self.createElementCalled_++;
      var element = document.createElement(name);
      self.createdElements_.push({
        'name': name,
        'attrs': attrs,
        'innerHtml': innerHtml,
        'element': element
      });

      for (var attr in attrs) {
        element.setAttribute(attr, attrs[attr]);
      }
      element.innerHTML = innerHtml;
      return element;
    },
    insertInto: function(name, el) {
      self.insertIntoCalled_++;
    },
    removeElement: function(el) {
      self.removeElementCalled_++;
    },
    setStyle: function(el, style) {
      el.setAttribute('style', style);
      for (var i = 0; i < self.createdElements_.length; i += 1) {
        if (self.createdElements_[i].element === el) {
          if (!self.createdElements_[i].attrs) {
            self.createdElements_[i].attrs = {};
          }
          self.createdElements_[i].attrs.style = style;
          break;
        }
      }
    }
  };

  this.timesToCheckSizesBeforeChange_ = 0;
  this.fakeFontSizer_ = {
    getSize: function(el) {
      if (el.style.fontFamily.indexOf(self.fontFamily_) != -1) {
        // This is a font stack with fontFamily included (not just fallbacks)
        if (self.timesToCheckSizesBeforeChange_ <= 0) {
          // Decrement by 0.5 because we're checking two separate font stacks each iteration
          self.timesToCheckSizesBeforeChange_ -= 0.5;
          return new webfont.Size(2, 2);
        } else {
          // Decrement by 0.5 because we're checking two separate font stacks each iteration
          self.timesToCheckSizesBeforeChange_ -= 0.5;
          return new webfont.Size(1, 1);
        }
      } else {
        return new webfont.Size(1, 1);
      }
    }
  };

  this.fakeFontSizerWithDifferentHeight_ = {
    getSize: function(el) {
      if (el.style.fontFamily.indexOf(self.fontFamily_) != -1) {
        if (self.timesToCheckSizesBeforeChange_ <= 0) {
          self.timesToCheckSizesBeforeChange_ -= 0.5;
          return new webfont.Size(1, 2);
        } else {
          self.timesToCheckSizesBeforeChange_ -= 0.5;
          return new webfont.Size(1, 1);
        }
      } else {
        return new webfont.Size(1, 1);
      }
    }
  };

  /**
   * This accurately models the way webkit used to handle
   * fallback fonts while loading web fonts. Even though
   * this Webkit bug is now patched, we still have a large
   * portion of our users using old webkit builds.
   *
   * See: https://bugs.webkit.org/show_bug.cgi?id=76684
   */
  this.timesToDelayChangedSizeWebkit_ = 1;
  this.firstCallToRetrieveSizeWebkit_ = true;
  this.fakeWebkitFontSizer_ = {
    getSize: function(el) {
      if (el.style.fontFamily.indexOf(self.fontFamily_) !== -1) {
        if (self.timesToDelayChangedSizeWebkit_ > 0) {
          self.timesToDelayChangedSizeWebkit_ -= 0.5;
          // Return the incorrect width for a certain number of cycles.
          // The actual number depends on how fast or how slow the font
          // is parsed and applied.
          return new webfont.Size(2, 2);
        } else {
          // Return the correct width
          return new webfont.Size(3, 3);
        }
      } else {
        if (self.firstCallToRetrieveSizeWebkit_) {
          self.firstCallToRetrieveSizeWebkit_ = false;
          return new webfont.Size(2, 2);
        } else {
          // Return the default width
          return new webfont.Size(1, 1);
        }
      }
    }
  };

  this.fakeWebkitFontSizerFailedLoad_ = {
    getSize: function(el) {
      if (el.style.fontFamily.indexOf(self.fontFamily_) !== -1) {
        if (self.timesToDelayChangedSizeWebkit_ > 0) {
          self.timesToDelayChangedSizeWebkit_ -= 0.5;
          return new webfont.Size(2, 2);
        } else {
          // Return the original width, indicating the font
          // failed to load. This should incorrectly trigger `inactive`.
          return new webfont.Size(1, 1);
        }
      } else {
        if (self.firstCallToRetrieveSizeWebkit_) {
          self.firstCallToRetrieveSizeWebkit_ = false;
          return new webfont.Size(2, 2);
        } else {
          return new webfont.Size(1, 1);
        }
      }
    }
  };

  this.fakeWebkitFontSizerWithEqualMetrics_ = {
    getSize: function(el) {
      if (el.style.fontFamily.indexOf(self.fontFamily_) !== -1) {
        if (self.timesToDelayChangedSizeWebkit_ > 0) {
          self.timesToDelayChangedSizeWebkit_ -= 0.5;
          return new webfont.Size(2, 2);
        } else {
          // This time the fallback font picked by Webkit has the
          // same metrics as the font being loaded. This is a rare
          // case but we should be able to handle it.
          return new webfont.Size(2, 2);
        }
      } else {
        if (self.firstCallToRetrieveSizeWebkit_) {
          self.firstCallToRetrieveSizeWebkit_ = false;
          return new webfont.Size(2, 2);
        } else {
          return new webfont.Size(1, 1);
        }
      }
    }
  };

  this.fakeWebkitFontSizeWithDifferentMetrics_ = {
    getSize: function(el) {
      if (el.style.fontFamily.indexOf(self.fontFamily_) !== -1) {
        if (self.timesToDelayChangedSizeWebkit_ > 0) {
          self.timesToDelayChangedSizeWebkit_ -= 0.5;
          return new webfont.Size(2, 2);
        } else {
          // Even though the width is the same, the height
          // is different, so this should trigger the active event.
          return new webfont.Size(2, 3);
        }
      } else {
        if (self.firstCallToRetrieveSizeWebkit_) {
          self.firstCallToRetrieveSizeWebkit_ = false;
          return new webfont.Size(2, 2);
        } else {
          return new webfont.Size(1, 1);
        }
      }
    }
  };

  this.timesToGetTimeBeforeTimeout_ = 10;
  this.fakeGetTime_ = function() {
    if (self.timesToGetTimeBeforeTimeout_ <= 0) {
      return 6000;
    } else {
      self.timesToGetTimeBeforeTimeout_--;
      return 1;
    }
  };

  this.asyncCount_ = 0;
  this.fakeAsyncCall_ = function(func, timeout) {
    self.asyncCount_++;
    func();
  };

};

FontWatchRunnerTest.prototype.testWatchFontAlreadyLoaded = function() {
  this.timesToCheckSizesBeforeChange_ = 0;
  this.timesToGetTimeBeforeTimeout_ = 10;

  var fontWatchRunner = new webfont.FontWatchRunner(this.activeCallback_,
      this.inactiveCallback_, this.fakeDomHelper_, this.fakeFontSizer_,
      this.fakeAsyncCall_, this.fakeGetTime_, this.fontFamily_,
      this.fontDescription_, false);

  fontWatchRunner.start();

  assertEquals(0, this.asyncCount_);

  assertEquals(1, this.fontActiveCalled_);
  assertEquals(true, this.fontActive_['fontFamily1 n4']);
  assertEquals(0, this.fontInactiveCalled_);
};

FontWatchRunnerTest.prototype.testWatchFontWaitForLoadActive = function() {
  this.timesToCheckSizesBeforeChange_ = 3;
  this.timesToGetTimeBeforeTimeout_ = 10;

  var fontWatchRunner = new webfont.FontWatchRunner(this.activeCallback_,
      this.inactiveCallback_, this.fakeDomHelper_, this.fakeFontSizer_,
      this.fakeAsyncCall_, this.fakeGetTime_, this.fontFamily_,
      this.fontDescription_, false);

  fontWatchRunner.start();

  assertEquals(3, this.asyncCount_);

  assertEquals(1, this.fontActiveCalled_);
  assertEquals(true, this.fontActive_['fontFamily1 n4']);
  assertEquals(0, this.fontInactiveCalled_);
};

FontWatchRunnerTest.prototype.testWatchFontWaitForLoadActiveWithDifferentHeight = function() {
  this.timesToCheckSizesBeforeChange_ = 3;
  this.timesToGetTimeBeforeTimeout_ = 10;

  var fontWatchRunner = new webfont.FontWatchRunner(this.activeCallback_,
      this.inactiveCallback_, this.fakeDomHelper_, this.fakeFontSizerWithDifferentHeight_,
      this.fakeAsyncCall_, this.fakeGetTime_, this.fontFamily_,
      this.fontDescription_, false);

  fontWatchRunner.start();

  assertEquals(3, this.asyncCount_);

  assertEquals(1, this.fontActiveCalled_);
  assertEquals(true, this.fontActive_['fontFamily1 n4']);
  assertEquals(0, this.fontInactiveCalled_);
};

FontWatchRunnerTest.prototype.testWatchFontWaitForLoadInactive = function() {
  this.timesToCheckSizesBeforeChange_ = 10;
  this.timesToGetTimeBeforeTimeout_ = 5;

  var fontWatchRunner = new webfont.FontWatchRunner(this.activeCallback_,
      this.inactiveCallback_, this.fakeDomHelper_, this.fakeFontSizer_,
      this.fakeAsyncCall_, this.fakeGetTime_, this.fontFamily_,
      this.fontDescription_, false);

  fontWatchRunner.start();

  assertEquals(4, this.asyncCount_);

  assertEquals(0, this.fontActiveCalled_);
  assertEquals(1, this.fontInactiveCalled_);
  assertEquals(true, this.fontInactive_['fontFamily1 n4']);
};

FontWatchRunnerTest.prototype.testWatchFontWebkitWithFastFont = function() {
  this.timesToGetTimeBeforeTimeout_ = 10;
  this.timesToDelayChangedSizeWebkit_ = 1;
  this.firstCallToRetrieveSizeWebkit_ = true;

  var fontWatchRunner = new webfont.FontWatchRunner(this.activeCallback_,
      this.inactiveCallback_, this.fakeDomHelper_, this.fakeWebkitFontSizer_,
      this.fakeAsyncCall_, this.fakeGetTime_, this.fontFamily_,
      this.fontDescription_, true);

  fontWatchRunner.start();
  assertEquals(1, this.asyncCount_);
  assertEquals(1, this.fontActiveCalled_);
  assertEquals(true, this.fontActive_['fontFamily1 n4']);
};

FontWatchRunnerTest.prototype.testWatchFontWebkitWithSlowFont = function() {
  this.timesToGetTimeBeforeTimeout_ = 10;
  this.timesToDelayChangedSizeWebkit_ = 2;
  this.firstCallToRetrieveSizeWebkit_ = true;

  var fontWatchRunner = new webfont.FontWatchRunner(this.activeCallback_,
      this.inactiveCallback_, this.fakeDomHelper_, this.fakeWebkitFontSizer_,
      this.fakeAsyncCall_, this.fakeGetTime_, this.fontFamily_,
      this.fontDescription_, true);

  fontWatchRunner.start();
  assertEquals(2, this.asyncCount_);
  assertEquals(1, this.fontActiveCalled_);
  assertEquals(true, this.fontActive_['fontFamily1 n4']);
};

FontWatchRunnerTest.prototype.testWatchFontWebkitWithEqualMetrics = function() {
  this.timesToGetTimeBeforeTimeout_ = 10;
  this.timesToDelayChangedSizeWebkit_ = 2;
  this.firstCallToRetrieveSizeWebkit_ = true;

  var fontWatchRunner = new webfont.FontWatchRunner(this.activeCallback_,
      this.inactiveCallback_, this.fakeDomHelper_, this.fakeWebkitFontSizerWithEqualMetrics_,
      this.fakeAsyncCall_, this.fakeGetTime_, this.fontFamily_,
      this.fontDescription_, true);

  fontWatchRunner.start();
  assertEquals(9, this.asyncCount_);
  assertEquals(1, this.fontActiveCalled_);
  assertEquals(true, this.fontActive_['fontFamily1 n4']);
};

FontWatchRunnerTest.prototype.testWatchFontWebkitWithDifferentMetrics = function() {
  this.timesToGetTimeBeforeTimeout_ = 10;
  this.timesToDelayChangedSizeWebkit_ = 2;
  this.firstCallToRetrieveSizeWebkit_ = true;

  var fontWatchRunner = new webfont.FontWatchRunner(this.activeCallback_,
      this.inactiveCallback_, this.fakeDomHelper_, this.fakeWebkitFontSizeWithDifferentMetrics_,
      this.fakeAsyncCall_, this.fakeGetTime_, this.fontFamily_,
      this.fontDescription_, true);

  fontWatchRunner.start();
  assertEquals(2, this.asyncCount_);
  assertEquals(1, this.fontActiveCalled_);
  assertEquals(true, this.fontActive_['fontFamily1 n4']);
};

FontWatchRunnerTest.prototype.testWatchFontWebkitFailedLoad = function() {
  this.timesToGetTimeBeforeTimeout_ = 10;
  this.timesToDelayChangedSizeWebkit_ = 5;
  this.firstCallToRetrieveSizeWebkit_ = true;

  var fontWatchRunner = new webfont.FontWatchRunner(this.activeCallback_,
      this.inactiveCallback_, this.fakeDomHelper_, this.fakeWebkitFontSizerFailedLoad_,
      this.fakeAsyncCall_, this.fakeGetTime_, this.fontFamily_,
      this.fontDescription_, true);

  fontWatchRunner.start();
  assertEquals(9, this.asyncCount_);
  assertEquals(1, this.fontActiveCalled_);
  assertEquals(true, this.fontActive_['fontFamily1 n4']);
};

FontWatchRunnerTest.prototype.testWatchFontWebkitWithEqualMetricsIncompatibleFont = function() {
  this.timesToGetTimeBeforeTimeout_ = 10;
  this.timesToDelayChangedSizeWebkit_ = 2;
  this.firstCallToRetrieveSizeWebkit_ = true;

  var fontWatchRunner = new webfont.FontWatchRunner(this.activeCallback_,
      this.inactiveCallback_, this.fakeDomHelper_, this.fakeWebkitFontSizerWithEqualMetrics_,
      this.fakeAsyncCall_, this.fakeGetTime_, this.fontFamily_,
      this.fontDescription_, true, { 'fontFamily2': true });

  fontWatchRunner.start();
  assertEquals(9, this.asyncCount_);
  assertEquals(1, this.fontInactiveCalled_);
  assertEquals(true, this.fontInactive_['fontFamily1 n4']);
};

FontWatchRunnerTest.prototype.testWatchFontWebkitWithEqualMetricsCompatibleFont = function() {
  this.timesToGetTimeBeforeTimeout_ = 10;
  this.timesToDelayChangedSizeWebkit_ = 2;
  this.firstCallToRetrieveSizeWebkit_ = true;

  var fontWatchRunner = new webfont.FontWatchRunner(this.activeCallback_,
      this.inactiveCallback_, this.fakeDomHelper_, this.fakeWebkitFontSizerWithEqualMetrics_,
      this.fakeAsyncCall_, this.fakeGetTime_, this.fontFamily_,
      this.fontDescription_, true, { 'fontFamily1': true });

  fontWatchRunner.start();
  assertEquals(9, this.asyncCount_);
  assertEquals(1, this.fontActiveCalled_);
  assertEquals(true, this.fontActive_['fontFamily1 n4']);
};


FontWatchRunnerTest.prototype.testDomWithDefaultTestString = function() {
  this.timesToCheckSizesBeforeChange_ = 3;
  this.timesToGetTimeBeforeTimeout_ = 10;

  var fontWatchRunner = new webfont.FontWatchRunner(this.activeCallback_,
      this.inactiveCallback_, this.fakeDomHelper_, this.fakeFontSizer_,
      this.fakeAsyncCall_, this.fakeGetTime_, this.fontFamily_,
      this.fontDescription_, false);

  fontWatchRunner.start();
  assertEquals(3, this.createElementCalled_);
  assertEquals('span', this.createdElements_[0]['name']);
  assertNotEquals(-1, this.createdElements_[0]['attrs']['style'].indexOf('fontFamily1'));
  assertNotEquals(-1, this.createdElements_[0]['attrs']['style'].indexOf(webfont.FontWatchRunner.LastResortFonts.SERIF));
  assertEquals('BESbswy', this.createdElements_[0]['innerHtml']);

  assertEquals('span', this.createdElements_[1]['name']);
  assertNotEquals(-1, this.createdElements_[1]['attrs']['style'].indexOf('fontFamily1'));
  assertNotEquals(-1, this.createdElements_[1]['attrs']['style'].indexOf(webfont.FontWatchRunner.LastResortFonts.SANS_SERIF));
  assertEquals('BESbswy', this.createdElements_[1]['innerHtml']);

  assertEquals(3, this.insertIntoCalled_);
  assertEquals(3, this.removeElementCalled_);
};

FontWatchRunnerTest.prototype.testDomWithNotDefaultTestString = function() {
  this.timesToCheckSizesBeforeChange_ = 3;
  this.timesToGetTimeBeforeTimeout_ = 10;

  var fontWatchRunner = new webfont.FontWatchRunner(this.activeCallback_,
      this.inactiveCallback_, this.fakeDomHelper_, this.fakeFontSizer_,
      this.fakeAsyncCall_, this.fakeGetTime_, this.fontFamily_,
      this.fontDescription_, false, null, 'testString');

  fontWatchRunner.start();

  assertEquals(3, this.createElementCalled_);
  assertEquals('span', this.createdElements_[0]['name']);
  assertNotEquals(-1, this.createdElements_[0]['attrs']['style'].indexOf('fontFamily1'));
  assertNotEquals(-1, this.createdElements_[0]['attrs']['style'].indexOf(webfont.FontWatchRunner.LastResortFonts.SERIF));
  assertEquals('testString', this.createdElements_[0]['innerHtml']);

  assertEquals('span', this.createdElements_[1]['name']);
  assertNotEquals(-1, this.createdElements_[1]['attrs']['style'].indexOf('fontFamily1'));
  assertNotEquals(-1, this.createdElements_[1]['attrs']['style'].indexOf(webfont.FontWatchRunner.LastResortFonts.SANS_SERIF));
  assertEquals('testString', this.createdElements_[1]['innerHtml']);

  assertEquals(3, this.insertIntoCalled_);
  assertEquals(3, this.removeElementCalled_);

};
