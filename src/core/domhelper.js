/**
 * Handles common DOM manipulation tasks. The aim of this library is to cover
 * the needs of typical font loading. Not more, not less.
 * @param {HTMLDocument} doc The HTML document we'll manipulate.
 * @constructor
 */
webfont.DomHelper = function(doc) {
  this.document_ = doc;

  /** @type boolean|undefined */
  this.supportForStyle_ = undefined;
};

/**
 * Creates an element.
 * @param {string} elem The element type.
 * @param {Object=} opt_attr A hash of attribute key/value pairs.
 * @param {string=} opt_innerHtml Contents of the element.
 * @return {Element} the new element.
 */
webfont.DomHelper.prototype.createElement = function(elem, opt_attr,
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
webfont.DomHelper.prototype.insertInto = function(tagName, e) {
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
webfont.DomHelper.prototype.whenBodyExists = function(callback) {
  var check = function() {
    if (document.body) {
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
webfont.DomHelper.prototype.removeElement = function(node) {
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
webfont.DomHelper.prototype.createCssLink = function(src) {
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
webfont.DomHelper.prototype.createScriptSrc = function(src) {
  return this.createElement('script', {
    'src': src
  });
};

/**
 * Appends a name to an element's class attribute.
 * @param {Element} e The element.
 * @param {string} name The class name to add.
 */
webfont.DomHelper.prototype.appendClassName = function(e, name) {
  var classes = e.className.split(/\s+/);
  for (var i = 0, len = classes.length; i < len; i++) {
    if (classes[i] == name) {
      return;
    }
  }
  classes.push(name);
  e.className = classes.join(' ').replace(/^\s+/, '');
};

/**
 * Removes a name to an element's class attribute.
 * @param {Element} e The element.
 * @param {string} name The class name to remove.
 */
webfont.DomHelper.prototype.removeClassName = function(e, name) {
  var classes = e.className.split(/\s+/);
  var remainingClasses = [];
  for (var i = 0, len = classes.length; i < len; i++) {
    if (classes[i] != name) {
      remainingClasses.push(classes[i]);
    }
  }
  e.className = remainingClasses.join(' ').replace(/^\s+/, '')
      .replace(/\s+$/, '');
};

/**
 * Returns true if an element has a given class name and false otherwise.
 * @param {Element} e The element.
 * @param {string} name The class name to check for.
 * @return {boolean} Whether or not the element has this class name.
 */
webfont.DomHelper.prototype.hasClassName = function(e, name) {
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
webfont.DomHelper.prototype.setStyle = function(e, styleString) {
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
webfont.DomHelper.prototype.hasSupportForStyle_ = function() {
  if (this.supportForStyle_ === undefined) {
    var e = this.document_.createElement('p');
    e.innerHTML = '<a style="top:1px;">w</a>';
    this.supportForStyle_ = /top/.test(e.getElementsByTagName('a')[0].getAttribute('style'));
  }
  return this.supportForStyle_
};
