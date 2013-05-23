goog.provide('webfont.modules.Typekit');

goog.require('webfont.Font');

/**
 * @constructor
 * @implements {webfont.FontModule}
 */
webfont.modules.Typekit = function(domHelper, configuration) {
  this.domHelper_ = domHelper;
  this.configuration_ = configuration;
  this.fonts_ = [];
};

webfont.modules.Typekit.HOOK = '__webfonttypekitmodule__';

goog.scope(function () {
  var Typekit = webfont.modules.Typekit,
      Font = webfont.Font;

  Typekit.prototype.getScriptSrc = function(kitId) {
    var protocol = this.domHelper_.getProtocol();
    var api = this.configuration_['api'] || protocol + '//use.typekit.net';
    return api + '/' + kitId + '.js';
  };

  Typekit.prototype.supportUserAgent = function(userAgent, support) {
    var kitId = this.configuration_['id'];
    var configuration = this.configuration_;
    var loadWindow = this.domHelper_.getLoadWindow();
    var self = this;

    if (kitId) {
      // Provide data to Typekit for processing.main
      if (!loadWindow[Typekit.HOOK]) {
        loadWindow[Typekit.HOOK] = {};
      }

      // Typekit will call 'init' to indicate whether it supports fonts
      // and what fonts will be provided.
      loadWindow[Typekit.HOOK][kitId] = function(callback) {
        var init = function(typekitSupports, fontFamilies, fontVariations) {
          for (var i = 0; i < fontFamilies.length; i += 1) {
            var variations = fontVariations[fontFamilies[i]];

            if (variations) {
              for(var j = 0; j < variations.length; j += 1) {
                self.fonts_.push(new Font(fontFamilies[i], variations[j]));
              }
            } else {
              self.fonts_.push(new Font(fontFamilies[i]));
            }
          }
          support(typekitSupports);
        };
        callback(userAgent, configuration, init);
      };

      // Load the Typekit script.
      var script = this.domHelper_.createScriptSrc(this.getScriptSrc(kitId))
      this.domHelper_.insertInto('head', script);
    } else {
      support(true);
    }
  };

  Typekit.prototype.load = function(onReady) {
    onReady(this.fonts_);
  };
});
