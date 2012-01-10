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
      self.createdElements_.push({
        'name': name,
        'attrs': attrs,
        'innerHtml': innerHtml
      });

      var element = document.createElement(name);

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
    }
  };

  this.timesToCheckWidthsBeforeChange_ = 0;
  this.timesToReportChangedWidth_ = 2;
  this.fakeFontSizer_ = {
    getWidth: function(el) {
      if (el.style.fontFamily.indexOf(self.fontFamily_) != -1) {
        // This is a font stack with fontFamily included (not just fallbacks)
        if (self.timesToCheckWidthsBeforeChange_ <= 0 && self.timesToReportChangedWidth_ > 0) {
          // Decrement by 0.5 because we're checking two separate font stacks each iteration
          self.timesToReportChangedWidth_ -= 0.5;
          return 2;
        } else {
          // Decrement by 0.5 because we're checking two separate font stacks each iteration
          self.timesToCheckWidthsBeforeChange_ -= 0.5;
          return 1;
        }
      } else {
        return 1;
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
  this.timesToCheckWidthsBeforeChange_ = 0;
  this.timesToReportChangedWidth_ = 2;
  this.timesToGetTimeBeforeTimeout_ = 10;

  var fontWatchRunner = new webfont.FontWatchRunner(this.activeCallback_,
      this.inactiveCallback_, this.fakeDomHelper_, this.fakeFontSizer_,
      this.fakeAsyncCall_, this.fakeGetTime_, this.fontFamily_,
      this.fontDescription_);

  fontWatchRunner.start();

  assertEquals(1, this.asyncCount_);

  assertEquals(1, this.fontActiveCalled_);
  assertEquals(true, this.fontActive_['fontFamily1 n4']);
  assertEquals(0, this.fontInactiveCalled_);
};

FontWatchRunnerTest.prototype.testWatchFontWaitForLoadActive = function() {
  this.timesToCheckWidthsBeforeChange_ = 3;
  this.timesToReportChangedWidth_ = 2;
  this.timesToGetTimeBeforeTimeout_ = 10;

  var fontWatchRunner = new webfont.FontWatchRunner(this.activeCallback_,
      this.inactiveCallback_, this.fakeDomHelper_, this.fakeFontSizer_,
      this.fakeAsyncCall_, this.fakeGetTime_, this.fontFamily_,
      this.fontDescription_);

  fontWatchRunner.start();

  assertEquals(4, this.asyncCount_);

  assertEquals(1, this.fontActiveCalled_);
  assertEquals(true, this.fontActive_['fontFamily1 n4']);
  assertEquals(0, this.fontInactiveCalled_);
};

FontWatchRunnerTest.prototype.testWatchFontWaitForLoadInactive = function() {
  this.timesToCheckWidthsBeforeChange_ = 10;
  this.timesToReportChangedWidth_ = 2;
  this.timesToGetTimeBeforeTimeout_ = 5;

  var fontWatchRunner = new webfont.FontWatchRunner(this.activeCallback_,
      this.inactiveCallback_, this.fakeDomHelper_, this.fakeFontSizer_,
      this.fakeAsyncCall_, this.fakeGetTime_, this.fontFamily_,
      this.fontDescription_);

  fontWatchRunner.start();

  assertEquals(4, this.asyncCount_);

  assertEquals(0, this.fontActiveCalled_);
  assertEquals(1, this.fontInactiveCalled_);
  assertEquals(true, this.fontInactive_['fontFamily1 n4']);
};

/**
 * This test ensures that even if the fonts change width for one cycle and
 * then change back, active won't be fired. This works around an issue in Webkit
 * browsers, where an inactive webfont will briefly change widths for one cycle
 * and then change back to fallback widths on the next cycle. This is apparently
 * due to some quirk in the way that web fonts are rendered.
 */
FontWatchRunnerTest.prototype.testWatchFontWithInconsistentWidthIsStillInactive = function() {
  this.timesToCheckWidthsBeforeChange_ = 3;
  // Only report a new width for one cycle, then switch back to original fallback width
  this.timesToReportChangedWidth_ = 1;
  this.timesToGetTimeBeforeTimeout_ = 10;

  var fontWatchRunner = new webfont.FontWatchRunner(this.activeCallback_,
      this.inactiveCallback_, this.fakeDomHelper_, this.fakeFontSizer_,
      this.fakeAsyncCall_, this.fakeGetTime_, this.fontFamily_,
      this.fontDescription_);

  fontWatchRunner.start();

  assertEquals(9, this.asyncCount_);

  assertEquals(0, this.fontActiveCalled_);
  assertEquals(1, this.fontInactiveCalled_);
  assertEquals(true, this.fontInactive_['fontFamily1 n4']);
};

FontWatchRunnerTest.prototype.testDomWithDefaultTestString = function() {
  this.timesToCheckWidthsBeforeChange_ = 3;
  this.timesToReportChangedWidth_ = 2;
  this.timesToGetTimeBeforeTimeout_ = 10;

  var fontWatchRunner = new webfont.FontWatchRunner(this.activeCallback_,
      this.inactiveCallback_, this.fakeDomHelper_, this.fakeFontSizer_,
      this.fakeAsyncCall_, this.fakeGetTime_, this.fontFamily_,
      this.fontDescription_);

  fontWatchRunner.start();

  assertEquals(4, this.createElementCalled_);
  assertEquals('span', this.createdElements_[0]['name']);
  assertEquals(-1, this.createdElements_[0]['attrs']['style'].indexOf('fontFamily1'));
  assertNotEquals(-1, this.createdElements_[0]['attrs']['style'].indexOf(webfont.FontWatchRunner.DEFAULT_FONTS_A));
  assertEquals('BESbswy', this.createdElements_[0]['innerHtml']);
  assertEquals('span', this.createdElements_[1]['name']);
  assertEquals(-1, this.createdElements_[1]['attrs']['style'].indexOf('fontFamily1'));
  assertNotEquals(-1, this.createdElements_[1]['attrs']['style'].indexOf(webfont.FontWatchRunner.DEFAULT_FONTS_B));
  assertEquals('BESbswy', this.createdElements_[1]['innerHtml']);
  assertEquals('span', this.createdElements_[2]['name']);
  assertNotEquals(-1, this.createdElements_[2]['attrs']['style'].indexOf('fontFamily1'));
  assertNotEquals(-1, this.createdElements_[2]['attrs']['style'].indexOf(webfont.FontWatchRunner.DEFAULT_FONTS_A));
  assertEquals('BESbswy', this.createdElements_[2]['innerHtml']);
  assertEquals('span', this.createdElements_[3]['name']);
  assertNotEquals(-1, this.createdElements_[3]['attrs']['style'].indexOf('fontFamily1'));
  assertNotEquals(-1, this.createdElements_[3]['attrs']['style'].indexOf(webfont.FontWatchRunner.DEFAULT_FONTS_B));
  assertEquals('BESbswy', this.createdElements_[3]['innerHtml']);
  assertEquals(4, this.insertIntoCalled_);
  assertEquals(4, this.removeElementCalled_);
};

FontWatchRunnerTest.prototype.testDomWithNotDefaultTestString = function() {
  this.timesToCheckWidthsBeforeChange_ = 3;
  this.timesToReportChangedWidth_ = 2;
  this.timesToGetTimeBeforeTimeout_ = 10;

  var fontWatchRunner = new webfont.FontWatchRunner(this.activeCallback_,
      this.inactiveCallback_, this.fakeDomHelper_, this.fakeFontSizer_,
      this.fakeAsyncCall_, this.fakeGetTime_, this.fontFamily_,
      this.fontDescription_, 'testString');

  fontWatchRunner.start();

  assertEquals(4, this.createElementCalled_);
  assertEquals('span', this.createdElements_[0]['name']);
  assertEquals(-1, this.createdElements_[0]['attrs']['style'].indexOf('fontFamily1'));
  assertNotEquals(-1, this.createdElements_[0]['attrs']['style'].indexOf(webfont.FontWatchRunner.DEFAULT_FONTS_A));
  assertEquals('testString', this.createdElements_[0]['innerHtml']);
  assertEquals('span', this.createdElements_[1]['name']);
  assertEquals(-1, this.createdElements_[1]['attrs']['style'].indexOf('fontFamily1'));
  assertNotEquals(-1, this.createdElements_[1]['attrs']['style'].indexOf(webfont.FontWatchRunner.DEFAULT_FONTS_B));
  assertEquals('testString', this.createdElements_[1]['innerHtml']);
  assertEquals('span', this.createdElements_[2]['name']);
  assertNotEquals(-1, this.createdElements_[2]['attrs']['style'].indexOf('fontFamily1'));
  assertNotEquals(-1, this.createdElements_[2]['attrs']['style'].indexOf(webfont.FontWatchRunner.DEFAULT_FONTS_A));
  assertEquals('testString', this.createdElements_[2]['innerHtml']);
  assertEquals('span', this.createdElements_[3]['name']);
  assertNotEquals(-1, this.createdElements_[3]['attrs']['style'].indexOf('fontFamily1'));
  assertNotEquals(-1, this.createdElements_[3]['attrs']['style'].indexOf(webfont.FontWatchRunner.DEFAULT_FONTS_B));
  assertEquals('testString', this.createdElements_[3]['innerHtml']);
  assertEquals(4, this.insertIntoCalled_);
  assertEquals(4, this.removeElementCalled_);

};
