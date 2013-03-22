goog.provide('webfont.FontdeckScript');

goog.require('webfont.Font');

/**
 * @constructor
 * @implements {webfont.FontModule}
 */
webfont.FontdeckScript = function(domHelper, configuration) {
  this.domHelper_ = domHelper;
  this.configuration_ = configuration;
  this.fontFamilies_ = [];
  this.fontVariations_ = {};
};

webfont.FontdeckScript.NAME = 'fontdeck';
webfont.FontdeckScript.HOOK = '__webfontfontdeckmodule__';
webfont.FontdeckScript.API = '//f.fontdeck.com/s/css/js/';

goog.scope(function () {
  var FontdeckScript = webfont.FontdeckScript,
      Font = webfont.Font,
      FontVariationDescription = webfont.FontVariationDescription;

  FontdeckScript.prototype.getScriptSrc = function(projectId) {
    var protocol = this.domHelper_.getProtocol();
    // For empty iframes, fall back to main window's hostname.
    var hostname = this.domHelper_.getLoadWindow().location.hostname ||
        this.domHelper_.getMainWindow().location.hostname;
    var api = this.configuration_['api'] || webfont.FontdeckScript.API;
    return protocol + api + hostname + '/' + projectId + '.js';
  };

  FontdeckScript.prototype.supportUserAgent = function(userAgent, support) {
    var projectId = this.configuration_['id'];
    var loadWindow = this.domHelper_.getLoadWindow();
    var self = this;

    if (projectId) {
      // Provide data to Fontdeck for processing.
      if (!loadWindow[webfont.FontdeckScript.HOOK]) {
        loadWindow[webfont.FontdeckScript.HOOK] = {};
      }

      // Fontdeck will call this function to indicate support status
      // and what fonts are provided.
      loadWindow[webfont.FontdeckScript.HOOK][projectId] = function(fontdeckSupports, data) {
        for (var i = 0, j = data['fonts'].length; i<j; ++i) {
          var font = data['fonts'][i],
              m = null,
              weight = '4',
              style = 'n';

          m = font['style'].match(/(normal|oblique|italic)/i);

          if (m && m[1]) {
            style = m[1].substr(0, 1).toLowerCase();
          }

          m = font['weight'].match(/([1-9]00|normal|bold)/i);

          if (m && m[1]) {
            if (/bold/i.test(m[1])) {
              weight = 7;
            } else if (/[1-9]00/.test(weight[1])) {
              weight = parseInt(m[1].substr(0, 1), 10);
            }
          }

          self.fontFamilies_.push(new Font(font['name'], style + weight));
        }
        support(fontdeckSupports);
      };

      // Call the Fontdeck API.
      var script = this.domHelper_.createScriptSrc(this.getScriptSrc(projectId));
      this.domHelper_.insertInto('head', script);

    } else {
      support(true);
    }
  };

  FontdeckScript.prototype.load = function(onReady) {
    onReady(this.fontFamilies_);
  };
});

globalNamespaceObject.addModule(webfont.FontdeckScript.NAME, function(configuration, domHelper) {
  return new webfont.FontdeckScript(domHelper, configuration);
});
