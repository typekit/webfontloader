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

  this.fakeFirefoxUserAgent_ = new webfont.UserAgent('Firefox', '3.6', 'Gecko',
      '1.9.2', 'Macintosh', '10.6', undefined, true);

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
    },
    setStyle: function(e, styleString) {
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
  this.timesToCheckWidthsBeforeChange_ = 1;
  this.timesToReportChangedWidth_ = 2;
  this.timesToGetTimeBeforeTimeout_ = 10;

  new webfont.FontWatchRunner(this.activeCallback_, this.inactiveCallback_,
      this.fakeFirefoxUserAgent_, this.fakeDomHelper_, this.fakeFontSizer_,
      this.fakeAsyncCall_, this.fakeGetTime_, this.fontFamily_,
      this.fontDescription_);

  assertEquals(1, this.asyncCount_);

  assertEquals(1, this.fontActiveCalled_);
  assertEquals(true, this.fontActive_['fontFamily1 n4']);
  assertEquals(0, this.fontInactiveCalled_);
};

FontWatchRunnerTest.prototype.testWatchFontWaitForLoadActive = function() {
  this.timesToCheckWidthsBeforeChange_ = 2;
  this.timesToReportChangedWidth_ = 2;
  this.timesToGetTimeBeforeTimeout_ = 10;

  new webfont.FontWatchRunner(this.activeCallback_, this.inactiveCallback_,
      this.fakeFirefoxUserAgent_, this.fakeDomHelper_, this.fakeFontSizer_,
      this.fakeAsyncCall_, this.fakeGetTime_, this.fontFamily_,
      this.fontDescription_);

  assertEquals(2, this.asyncCount_);

  assertEquals(1, this.fontActiveCalled_);
  assertEquals(true, this.fontActive_['fontFamily1 n4']);
  assertEquals(0, this.fontInactiveCalled_);
};

FontWatchRunnerTest.prototype.testWatchFontWaitForLoadInactive = function() {
  this.timesToCheckWidthsBeforeChange_ = 10;
  this.timesToReportChangedWidth_ = 2;
  this.timesToGetTimeBeforeTimeout_ = 5;

  new webfont.FontWatchRunner(this.activeCallback_, this.inactiveCallback_,
      this.fakeFirefoxUserAgent_, this.fakeDomHelper_, this.fakeFontSizer_,
      this.fakeAsyncCall_, this.fakeGetTime_, this.fontFamily_,
      this.fontDescription_);

  assertEquals(4, this.asyncCount_);

  assertEquals(0, this.fontActiveCalled_);
  assertEquals(1, this.fontInactiveCalled_);
  assertEquals(true, this.fontInactive_['fontFamily1 n4']);
};

FontWatchRunnerTest.prototype.testDomWithDefaultTestString = function() {
  this.timesToCheckWidthsBeforeChange_ = 3;
  this.timesToReportChangedWidth_ = 2;
  this.timesToGetTimeBeforeTimeout_ = 10;

  new webfont.FontWatchRunner(this.activeCallback_, this.inactiveCallback_,
      this.fakeFirefoxUserAgent_, this.fakeDomHelper_, this.fakeFontSizer_,
      this.fakeAsyncCall_, this.fakeGetTime_, this.fontFamily_,
      this.fontDescription_);

  assertEquals(4, this.createElementCalled_);
  assertEquals('span', this.createdElements_[0]['name']);
  assertEquals(-1, this.createdElements_[0]['attrs']['style'].indexOf('fontFamily1'));
  assertNotEquals(-1, this.createdElements_[0]['attrs']['style'].indexOf(webfont.FontWatchRunner.DEFAULT_FONTS_A));
  assertEquals('BESs', this.createdElements_[0]['innerHtml']);
  assertEquals('span', this.createdElements_[1]['name']);
  assertEquals(-1, this.createdElements_[1]['attrs']['style'].indexOf('fontFamily1'));
  assertNotEquals(-1, this.createdElements_[1]['attrs']['style'].indexOf(webfont.FontWatchRunner.DEFAULT_FONTS_B));
  assertEquals('BESs', this.createdElements_[1]['innerHtml']);
  assertEquals('span', this.createdElements_[2]['name']);
  assertNotEquals(-1, this.createdElements_[2]['attrs']['style'].indexOf('fontFamily1'));
  assertNotEquals(-1, this.createdElements_[2]['attrs']['style'].indexOf(webfont.FontWatchRunner.DEFAULT_FONTS_A));
  assertEquals('BESs', this.createdElements_[2]['innerHtml']);
  assertEquals('span', this.createdElements_[3]['name']);
  assertNotEquals(-1, this.createdElements_[3]['attrs']['style'].indexOf('fontFamily1'));
  assertNotEquals(-1, this.createdElements_[3]['attrs']['style'].indexOf(webfont.FontWatchRunner.DEFAULT_FONTS_B));
  assertEquals('BESs', this.createdElements_[3]['innerHtml']);
  assertEquals(4, this.insertIntoCalled_);
  assertEquals(4, this.removeElementCalled_);

};

