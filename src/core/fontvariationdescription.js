webfont.FontVariationDescription = function() {
  this.properties_ = webfont.FontVariationDescription.PROPERTIES;
  this.values_ = webfont.FontVariationDescription.VALUES;
};

webfont.FontVariationDescription.PROPERTIES = [
  'font-style',
  'font-weight'
];

webfont.FontVariationDescription.VALUES = {
  'font-style': [
    ['n', 'normal'],
    ['i', 'italic'],
    ['o', 'oblique']
  ],
  'font-weight': [
    ['1', '100'],
    ['2', '200'],
    ['3', '300'],
    ['4', '400'],
    ['5', '500'],
    ['6', '600'],
    ['7', '700'],
    ['8', '800'],
    ['9', '900'],
    ['4', 'normal'],
    ['7', 'bold']
  ]
};

webfont.FontVariationDescription.Item = function(index, property, values) {
  this.index_ = index;
  this.property_ = property;
  this.values_ = values;
}

webfont.FontVariationDescription.Item.prototype.compact = function(output, value) {
  for (var i = 0; i < this.values_.length; i++) {
    if (value == this.values_[i][1]) {
      output[this.index_] = this.values_[i][0];
      return;
    }
  }
}

webfont.FontVariationDescription.Item.prototype.expand = function(output, value) {
  for (var i = 0; i < this.values_.length; i++) {
    if (value == this.values_[i][0]) {
      output[this.index_] = this.property_ + ':' + this.values_[i][1];
      return;
    }
  }
}

webfont.FontVariationDescription.prototype.compact = function(input) {
  var result = ['n', '4'];
  var descriptors = input.split(';');

  for (var i = 0, len = descriptors.length; i < len; i++) {
    var pair = descriptors[i].replace(/\s+/g, '').split(':');
    if (pair.length == 2) {
      var property = pair[0];
      var value = pair[1];
      var item = this.getItem_(property);
      if (item) {
        item.compact(result, value);
      }
    }
  }

  return result.join('');
};

webfont.FontVariationDescription.prototype.expand = function(fvd) {
  if (fvd.length != 2) {
    return null;
  }

  var result = [null, null];

  for (var i = 0, len = this.properties_.length; i < len; i++) {
    var property = this.properties_[i];
    var key = fvd.substr(i, 1);
    var values = this.values_[property];
    var item = new webfont.FontVariationDescription.Item(i, property, values);
    item.expand(result, key);
  }

  if (result[0] && result[1]) {
    return result.join(';') + ';';
  } else {
    return null;
  }
}

webfont.FontVariationDescription.prototype.getItem_ = function(property) {
  for (var i = 0; i < this.properties_.length; i++) {
    if (property == this.properties_[i]) {
      var values = this.values_[property];
      return new webfont.FontVariationDescription.Item(i, property, values);
    }
  }

  return null;
};
