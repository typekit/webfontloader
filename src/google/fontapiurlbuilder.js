webfont.FontApiUrlBuilder = function(apiUrl) {
  this.apiUrl_ = apiUrl || webfont.FontApiUrlBuilder.DEFAULT_API_URL;
  this.fontFamilies_ = null;
};

webfont.FontApiUrlBuilder.DEFAULT_API_URL = '//fonts.googleapis.com/css';

webfont.FontApiUrlBuilder.prototype.setFontFamilies = function(fontFamilies) {
  // maybe clone?
  this.fontFamilies_ = fontFamilies;
};

webfont.FontApiUrlBuilder.prototype.webSafe = function(string) {
  return string.replace(/ /g, '+');
};

webfont.FontApiUrlBuilder.prototype.build = function() {
  if (!this.fontFamilies_) {
    throw new Error('No fonts to load !');
  }
  var length = this.fontFamilies_.length;
  var sb = [];

  for (var i = 0; i < length; i++) {
    sb.push(this.webSafe(this.fontFamilies_[i]));
  }
  var url = this.apiUrl_ + '?family=' + sb.join('%7C'); // '|' escaped.

  return url;
};
