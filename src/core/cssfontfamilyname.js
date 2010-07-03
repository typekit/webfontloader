/**
 * @constructor
 */
webfont.CssFontFamilyName = function() {
  this.quote_ = '"';
};

webfont.CssFontFamilyName.prototype.quote = function(name) {
  var quoted = [];
  var split = name.split(/,\s*/);
  for (var i = 0; i < split.length; i++) {
    var part = split[i].replace(/['"]/g, '');
    if (part.indexOf(' ') == -1) {
      quoted.push(part);
    } else {
      quoted.push(this.quote_ + part + this.quote_);
    }
  }
  return quoted.join(',');
};
