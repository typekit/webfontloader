goog.provide('webfont.TypekitScript');

goog.require('webfont.FontVariationDescription');
goog.require('webfont.Font');

/**
 * @constructor
 * @implements {webfont.FontModule}
 */
webfont.TypekitScript = function(domHelper, configuration) {
  this.domHelper_ = domHelper;
  this.configuration_ = configuration;
  this.fontFamilies_ = [];
};

webfont.TypekitScript.NAME = 'typekit';
webfont.TypekitScript.HOOK = '__webfonttypekitmodule__';

goog.scope(function () {
  var TypekitScript = webfont.TypekitScript,
      FontVariationDescription = webfont.FontVariationDescription,
      Font = webfont.Font;

  TypekitScript.prototype.getScriptSrc = function(kitId) {
    var protocol = this.domHelper_.getProtocol();
    var api = this.configuration_['api'] || protocol + '//use.typekit.net';
    return api + '/' + kitId + '.js';
  };

  TypekitScript.prototype.supportUserAgent = function(userAgent, support) {
    var kitId = this.configuration_['id'];
    var configuration = this.configuration_;
    var loadWindow = this.domHelper_.getLoadWindow();
    var self = this;

    if (kitId) {
      // Provide data to Typekit for processing.main
      if (!loadWindow[webfont.TypekitScript.HOOK]) {
        loadWindow[webfont.TypekitScript.HOOK] = {};
      }

      // Typekit will call 'init' to indicate whether it supports fonts
      // and what fonts will be provided.
      loadWindow[webfont.TypekitScript.HOOK][kitId] = function(callback) {
        var init = function(typekitSupports, fontFamilies, fontVariations) {
          for (var i = 0; i < fontFamilies.length; i += 1) {
            var variations = fontVariations[fontFamilies[i]];

            if (variations) {
              for(var j = 0; j < variations.length; j += 1) {
                self.fontFamilies_.push(new Font(fontFamilies[i], new FontVariationDescription(variations[j])));
              }
            } else {
              self.fontFamilies_.push(new Font(fontFamilies[i]));
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

  TypekitScript.prototype.load = function(onReady) {
    onReady(this.fontFamilies_);
  };
});

globalNamespaceObject.addModule(webfont.TypekitScript.NAME, function(configuration, domHelper) {
  return new webfont.TypekitScript(domHelper, configuration);
});
