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

  /** @type {string} */
  this.protocol_;

  /** @type {Document} */
  this.document_ = this.loadWindow_.document;
};

goog.scope(function () {
  var DomHelper = webfont.DomHelper;

  /**
   * The NativeFontWatchRunnner depends on the correct and reliable
   * |onload| event, and browsers with the native font loading API
   * have reliable @onload support as far as we know. So we use the
   * event for such a case and unconditionally invokes the callback
   * otherwise.
   *
   * @const
   * @type {boolean}
   */
  DomHelper.CAN_WAIT_STYLESHEET = !!window['FontFace'];

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

    // This is safer than appendChild in IE. appendChild causes random
    // JS errors in IE. Sometimes errors in other JS exectution, sometimes
    // complete 'This page cannot be displayed' errors. For our purposes,
    // it's equivalent because we don't need to insert at any specific
    // location.
    t.insertBefore(e, t.lastChild);
    return true;
  };

  /**
   * Calls a function when the body tag exists.
   * @param {function()} callback The function to call.
   */
  DomHelper.prototype.whenBodyExists = function(callback) {
    var that = this;

    if (that.document_.body) {
      callback();
    } else {
      if (that.document_.addEventListener) {
        that.document_.addEventListener('DOMContentLoaded', callback);
      } else {
        that.document_.attachEvent('onreadystatechange', function () {
          if (that.document_.readyState == 'interactive' || that.document_.readyState == 'complete') {
            callback();
          }
        });
      }
    }
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
   * @deprecated Use updateClassName().
   *
   * Appends a name to an element's class attribute.
   * @param {Element} e The element.
   * @param {string} name The class name to add.
   */
  DomHelper.prototype.appendClassName = function(e, name) {
    this.updateClassName(e, [name]);
  };

  /**
   * @deprecated Use updateClassName().
   *
   * Removes a name to an element's class attribute.
   * @param {Element} e The element.
   * @param {string} name The class name to remove.
   */
  DomHelper.prototype.removeClassName = function(e, name) {
    this.updateClassName(e, null, [name]);
  };

  /**
   * Updates an element's class attribute in a single change. This
   * allows multiple updates in a single class name change so there
   * is no chance for a browser to relayout in between changes.
   *
   * @param {Element} e The element.
   * @param {Array.<string>=} opt_add List of class names to add.
   * @param {Array.<string>=} opt_remove List of class names to remove.
   */
  DomHelper.prototype.updateClassName = function (e, opt_add, opt_remove) {
    var add = opt_add || [],
        remove = opt_remove || [];

    var classes = e.className.split(/\s+/);

    for (var i = 0; i < add.length; i += 1) {
      var found = false;

      for (var j = 0; j < classes.length; j += 1) {
        if (add[i] === classes[j]) {
          found = true;
          break;
        }
      }

      if (!found) {
        classes.push(add[i]);
      }
    }

    var remainingClasses = [];

    for (var i = 0; i < classes.length; i += 1) {
      var found = false;

      for (var j = 0; j < remove.length; j += 1) {
        if (classes[i] === remove[j]) {
          found = true;
          break;
        }
      }

      if (!found) {
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
    e.style.cssText = styleString;
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
    if (typeof this.protocol_ === 'string') {
      return this.protocol_;
    } else {
      var protocol = this.loadWindow_.location.protocol;
      // For empty iframes, fallback to main window's protocol.
      if (protocol == 'about:') {
        protocol = this.mainWindow_.location.protocol;
      }
      return protocol == 'https:' ? 'https:' : 'http:';
    }
  };

  /**
   * Explicitly set the protocol instead of automatic detection.
   *
   * @param {string} protocol
   */
  DomHelper.prototype.setProtocol = function (protocol) {
    if (/^http(s)?:$/.test(protocol)) {
      this.protocol_ = protocol;
    }
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
    var e = this.createElement('style');

    e.setAttribute('type', 'text/css');
    if (e.styleSheet) { // IE
      e.styleSheet.cssText = css;
    } else {
      e.appendChild(document.createTextNode(css));
    }
    return e;
  };

  /**
   * Loads an external stylesheet.
   *
   * @param {string} href the URL of the stylesheet
   * @param {function(Error)=} opt_callback Called when the stylesheet has loaded or failed to
   * load. Note that the callback is *NOT* guaranteed to be called in all browsers. The first
   * argument to the callback is an error object that is falsy when there are no errors and
   * truthy when there are.
   * @param {boolean=} opt_async True if the stylesheet should be loaded asynchronously. Defaults to false.
   * @return {Element} The link element
   */
  DomHelper.prototype.loadStylesheet = function (href, opt_callback, opt_async) {
    var link = this.createElement('link', {
      'rel': 'stylesheet',
      'href': href,
      'media': (opt_async ? 'only x' : 'all')
    });

    var sheets = this.document_.styleSheets,
        eventFired = false,
        asyncResolved = !opt_async,
        callbackArg = null,
        callback = opt_callback || null;

    function mayInvokeCallback() {
      if (callback && eventFired && asyncResolved) {
        callback(callbackArg);
        callback = null;
      }
    }

    if (DomHelper.CAN_WAIT_STYLESHEET) {
      link.onload = function () {
        eventFired = true;
        mayInvokeCallback();
      };

      link.onerror = function () {
        eventFired = true;
        callbackArg = new Error('Stylesheet failed to load');
        mayInvokeCallback();
      };
    } else {
      // Some callers expect opt_callback being called asynchronously.
      setTimeout(function () {
        eventFired = true;
        mayInvokeCallback();
      }, 0);
    }

    function onStylesheetAvailable(callback) {
      for (var i = 0; i < sheets.length; i++) {
        if (sheets[i].href && sheets[i].href.indexOf(href) !== -1) {
          return callback();
        }
      }

      setTimeout(function () {
        onStylesheetAvailable(callback);
      }, 0);
    }

    function onMediaAvailable(callback) {
      for (var i = 0; i < sheets.length; i++) {
        if (sheets[i].href && sheets[i].href.indexOf(href) !== -1 && sheets[i].media) {
          /**
           * @type {string|MediaList|null}
           */
          var media = sheets[i].media;

          if (media === "all" || (media.mediaText && media.mediaText === "all")) {
            return callback();
          }
        }
      }

      setTimeout(function () {
        onMediaAvailable(callback);
      }, 0);
    }

    this.insertInto('head', link);

    if (opt_async) {
      onStylesheetAvailable(function () {
        link.media = "all";
        // The media type change doesn't take effect immediately on Chrome, so
        // we'll query the media attribute on the stylesheet until it changes
        // to "all".
        onMediaAvailable(function () {
          asyncResolved = true;
          mayInvokeCallback();
        });
      });
    }

    return link;
  };

  /**
   * Loads an external script file.
   * @param {string} src URL of the script.
   * @param {function(Error)=} opt_callback callback when the script has loaded. The first argument to
   * the callback is an error object that is falsy when there are no errors and truthy when there are.
   * @param {number=} opt_timeout The number of milliseconds after which the callback will be called
   * with a timeout error. Defaults to 5 seconds.
   * @return {Element} The script element
   */
  DomHelper.prototype.loadScript = function(src, opt_callback, opt_timeout) {
    var head = this.document_.getElementsByTagName('head')[0];

    if (head) {
      var script = this.createElement('script', {
        'src': src
      });
      var done = false;
      script.onload = script.onreadystatechange = function() {
        if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
          done = true;
          if (opt_callback) {
            opt_callback(null);
          }
          script.onload = script.onreadystatechange = null;
          // Avoid a bizarre issue with unclosed <base> tag in IE6 - http://blog.dotsmart.net/2008/04/
          if (script.parentNode.tagName == 'HEAD') head.removeChild(script);
        }
      };
      head.appendChild(script);

      setTimeout(function () {
        if (!done) {
          done = true;
          if (opt_callback) {
            opt_callback(new Error('Script load timeout'));
          }
        }
      }, opt_timeout || 5000);

      return script;
    }

    return null;
  };
});
