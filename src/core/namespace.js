var webfont = {};

/**
 * @param {Object} context
 * @param {function(...)} func
 * @param {...*} opt_args
 */
webfont.bind = function(context, func, opt_args) {
  var args = arguments.length > 2 ?
      Array.prototype.slice.call(arguments, 2) : [];

  return function() {
    args.push.apply(args, arguments);
    return func.apply(context, args);
  };
};

webfont.extendsClass = function(baseClass, subClass) {

  // Avoid polluting the baseClass prototype object with methods from the
  // subClass
  /** @constructor */
  function baseExtendClass() {};
  baseExtendClass.prototype = baseClass.prototype;
  subClass.prototype = new baseExtendClass();

  subClass.prototype.constructor = subClass;
  subClass.superCtor_ = baseClass;
  subClass.super_ = baseClass.prototype;
};
