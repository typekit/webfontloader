/**
*WebFont.load({
*    monotype: {
*        projectId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'///this is your Fonts.com Web fonts projectId
*    }
*});
*/

webfont.monotypeScript = function (global, domHelper, configuration) {
    this.global_ = global;
    this.domHelper_ = domHelper;
    this.configuration_ = configuration;
    this.fontFamilies_ = [];
    this.fontVariations_ = {};
};

webfont.monotypeScript.NAME = 'monotype';
webfont.monotypeScript.HOOK = '__monotypemodule__';

webfont.monotypeScript.prototype.getScriptSrc = function (projectId) {
    var p = (('https:' == document.location.protocol) ? 'https:' : 'http:');
    var api = this.configuration_['api'] || p + '//fast.fonts.com/jsapi';
    return api + '/' + projectId + '.js';
};

webfont.monotypeScript.prototype.supportUserAgent = function (userAgent, support) {
    var projectId = this.configuration_['projectId'];
    var configuration = this.configuration_;
    var self = this;
    if (projectId) {
        // Provide data to monotype for processing.
        if (!this.global_[webfont.monotypeScript.HOOK]) {
            this.global_[webfont.monotypeScript.HOOK] = {};
        }

        // monotype will call 'init' to indicate whether it supports fonts
        // and what fonts will be provided.
        this.global_[webfont.monotypeScript.HOOK][projectId] = function (callback) {
            var init = function (monotypeSupports, fontFamilies, fontVariations) {
                self.fontFamilies_ = fontFamilies;
                self.fontVariations_ = fontVariations;
                support(monotypeSupports);
            };
            callback(userAgent, configuration, init);
        };

        // Load the monotype script.
        document.write("<scr" + "ipt src='" + this.getScriptSrc(projectId) + "' type='text/javascript'>" + "</scr" + "ipt>");

    } else {
        support(true);
    }
};

webfont.monotypeScript.prototype.load = function (onReady) {
    onReady(this.fontFamilies_, this.fontVariations_);
};
WebFont.addModule(webfont.monotypeScript.NAME, function (configuration) {
    return new webfont.monotypeScript(window, new webfont.DomHelper(document), configuration);
});