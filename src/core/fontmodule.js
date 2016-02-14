goog.provide('webfont.FontModule');

/**
 * @interface
 */
webfont.FontModule = function () {};

goog.scope(function () {
  var FontModule = webfont.FontModule;

  /**
   * @param {function(Array.<webfont.Font>,  webfont.FontTestStrings=, Object.<string, boolean>=)} onReady
   */
  FontModule.prototype.load = function (onReady) {};
});

