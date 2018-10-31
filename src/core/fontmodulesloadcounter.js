goog.provide('webfont.FontModulesLoadCounter');

/**
 * This class is used to keep track of the number of Font Modules that are loading
 * @param {number} numberOfModulesLoading The initial amount of modules that are loading
 * @constructor
 */
webfont.FontModulesLoadCounter = function(numberOfModulesLoading) {
  this.numberOfModulesLoading_ = numberOfModulesLoading;
};

goog.scope(function () {
  var FontModulesLoadCounter = webfont.FontModulesLoadCounter;

  FontModulesLoadCounter.prototype.decrement = function() {
    if (this.numberOfModulesLoading_ - 1 >= 0) {
      this.numberOfModulesLoading_ --;
    }
  }

  /**
   * @return {number}
   */
  FontModulesLoadCounter.prototype.count = function() {
    return this.numberOfModulesLoading_;
  }
});
