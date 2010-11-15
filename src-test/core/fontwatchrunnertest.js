var FontWatchRunnerTest = TestCase('FontWatchRunnerTest');

FontWatchRunnerTest.prototype.setUp = function() {
  var self = this;

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
  this.fakeFontSizer_ = {
    getWidth: function(el) {
      if (el.style.fontFamily.indexOf(webfont.FontWatchRunner.DEFAULT_FONTS_A) > 0) {
        // This is the first font stack with fontFamily included
        if (self.timesToCheckWidthsBeforeChange_ <= 0) {
          return 2;
        } else {
          self.timesToCheckWidthsBeforeChange_--;
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

  this.asyncCalled_ = false;
  this.fakeAsyncCall_ = function(func, timeout) {
    self.asyncCalled_ = true;
    func();
  };

};

FontWatchRunnerTest.prototype.testWatchFontAlreadyLoaded = function() {
  var fontFamily = 'fontFamily1';
  var fontDescription = 'n4';
  this.timesToCheckWidthsBeforeChange_ = 0;
  this.timesToGetTimeBeforeTimeout_ = 10;

  new webfont.FontWatchRunner(this.activeCallback_, this.inactiveCallback_,
      this.fakeDomHelper_, this.fakeFontSizer_, this.fakeAsyncCall_,
      this.fakeGetTime_, fontFamily, fontDescription);

  assertFalse(this.asyncCalled_);

  assertEquals(1, this.fontActiveCalled_);
  assertEquals(true, this.fontActive_['fontFamily1 n4']);
  assertEquals(0, this.fontInactiveCalled_);
};

FontWatchRunnerTest.prototype.testWatchFontWaitForLoadActive = function() {
  var fontFamily = 'fontFamily1';
  var fontDescription = 'n4';
  this.timesToCheckWidthsBeforeChange_ = 3;
  this.timesToGetTimeBeforeTimeout_ = 10;

  new webfont.FontWatchRunner(this.activeCallback_, this.inactiveCallback_,
      this.fakeDomHelper_, this.fakeFontSizer_, this.fakeAsyncCall_,
      this.fakeGetTime_, fontFamily, fontDescription);

  assertTrue(this.asyncCalled_);

  assertEquals(1, this.fontActiveCalled_);
  assertEquals(true, this.fontActive_['fontFamily1 n4']);
  assertEquals(0, this.fontInactiveCalled_);
};

FontWatchRunnerTest.prototype.testWatchFontWaitForLoadInactive = function() {
  var fontFamily = 'fontFamily1';
  var fontDescription = 'n4';
  this.timesToCheckWidthsBeforeChange_ = 10;
  this.timesToGetTimeBeforeTimeout_ = 3;

  new webfont.FontWatchRunner(this.activeCallback_, this.inactiveCallback_,
      this.fakeDomHelper_, this.fakeFontSizer_, this.fakeAsyncCall_,
      this.fakeGetTime_, fontFamily, fontDescription);

  assertTrue(this.asyncCalled_);

  assertEquals(0, this.fontActiveCalled_);
  assertEquals(1, this.fontInactiveCalled_);
  assertEquals(true, this.fontInactive_['fontFamily1 n4']);
};

FontWatchRunnerTest.prototype.testDomWithDefaultTestString = function() {
  var fontFamily = 'fontFamily1';
  var fontDescription = 'n4';
  this.timesToCheckWidthsBeforeChange_ = 3;
  this.timesToGetTimeBeforeTimeout_ = 10;

  new webfont.FontWatchRunner(this.activeCallback_, this.inactiveCallback_,
      this.fakeDomHelper_, this.fakeFontSizer_, this.fakeAsyncCall_,
      this.fakeGetTime_, fontFamily, fontDescription);

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
  var fontFamily = 'fontFamily1';
  var fontDescription = 'n4';
  this.timesToCheckWidthsBeforeChange_ = 3;
  this.timesToGetTimeBeforeTimeout_ = 10;

  new webfont.FontWatchRunner(this.activeCallback_, this.inactiveCallback_,
      this.fakeDomHelper_, this.fakeFontSizer_, this.fakeAsyncCall_,
      this.fakeGetTime_, fontFamily, fontDescription, 'testString');

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
