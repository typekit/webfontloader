goog.provide('webfont.modules.Fontdeck');

goog.require('webfont.Font');

/**
 * @constructor
 * @implements {webfont.FontModule}
 */
webfont.modules.Fontdeck = function(domHelper, configuration) {
  this.domHelper_ = domHelper;
  this.configuration_ = configuration;
  this.fonts_ = [];
};

/**
 * @const
 * @type {string}
 */
webfont.modules.Fontdeck.NAME = 'fontdeck';
webfont.modules.Fontdeck.HOOK = '__webfontfontdeckmodule__';
webfont.modules.Fontdeck.API = 'https://f.fontdeck.com/s/css/js/';

goog.scope(function () {
  var Fontdeck = webfont.modules.Fontdeck,
      Font = webfont.Font,
      FontVariationDescription = webfont.FontVariationDescription;

  Fontdeck.prototype.getScriptSrc = function(projectId) {
    // For empty iframes, fall back to main window's hostname.
    var hostname = this.domHelper_.getHostName();
    var api = this.configuration_['api'] || webfont.modules.Fontdeck.API;
    return api + hostname + '/' + projectId + '.js';
  };

  Fontdeck.prototype.load = function(onReady) {
    var projectId = this.configuration_['id'];
    var loadWindow = this.domHelper_.getLoadWindow();
    var self = this;

    if (projectId) {
      // Provide data to Fontdeck for processing.
      if (!loadWindow[webfont.modules.Fontdeck.HOOK]) {
        loadWindow[webfont.modules.Fontdeck.HOOK] = {};
      }

      // Fontdeck will call this function to indicate support status
      // and what fonts are provided.
      loadWindow[webfont.modules.Fontdeck.HOOK][projectId] = function(fontdeckSupports, data) {
        for (var i = 0, j = data['fonts'].length; i<j; ++i) {
          var font = data['fonts'][i];
          self.fonts_.push(new Font(font['name'], Font.parseCssVariation('font-weight:' + font['weight'] + ';font-style:' + font['style'])));
        }
        onReady(self.fonts_);
      };

      // Call the Fontdeck API.
      this.domHelper_.loadScript(this.getScriptSrc(projectId), function (err) {
        if (err) {
          onReady([]);
        }
      });
    } else {
      onReady([]);
    }
  };
});
