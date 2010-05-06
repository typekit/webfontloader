/**
 *
 * WebFont.load({
 *   default: { families: ['Font1', 'Font2'],
 *       urls: [ 'http://moo', 'http://meuh' ] }
 * });
 */
webfont.DefaultModule = function(domHelper, configuration) {
  this.domHelper_ = domHelper;
  this.configuration_ = configuration;
};

webfont.DefaultModule.prototype.load = function(onReady) {
  var urls = this.configuration_.urls;
  var length = urls.length;

  for (var i = 0; i < length; i++) {
    var url = urls[i];

    this.domHelper_.insertInto('head', this.domHelper_.createCssLink(url));
  }
  onReady(this.configuration_.families);
};

WebFont.addModule('default', function(configuration) {
  return new webfont.DefaultModule(new webfont.DomHelper(document),
      configuration);
});
