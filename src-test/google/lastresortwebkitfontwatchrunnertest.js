var LastResortWebKitFontWatchRunnerTest =
    TestCase('LastResortWebKitFontWatchRunnerTest');

LastResortWebKitFontWatchRunnerTest.prototype.setUp = function() {
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
  this.setStyleCalled_ = 0;
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
    setStyle: function(e, s) {
      self.setStyleCalled_++;
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

LastResortWebKitFontWatchRunnerTest.prototype.testLastResortFontIgnored =
    function() {
  var originalSizeCount = 2;
  var lastResortFontsCount = 11;
  var firstSize = 2;
  var secondSize = 2;
  var thirdSize = 2;

  var fontWatchRunner = new webfont.LastResortWebKitFontWatchRunner(
      this.activeCallback_,
      this.inactiveCallback_,
      this.fakeDomHelper_, {getWidth: function() {
        if (originalSizeCount > 0) {
          originalSizeCount--;
          return 1;
        }
        if (lastResortFontsCount > 0) {
          lastResortFontsCount--;
          return 2;
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

  fontWatchRunner.start();

  assertEquals(2, this.asyncCount_);

  // When on webkit time out ends up activating the font.
  assertEquals(1, this.fontActiveCalled_);
  assertEquals(0, this.fontInactiveCalled_);
  assertEquals(true, this.fontActive_['fontFamily1 n4']);
};

LastResortWebKitFontWatchRunnerTest.prototype.testLastResortFontActiveWhenSizeMatch
    = function() {
  this.timesToGetTimeBeforeTimeout_ = 3;
  var originalSizeCount = 2;
  var lastResortFontsCount = 11;
  var firstSize = 2;

  this.fontFamily_ = "Arimo";

  var fontWatchRunner = new webfont.LastResortWebKitFontWatchRunner(
      this.activeCallback_,
      this.inactiveCallback_,
      this.fakeDomHelper_, {getWidth: function() {
        if (originalSizeCount > 0) {
          originalSizeCount--;
          return 1;
        }
        if (lastResortFontsCount > 0) {
          lastResortFontsCount--;
          return 2;
        }
        if (firstSize > 0) {
          firstSize--;
          return 1;
        }
        return 2;
      }}, this.fakeAsyncCall_, this.fakeGetTime_, this.fontFamily_,
      this.fontDescription_);

  fontWatchRunner.start();

  assertEquals(2, this.asyncCount_);

  assertEquals(1, this.fontActiveCalled_);
  assertEquals(0, this.fontInactiveCalled_);
  assertEquals(true, this.fontActive_['Arimo n4']);
};

LastResortWebKitFontWatchRunnerTest.prototype.testLastResortFontInactiveWhenSizeNoMatch
    = function() {
  this.timesToGetTimeBeforeTimeout_ = 3;
  var originalSizeCount = 2;
  var lastResortFontsCount = 11;
  var firstSize = 2;
  var secondSize = 2;
  var thirdSize = 2;

  var fontWatchRunner = new webfont.LastResortWebKitFontWatchRunner(
      this.activeCallback_,
      this.inactiveCallback_,
      this.fakeDomHelper_, {getWidth: function(elem) {
        if (originalSizeCount > 0) {
          originalSizeCount--;
          return 1;
        }
        if (lastResortFontsCount > 0) {
          lastResortFontsCount--;
          return 2;
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

  fontWatchRunner.start();

  assertEquals(2, this.asyncCount_);

  // When on webkit time out ends up activating the font.
  assertEquals(0, this.fontActiveCalled_);
  assertEquals(1, this.fontInactiveCalled_);
  assertEquals(true, this.fontInactive_['fontFamily1 n4']);
};
