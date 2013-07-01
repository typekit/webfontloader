goog.provide('webfont.DomHelper');

/**
 * Handles common DOM manipulation tasks. The aim of this library is to cover
 * the needs of typical font loading. Not more, not less.
 * @param {Window} mainWindow The main window webfontloader.js is loaded in.
 * @param {Window=} opt_loadWindow The window we'll load the font into. By
 *   default, the main window is used.
 * @constructor
 */
webfont.DomHelper = function(mainWindow, opt_loadWindow) {
  this.mainWindow_ = mainWindow;
  this.loadWindow_ = opt_loadWindow || mainWindow;

  /** @type {Document} */
  this.document_ = this.loadWindow_.document;

  /** @type {boolean|undefined} */
  this.supportForStyle_ = undefined;
};

goog.scope(function () {
  var DomHelper = webfont.DomHelper;

  /**
   * Creates an element.
   * @param {string} elem The element type.
   * @param {Object=} opt_attr A hash of attribute key/value pairs.
   * @param {string=} opt_innerHtml Contents of the element.
   * @return {Element} the new element.
   */
  DomHelper.prototype.createElement = function(elem, opt_attr,
      opt_innerHtml) {
    var domElement = this.document_.createElement(elem);

    if (opt_attr) {
      for (var attr in opt_attr) {
        // protect against native prototype augmentations
        if (opt_attr.hasOwnProperty(attr)) {
          if (attr == "style") {
            this.setStyle(domElement, opt_attr[attr]);
          } else {
            domElement.setAttribute(attr, opt_attr[attr]);
          }
        }
      }
    }
    if (opt_innerHtml) {
      domElement.appendChild(this.document_.createTextNode(opt_innerHtml));
    }
    return domElement;
  };

  /**
   * Inserts an element into the document. This is intended for unambiguous
   * elements such as html, body, head.
   * @param {string} tagName The element name.
   * @param {Element} e The element to append.
   * @return {boolean} True if the element was inserted.
   */
  DomHelper.prototype.insertInto = function(tagName, e) {
    var t = this.document_.getElementsByTagName(tagName)[0];

    if (!t) { // opera allows documents without a head
      t = document.documentElement;
    }

    if (t && t.lastChild) {
      // This is safer than appendChild in IE. appendChild causes random
      // JS errors in IE. Sometimes errors in other JS exectution, sometimes
      // complete 'This page cannot be displayed' errors. For our purposes,
      // it's equivalent because we don't need to insert at any specific
      // location.
      t.insertBefore(e, t.lastChild);
      return true;
    }
    return false;
  };

  /**
   * Calls a function when the body tag exists.
   * @param {function()} callback The function to call.
   */
  DomHelper.prototype.whenBodyExists = function(callback) {
    var that = this;
    var check = function() {
      if (that.document_.body) {
        callback();
      } else {
        setTimeout(check, 0);
      }
    }
    check();
  };

  /**
   * Removes an element from the DOM.
   * @param {Element} node The element to remove.
   * @return {boolean} True if the element was removed.
   */
  DomHelper.prototype.removeElement = function(node) {
    if (node.parentNode) {
      node.parentNode.removeChild(node);
      return true;
    }
    return false;
  };

  /**
   * Creates a link to a CSS document.
   * @param {string} src The URL of the stylesheet.
   * @return {Element} a link element.
   */
  DomHelper.prototype.createCssLink = function(src) {
    return this.createElement('link', {
      'rel': 'stylesheet',
      'href': src
    });
  };

  /**
   * Creates a link to a javascript document.
   * @param {string} src The URL of the script.
   * @return {Element} a script element.
   */
  DomHelper.prototype.createScriptSrc = function(src) {
    return this.createElement('script', {
      'src': src
    });
  };

  /**
   * Appends a name to an element's class attribute.
   * @param {Element} e The element.
   * @param {string} name The class name to add.
   */
  DomHelper.prototype.appendClassName = function(e, name) {
    var classes = e.className.split(/\s+/);
    for (var i = 0, len = classes.length; i < len; i++) {
      if (classes[i] == name) {
        return;
      }
    }
    classes.push(name);
    e.className = classes.join(' ')
                    .replace(/\s+/g, ' ')
                    .replace(/^\s+|\s+$/, '');
  };

  /**
   * Removes a name to an element's class attribute.
   * @param {Element} e The element.
   * @param {string} name The class name to remove.
   */
  DomHelper.prototype.removeClassName = function(e, name) {
    var classes = e.className.split(/\s+/);
    var remainingClasses = [];
    for (var i = 0, len = classes.length; i < len; i++) {
      if (classes[i] != name) {
        remainingClasses.push(classes[i]);
      }
    }
    e.className = remainingClasses.join(' ')
                    .replace(/\s+/g, ' ')
                    .replace(/^\s+|\s+$/, '');
  };

  /**
   * Returns true if an element has a given class name and false otherwise.
   * @param {Element} e The element.
   * @param {string} name The class name to check for.
   * @return {boolean} Whether or not the element has this class name.
   */
  DomHelper.prototype.hasClassName = function(e, name) {
    var classes = e.className.split(/\s+/);
    for (var i = 0, len = classes.length; i < len; i++) {
      if (classes[i] == name) {
        return true;
      }
    }
    return false;
  };

  /**
   * Sets the style attribute on an element.
   * @param {Element} e The element.
   * @param {string} styleString The style string.
   */
  DomHelper.prototype.setStyle = function(e, styleString) {
    if (this.hasSupportForStyle_()) {
      e.setAttribute("style", styleString);
    } else {
      e.style.cssText = styleString;
    }
  };

  /**
   * Check if getting and setting the style attribute on an element with
   * getAttribute/setAttribute is supported. In old IE, you must use style.cssText
   * instead. Feature detection is only done the first time this is called.
   * @private
   * @return {boolean} Whether or not the feature is supported.
   */
  DomHelper.prototype.hasSupportForStyle_ = function() {
    if (this.supportForStyle_ === undefined) {
      var e = this.document_.createElement('p');
      e.innerHTML = '<a style="top:1px;">w</a>';
      this.supportForStyle_ = /top/.test(e.getElementsByTagName('a')[0].getAttribute('style'));
    }
    return this.supportForStyle_
  };

  /**
   * @return {Window} The main window webfontloader.js is loaded in (for config).
   */
  DomHelper.prototype.getMainWindow = function() {
    return this.mainWindow_;
  };

  /**
   * @return {Window} The window that we're loading the font(s) into.
   */
  DomHelper.prototype.getLoadWindow = function() {
    return this.loadWindow_;
  };

  /**
   * @return {string} The protocol (http: or https:) to request resources in.
   */
  DomHelper.prototype.getProtocol = function() {
    var protocol = this.loadWindow_.location.protocol;
    // For empty iframes, fallback to main window's protocol.
    if (protocol == 'about:') {
      protocol = this.mainWindow_.location.protocol;
    }
    return protocol == 'https:' ? 'https:' : 'http:';
  };

  /**
   * Returns the secure status of the current document.
   * @return {boolean} true if the current document is served securely.
   */
  DomHelper.prototype.isHttps = function() {
    return this.getProtocol() === 'https:';
  };

  /**
   * Returns the hostname of the current document.
   * @return {string} hostname.
   */
  DomHelper.prototype.getHostName = function() {
    return this.getLoadWindow().location.hostname || this.getMainWindow().location.hostname;
  };

  /**
   * Creates a style element.
   * @param {string} css Contents of the style element.
   * @return {Element} a DOM element.
   */
  DomHelper.prototype.createStyle = function(css) {
    var e = this.document_.createElement('style');

    e.setAttribute('type', 'text/css');
    if (e.styleSheet) { // IE
      e.styleSheet.cssText = css;
    } else {
      e.appendChild(document.createTextNode(css));
    }
    return e;
  };

  /**
   * Loads an external script file.
   * @param {string} src URL of the script.
   * @param {function()=} opt_callback callback when the script has loaded.
   * @return {Element} The script element
   */
  DomHelper.prototype.loadScript = function(src, opt_callback) {
    var head = this.document_.getElementsByTagName('head')[0];

    if (head) {
      var script = this.document_.createElement('script');
      script.src = src;
      var done = false;
      script.onload = script.onreadystatechange = function() {
        if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
          done = true;
          if (opt_callback) {
            opt_callback();
          }
          script.onload = script.onreadystatechange = null;
          // Avoid a bizarre issue with unclosed <base> tag in IE6 - http://blog.dotsmart.net/2008/04/
          if (script.parentNode.tagName == 'HEAD') head.removeChild(script);
        }
      };
      head.appendChild(script);
      return script;
    }

    return null;
  };
});