FontWatchRunnerTest.prototype.testDomWithNotDefaultTestString = function() {
  this.timesToCheckWidthsBeforeChange_ = 3;
  this.timesToReportChangedWidth_ = 2;
  this.timesToGetTimeBeforeTimeout_ = 10;

  new webfont.FontWatchRunner(this.activeCallback_, this.inactiveCallback_,
      this.fakeFirefoxUserAgent_, this.fakeDomHelper_, this.fakeFontSizer_,
      this.fakeAsyncCall_, this.fakeGetTime_, this.fontFamily_,
      this.fontDescription_, 'testString');

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

FontWatchRunnerTest.prototype.testLastResortFontIgnored = function() {
  var userAgent = new webfont.UserAgent('Chrome', '16.0.912.36', 'AppleWebKit',
      '531.9', 'Macintosh', '10.6', undefined, true);
  var lastResortFontsCount = 11;
  var originalSizeCount = 2;
  var firstSize = 2;
  var secondSize = 2;
  var thirdSize = 2;

  new webfont.FontWatchRunner(this.activeCallback_, this.inactiveCallback_,
      userAgent, this.fakeDomHelper_, {getWidth: function() {
        if (lastResortFontsCount > 0) {
	  lastResortFontsCount--;
	  return 2;
	}
	if (originalSizeCount > 0) {
	  originalSizeCount--;
	  return 1;
	}
        if (firstSize > 0) {
	  firstSize--;
	  return 1;
	}
        if (secondSize > 0) {
	  secondSize--;
	  return 2;
	}
        if (thirdSize > 0) {
	  thirdSize--;
	  return 3;
	}
      }}, this.fakeAsyncCall_, this.fakeGetTime_, this.fontFamily_,
      this.fontDescription_);

  assertEquals(2, this.asyncCount_);

  // When on webkit time out ends up activating the font.
  assertEquals(1, this.fontActiveCalled_);
  assertEquals(0, this.fontInactiveCalled_);
  assertEquals(true, this.fontActive_['fontFamily1 n4']);
};

FontWatchRunnerTest.prototype.testLastResortFontActiveWhenSizeMatch
    = function() {
  this.timesToGetTimeBeforeTimeout_ = 3;
  var userAgent = new webfont.UserAgent('Chrome', '16.0.912.36', 'AppleWebKit',
      '531.9', 'Macintosh', '10.6', undefined, true);
  var lastResortFontsCount = 11;
  var originalSizeCount = 2;
  var firstSize = 2;

  new webfont.FontWatchRunner(this.activeCallback_, this.inactiveCallback_,
      userAgent, this.fakeDomHelper_, {getWidth: function() {
        if (lastResortFontsCount > 0) {
          lastResortFontsCount--;
          return 2;
        }
        if (originalSizeCount > 0) {
          originalSizeCount--;
          return 1;
        }
        if (firstSize > 0) {
          firstSize--;
          return 1;
        }
        return 2;
      }}, this.fakeAsyncCall_, this.fakeGetTime_, this.fontFamily_,
      this.fontDescription_);

  assertEquals(2, this.asyncCount_);

  assertEquals(1, this.fontActiveCalled_);
  assertEquals(0, this.fontInactiveCalled_);
  assertEquals(true, this.fontActive_['fontFamily1 n4']);
};

FontWatchRunnerTest.prototype.testLastResortFontInactiveWhenSizeNoMatch
    = function() {
  this.timesToGetTimeBeforeTimeout_ = 3;
  var userAgent = new webfont.UserAgent('Chrome', '16.0.912.36', 'AppleWebKit',
      '531.9', 'Macintosh', '10.6', undefined, true);
  var lastResortFontsCount = 11;
  var originalSizeCount = 2;
  var firstSize = 2;
  var secondSize = 2;
  var thirdSize = 2;

  new webfont.FontWatchRunner(this.activeCallback_, this.inactiveCallback_,
      userAgent, this.fakeDomHelper_, {getWidth: function(elem) {
        if (lastResortFontsCount > 0) {
          lastResortFontsCount--;
          return 2;
        }
        if (originalSizeCount > 0) {
          originalSizeCount--;
          return 1;
        }
        if (firstSize > 0) {
          firstSize--;
          return 1;
        }
        if (secondSize > 0) {
          secondSize--;
          return 2;
        }
        if (thirdSize == 2) {
          thirdSize--;
          return 2;
        }
        if (thirdSize == 1) {
          thirdSize--;
          return 4;
        }
      }}, this.fakeAsyncCall_, this.fakeGetTime_, this.fontFamily_,
      this.fontDescription_);

  assertEquals(2, this.asyncCount_);

  // When on webkit time out ends up activating the font.
  assertEquals(0, this.fontActiveCalled_);
  assertEquals(1, this.fontInactiveCalled_);
  assertEquals(true, this.fontInactive_['fontFamily1 n4']);
};
