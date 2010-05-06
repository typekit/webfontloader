webfont = {};

webfont.bind = function(context, func, opt_args) {
  var args = arguments.length > 2 ?
      Array.prototype.slice.call(arguments, 2) : [];

  return function() {
    args.push.apply(args, arguments);
    return func.apply(context, args);
  };
};
