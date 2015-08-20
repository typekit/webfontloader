goog.provide('webfont.modules.Typekit');

goog.require('webfont.Font');

/**
 * @constructor
 * @implements {webfont.FontModule}
 */
webfont.modules.Typekit = function(domHelper, configuration) {
  this.domHelper_ = domHelper;
  this.configuration_ = configuration;
};

/**
 * @const
 * @type {string}
 */
webfont.modules.Typekit.NAME = 'typekit';

goog.scope(function () {
  var Typekit = webfont.modules.Typekit,
      Font = webfont.Font;

  Typekit.prototype.getScriptSrc = function(kitId) {
    var api = this.configuration_['api'] || 'https://use.typekit.net';
    return api + '/' + kitId + '.js';
  };

  Typekit.prototype.load = function(onReady) {
    var kitId = this.configuration_['id'];
    var configuration = this.configuration_;
    var loadWindow = this.domHelper_.getLoadWindow();
    var that = this;

    if (kitId) {
      // Load the Typekit script. Once it is done loading we grab its configuration
      // and use that to populate the fonts we should watch.
      this.domHelper_.loadScript(this.getScriptSrc(kitId), function (err) {
        if (err) {
          onReady([]);
        } else {
          if (loadWindow['Typekit'] && loadWindow['Typekit']['config'] && loadWindow['Typekit']['config']['fn']) {
            var fn = loadWindow['Typekit']['config']['fn'],
                fonts = [];

            for (var i = 0; i < fn.length; i += 2) {
              var font = fn[i],
                  variations = fn[i + 1];

              for (var j = 0; j < variations.length; j++) {
                fonts.push(new Font(font, variations[j]));
              }
            }

            // Kick off font loading but disable font events so
            // we don't duplicate font watching.
            try {
              loadWindow['Typekit']['load']({
                'events': false,
                'classes': false,
                'async': true
              });
            } catch (e) {}

            onReady(fonts);
          }
        }
      }, 2000);
    } else {
      onReady([]);
    }
  };
});
