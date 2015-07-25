goog.provide('webfont.NativeFontWatchRunner');

goog.require('webfont.Font');

goog.scope(function () {
  /**
   * Watches a subtree and detects possible stylesheet
   * availability changes.
   *
   * @param {Element} root
   * @private
   * @constructor @struct
   */
  var StyleSheetObserver_ = function(root) {
    /** @private {Function} */
    this.listener_ = null;
    /** @private */
    this.observer_ = new MutationObserver(this.handleMutations_.bind(this));
    this.observer_.observe(root, /** @type {MutationObserverInit} */({
      childList: true,
      characterData: true,
      subtree: true
    }));
  };

  /**
   * @private
   * @param {Array} mutations
   */
  StyleSheetObserver_.prototype.handleMutations_ = function(mutations) {
    var found = false;
    for (var i = 0; i < mutations.length; i++) {
      var record = mutations[i];
      switch (record.type) {
      case 'childList':
        for (var j = 0; j < record.addedNodes.length; j++) {
          var el = record.addedNodes[j];
          switch (el.nodeType) {
          case 1: // Document.ELEMENT_TYPE
            switch (el.tagName) {
            case 'STYLE':
              found = true;
              break;
            case 'LINK':
              el.addEventListener('load', this.handleStylesheetUpdate_.bind(this));
              el.addEventListener('error', this.handleStylesheetUpdate_.bind(this));
              break;
            }
            break;
          case 3: // Document.TEXT_NODE
            if (el.parentNode.tagName == 'STYLE') {
              found = true;
            }
            break;
          }
        }
        break;
      case 'characterData':
        if (record.target.parentNode.tagName == 'STYLE') {
          found = true;
        }
        break;
      }
    }

    if (found) {
      this.handleStylesheetUpdate_();
    }
  };

  /**
   * @private
   */
  StyleSheetObserver_.prototype.handleStylesheetUpdate_ = function() {
    var fn = this.listener_;
    if (fn) {
      this.listener_ = null;
      fn();
    }
  };

  /**
   * Set a listener that may handle a stylesheet change.
   * Note that this listener is one-shot. You have to reset
   * once it gets fired.
   *
   * @param {Function} listener
   */
  StyleSheetObserver_.prototype.setListener = function(listener) {
    this.listener_ = listener;
  };

  /**
   * Stop observing the DOM tree.
   */
  StyleSheetObserver_.prototype.close = function() {
    this.observer_.disconnect();
  };


  /**
  * @constructor
  * @param {function(webfont.Font)} activeCallback
  * @param {function(webfont.Font)} inactiveCallback
  * @param {webfont.DomHelper} domHelper
  * @param {webfont.Font} font
  * @param {number=} opt_timeout
  * @param {string=} opt_fontTestString
  */
  webfont.NativeFontWatchRunner = function(activeCallback, inactiveCallback, domHelper, font, opt_timeout, opt_fontTestString) {
    this.activeCallback_ = activeCallback;
    this.inactiveCallback_ = inactiveCallback;
    this.font_ = font;
    this.domHelper_ = domHelper;
    this.timeout_ = opt_timeout || 3000;
    this.fontTestString_ = opt_fontTestString || undefined;
    this.expired_ = false;
  };

  var NativeFontWatchRunner = webfont.NativeFontWatchRunner;

  /**
   * @param {StyleSheetObserver_} observer
   * @private
   */
  NativeFontWatchRunner.prototype.loadWithRetries_ = function (observer) {
    var doc = this.domHelper_.getLoadWindow().document,
        that = this;

    return doc.fonts.load(this.font_.toCssString(), this.fontTestString_).then(function(fonts) {
      if (0 < fonts.length || this.expired_) {
        return fonts;
      }

      // No fonts are returned, which means none of the stylesheets
      // hasn't given the @font-face yet. Let's wait for another round.
      return new Promise(function (resolve, reject) {
        observer.setListener(function() {
          that.loadWithRetries_(observer).then(resolve, reject);
        });
      });
    });
  };

  NativeFontWatchRunner.prototype.start = function () {
    var doc = this.domHelper_.getLoadWindow().document,
        that = this,
        observer = new StyleSheetObserver_(document.head || document.documentElement);
    // We're using Promises here because the font load API
    // uses them, so we can be sure they're available.
    Promise.race([new Promise(function (resolve, reject) {
      setTimeout(function () {
        that.expired_ = true;
        reject(that.font_);
      }, that.timeout_);
    }), this.loadWithRetries_(observer)]).then(function (fonts) {
      observer.close();
      if (fonts.length === 1) {
        that.activeCallback_(that.font_);
      } else {
        that.inactiveCallback_(that.font_);
      }
    }, function () {
      observer.close();
      that.inactiveCallback_(that.font_);
    });
  };
});
