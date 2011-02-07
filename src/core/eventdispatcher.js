/**
 * A class to dispatch events and manage the event class names on an html
 * element that represent the current state of fonts on the page. Active class
 * names always overwrite inactive class names of the same type, while loading
 * class names may be present whenever a font is loading (regardless of if an
 * associated active or inactive class name is also present).
 * @param {webfont.DomHelper} domHelper
 * @param {HTMLElement} htmlElement
 * @param {Object} callbacks
 * @param {string=} opt_namespace
 * @constructor
 */
webfont.EventDispatcher = function(domHelper, htmlElement, callbacks,
    opt_namespace) {
  this.domHelper_ = domHelper;
  this.htmlElement_ = htmlElement;
  this.callbacks_ = callbacks;
  this.namespace_ = opt_namespace || webfont.EventDispatcher.DEFAULT_NAMESPACE;
  this.cssClassName_ = new webfont.CssClassName('-');
};

/**
 * @const
 * @type {string}
 */
webfont.EventDispatcher.DEFAULT_NAMESPACE = 'wf';

/**
 * @const
 * @type {string}
 */
webfont.EventDispatcher.LOADING = 'loading';

/**
 * @const
 * @type {string}
 */
webfont.EventDispatcher.ACTIVE = 'active';

/**
 * @const
 * @type {string}
 */
webfont.EventDispatcher.INACTIVE = 'inactive';

/**
 * @const
 * @type {string}
 */
webfont.EventDispatcher.FONT = 'font';

/**
 * Dispatch the loading event and append the loading class name.
 */
webfont.EventDispatcher.prototype.dispatchLoading = function() {
  this.domHelper_.appendClassName(this.htmlElement_,
      this.cssClassName_.build(
          this.namespace_, webfont.EventDispatcher.LOADING));
  this.dispatch_(webfont.EventDispatcher.LOADING);
};

/**
 * Dispatch the font loading event and append the font loading class name.
 * @param {string} fontFamily
 * @param {string} fontDescription
 */
webfont.EventDispatcher.prototype.dispatchFontLoading = function(fontFamily, fontDescription) {
  this.domHelper_.appendClassName(this.htmlElement_,
      this.cssClassName_.build(
          this.namespace_, fontFamily, fontDescription, webfont.EventDispatcher.LOADING));
  this.dispatch_(
      webfont.EventDispatcher.FONT + webfont.EventDispatcher.LOADING, fontFamily, fontDescription);
};

/**
 * Dispatch the font active event, remove the font loading class name, remove
 * the font inactive class name, and append the font active class name.
 * @param {string} fontFamily
 * @param {string} fontDescription
 */
webfont.EventDispatcher.prototype.dispatchFontActive = function(fontFamily, fontDescription) {
  this.domHelper_.removeClassName(this.htmlElement_,
      this.cssClassName_.build(
          this.namespace_, fontFamily, fontDescription, webfont.EventDispatcher.LOADING));
  this.domHelper_.removeClassName(this.htmlElement_,
      this.cssClassName_.build(
          this.namespace_, fontFamily, fontDescription, webfont.EventDispatcher.INACTIVE));
  this.domHelper_.appendClassName(this.htmlElement_,
      this.cssClassName_.build(
          this.namespace_, fontFamily, fontDescription, webfont.EventDispatcher.ACTIVE));
  this.dispatch_(
      webfont.EventDispatcher.FONT + webfont.EventDispatcher.ACTIVE, fontFamily, fontDescription);
};

/**
 * Dispatch the font inactive event, remove the font loading class name, and
 * append the font inactive class name (unless the font active class name is
 * already present).
 * @param {string} fontFamily
 * @param {string} fontDescription
 */
webfont.EventDispatcher.prototype.dispatchFontInactive = function(fontFamily, fontDescription) {
  this.domHelper_.removeClassName(this.htmlElement_,
      this.cssClassName_.build(
          this.namespace_, fontFamily, fontDescription, webfont.EventDispatcher.LOADING));
  var hasFontActive = this.domHelper_.hasClassName(this.htmlElement_,
      this.cssClassName_.build(
          this.namespace_, fontFamily, fontDescription, webfont.EventDispatcher.ACTIVE));
  if (!hasFontActive) {
    this.domHelper_.appendClassName(this.htmlElement_,
        this.cssClassName_.build(
            this.namespace_, fontFamily, fontDescription, webfont.EventDispatcher.INACTIVE));
  }
  this.dispatch_(
      webfont.EventDispatcher.FONT + webfont.EventDispatcher.INACTIVE, fontFamily, fontDescription);
};

/**
 * Dispatch the inactive event, remove the loading class name, and append the
 * inactive class name (unless the active class name is already present).
 */
webfont.EventDispatcher.prototype.dispatchInactive = function() {
  this.domHelper_.removeClassName(this.htmlElement_,
      this.cssClassName_.build(
          this.namespace_, webfont.EventDispatcher.LOADING));
  var hasActive = this.domHelper_.hasClassName(this.htmlElement_,
      this.cssClassName_.build(
          this.namespace_, webfont.EventDispatcher.ACTIVE));
  if (!hasActive) {
    this.domHelper_.appendClassName(this.htmlElement_,
        this.cssClassName_.build(
          this.namespace_, webfont.EventDispatcher.INACTIVE));
  }
  this.dispatch_(webfont.EventDispatcher.INACTIVE);
};

/**
 * Dispatch the active event, remove the loading class name, remove the inactive
 * class name, and append the active class name.
 */
webfont.EventDispatcher.prototype.dispatchActive = function() {
  this.domHelper_.removeClassName(this.htmlElement_,
      this.cssClassName_.build(
          this.namespace_, webfont.EventDispatcher.LOADING));
  this.domHelper_.removeClassName(this.htmlElement_,
      this.cssClassName_.build(
          this.namespace_, webfont.EventDispatcher.INACTIVE));
  this.domHelper_.appendClassName(this.htmlElement_,
      this.cssClassName_.build(
          this.namespace_, webfont.EventDispatcher.ACTIVE));
  this.dispatch_(webfont.EventDispatcher.ACTIVE);
};

/**
 * @param {string} event
 * @param {string=} opt_arg1
 * @param {string=} opt_arg2
 */
webfont.EventDispatcher.prototype.dispatch_ = function(event, opt_arg1, opt_arg2) {
  if (this.callbacks_[event]) {
    this.callbacks_[event](opt_arg1, opt_arg2);
  }
};
