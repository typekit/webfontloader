goog.provide('webfont.StyleSheetWaiter');

/**
 * A utility class for handling callback from DomHelper.loadStylesheet().
 *
 * @constructor
 */
webfont.StyleSheetWaiter = function() {
  /** @private @type {number} */
  this.waitingCount_ = 0;
  /** @private @type {Function} */
  this.onReady_ = null;
};

goog.scope(function () {
  var StyleSheetWaiter = webfont.StyleSheetWaiter;

  /**
   * @return {function(Error)}
   */
  StyleSheetWaiter.prototype.startWaitingLoad = function() {
    var self = this;
    self.waitingCount_++;
    return function(error) {
      self.waitingCount_--;
      self.fireIfReady_();
    };
  };

  /**
   * @param {Function} fn
   */
  StyleSheetWaiter.prototype.waitWhileNeededThen = function(fn) {
    this.onReady_ = fn;
    this.fireIfReady_();
  };

  /**
   * @private
   */
  StyleSheetWaiter.prototype.fireIfReady_ = function() {
    var isReady = 0 == this.waitingCount_;
    if (isReady && this.onReady_) {
      this.onReady_();
      this.onReady_ = null;
    }
  };
});
