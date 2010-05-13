webfont.CssClassName = function(opt_joinChar) {
  this.joinChar_ = opt_joinChar || webfont.CssClassName.DEFAULT_JOIN_CHAR;
};

webfont.CssClassName.DEFAULT_JOIN_CHAR = '-';

webfont.CssClassName.prototype.sanitize = function(name) {
  return name.replace(/[\W_]+/g, '').toLowerCase();
};

webfont.CssClassName.prototype.build = function(__args__) {
  var parts = []
  for (var i = 0; i < arguments.length; i++) {
    parts.push(this.sanitize(arguments[i]));
  }
  return parts.join(this.joinChar_);
};

