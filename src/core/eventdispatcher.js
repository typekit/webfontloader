goog.provide('webfont.EventDispatcher');

goog.require('webfont.CssClassName');

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

goog.scope(function () {
  var EventDispatcher = webfont.EventDispatcher;

  /**
   * Dispatch the loading event and append the loading class name.
   */
  EventDispatcher.prototype.dispatchLoading = function() {
    this.domHelper_.updateClassName(this.htmlElement_,
      [
        this.cssClassName_.build(this.namespace_, webfont.EventDispatcher.LOADING)
      ]
    );

    this.dispatch_(webfont.EventDispatcher.LOADING);
  };

  /**
   * Dispatch the font loading event and append the font loading class name.
   * @param {webfont.Font} font
   */
  EventDispatcher.prototype.dispatchFontLoading = function(font) {
    this.domHelper_.updateClassName(this.htmlElement_,
      [
        this.cssClassName_.build(this.namespace_, font.getName(), font.getVariation().toString(), webfont.EventDispatcher.LOADING)
      ]
    );

    this.dispatch_(
        webfont.EventDispatcher.FONT + webfont.EventDispatcher.LOADING, font);
  };

  /**
   * Dispatch the font active event, remove the font loading class name, remove
   * the font inactive class name, and append the font active class name.
   * @param {webfont.Font} font
   */
  EventDispatcher.prototype.dispatchFontActive = function(font) {
    this.domHelper_.updateClassName(
      this.htmlElement_,
      [
        this.cssClassName_.build(this.namespace_, font.getName(), font.getVariation().toString(), webfont.EventDispatcher.ACTIVE)
      ],
      [
        this.cssClassName_.build(this.namespace_, font.getName(), font.getVariation().toString(), webfont.EventDispatcher.LOADING),
        this.cssClassName_.build(this.namespace_, font.getName(), font.getVariation().toString(), webfont.EventDispatcher.INACTIVE)
      ]
    );

    this.dispatch_(webfont.EventDispatcher.FONT + webfont.EventDispatcher.ACTIVE, font);
  };

  /**
   * Dispatch the font inactive event, remove the font loading class name, and
   * append the font inactive class name (unless the font active class name is
   * already present).
   * @param {webfont.Font} font
   */
  EventDispatcher.prototype.dispatchFontInactive = function(font) {
    var hasFontActive = this.domHelper_.hasClassName(this.htmlElement_,
          this.cssClassName_.build(this.namespace_, font.getName(), font.getVariation().toString(), webfont.EventDispatcher.ACTIVE)
        ),
        add = [],
        remove = [
          this.cssClassName_.build(this.namespace_, font.getName(), font.getVariation().toString(), webfont.EventDispatcher.LOADING)
        ];

    if (!hasFontActive) {
      add.push(this.cssClassName_.build(this.namespace_, font.getName(), font.getVariation().toString(), webfont.EventDispatcher.INACTIVE));
    }

    this.domHelper_.updateClassName(this.htmlElement_, add, remove);

    this.dispatch_(webfont.EventDispatcher.FONT + webfont.EventDispatcher.INACTIVE, font);
  };

  /**
   * Dispatch the inactive event, remove the loading class name, and append the
   * inactive class name (unless the active class name is already present).
   */
  EventDispatcher.prototype.dispatchInactive = function() {
    var hasActive = this.domHelper_.hasClassName(this.htmlElement_,
          this.cssClassName_.build(this.namespace_, webfont.EventDispatcher.ACTIVE)
        ),
        add = [],
        remove = [
          this.cssClassName_.build(this.namespace_, webfont.EventDispatcher.LOADING)
        ];

    if (!hasActive) {
      add.push(this.cssClassName_.build(this.namespace_, webfont.EventDispatcher.INACTIVE));
    }

    this.domHelper_.updateClassName(this.htmlElement_, add, remove);

    this.dispatch_(webfont.EventDispatcher.INACTIVE);
  };

  /**
   * Dispatch the active event, remove the loading class name, remove the inactive
   * class name, and append the active class name.
   */
  EventDispatcher.prototype.dispatchActive = function() {
    this.domHelper_.updateClassName(this.htmlElement_,
      [
        this.cssClassName_.build(this.namespace_, webfont.EventDispatcher.ACTIVE)
      ],
      [
        this.cssClassName_.build(this.namespace_, webfont.EventDispatcher.LOADING),
        this.cssClassName_.build(this.namespace_, webfont.EventDispatcher.INACTIVE)
      ]
    );

    this.dispatch_(webfont.EventDispatcher.ACTIVE);
  };

  /**
   * @param {string} event
   * @param {webfont.Font=} opt_font
   */
  EventDispatcher.prototype.dispatch_ = function(event, opt_font) {
    if (this.callbacks_[event]) {
      if (opt_font) {
        this.callbacks_[event](opt_font.getName(), opt_font.getVariation());
      } else {
        this.callbacks_[event]();
      }
    }
  };
});
