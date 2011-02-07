/**
 * @constructor
 */
webfont.FontdeckScript = function(global, domHelper, configuration) {
  this.global_ = global;
  this.domHelper_ = domHelper;
  this.configuration_ = configuration;
  this.fontFamilies_ = [];
  this.fontVariations_ = {};
  this.fvd_ = new webfont.FontVariationDescription();
};

webfont.FontdeckScript.NAME = 'fontdeck';
webfont.FontdeckScript.HOOK = '__webfontfontdeckmodule__';
webfont.FontdeckScript.API = 'http://fontdeck.com/api/v1/project-info?'

webfont.FontdeckScript.prototype.getScriptSrc = function(projectId) {
  var api = this.configuration_['api'] || webfont.FontdeckScript.API;
  return api + 'project=' + projectId + '&domain=' + document.location.hostname + '&callback=window.__webfontfontdeckmodule__[' + projectId + ']';
};

webfont.FontdeckScript.prototype.supportUserAgent = function(userAgent, support) {
  var projectId = this.configuration_['id'];
  var families = this.configuration_['families'] || null;
  var self = this;

  if (projectId) {
    // Provide data to Fontdeck for processing.
    if (!this.global_[webfont.FontdeckScript.HOOK]) {
      this.global_[webfont.FontdeckScript.HOOK] = {};
    }

    // The API will call this function with a link to the CSS
    // and a list of supported fonts.
    this.global_[webfont.FontdeckScript.HOOK][projectId] = function(data) {
      self.domHelper_.insertInto('head', self.domHelper_.createCssLink(data['css']));
        for (var i = 0, j = data['provides'].length; i < j; ++i) {
          var font = data['provides'][i];
          self.fontFamilies_.push(font['name']);
          self.fontVariations_[font['name']] = [self.fvd_.compact("font-weight:" + font['weight'] + ";font-style:" +  font['style'])];
        }
        // If families were passed into load, then use them instead.
        if (families !== null) {
          self.fontFamilies_ = families;
        }
      support(true);
    };

    // Call the Fontdeck API.
    var script = this.domHelper_.createScriptSrc(this.getScriptSrc(projectId));
    this.domHelper_.insertInto('head', script);

  } else {
    support(true);
  }
};

webfont.FontdeckScript.prototype.load = function(onReady) {
  onReady(this.fontFamilies_, this.fontVariations_);
};

window['WebFont'].addModule(webfont.FontdeckScript.NAME, function(configuration) {
  var userAgentParser = new webfont.UserAgentParser(navigator.userAgent, document);
  var userAgent = userAgentParser.parse();
  var domHelper = new webfont.DomHelper(document, userAgent);
  return new webfont.FontdeckScript(window, domHelper, configuration);
});