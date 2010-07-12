/**
webfont.load({
monotype: {
projectId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'///this is your Fonts.com Web fonts projectId
}
});
*/
//Register namespace for monotype.
webfont.monotype = {};

//class FontApi
webfont.monotype.FontApi = function (userAgent, docHelper, configuration) {
    this.userAgent_ = userAgent;
    this.docHelper_ = docHelper;
    this.configuration_ = configuration;
};

webfont.monotype.FontApi.NAME = 'monotype';
webfont.monotype.FontApi.HOOK = '__monotypemodule__';//not sure if it is used at all?

webfont.monotype.FontApi.prototype.supportUserAgent = function (userAgent, support) { //.P
	var configuration = this.configuration_;
	var self = this;
	return support(userAgent.isSupportingwebfont());
	//return support(true);
};

webfont.monotype.FontApi.prototype.getScriptSrc = function (projectId) {
    var p = (('https:' == this.docHelper_.protocol()) ? 'https:' : 'http:');
    var api = this.configuration_['api'] || p + '//fast.fonts.com/jsapi';
    return api + '/' + projectId + '.js';
};

webfont.monotype.FontApi.prototype.load = function (onReady) {
    var projectId = this.configuration_['projectId'];
    if (projectId) {

        /// To do:
        /// Research if font families and descriptions can be obtained from the script.
        this.docHelper_.write('<scr' + 'ipt src="' + this.getScriptSrc(projectId) + '" type="text/javascript">' + '</scr' + 'ipt>');

        this.fontFamilies_ = [];
        this.fontVariations_ = [];
        onReady(this.fontFamilies_, this.fontVariations_);
    }
};
//end class

//class DocumentHelper
webfont.monotype.DocumentHelper = function (doc) {
    this.doc_ = doc;
}

webfont.monotype.DocumentHelper.prototype.write = function (str) {
    this.doc_.write(str);
}

webfont.monotype.DocumentHelper.prototype.protocol = function () {
    if (this.doc_.location) {
        return this.doc_.location.protocol;
    }
    return "http:";
}
//end class

//Add monotype FontApi module to google webfonts
WebFont.addModule(webfont.monotype.FontApi.NAME, function(configuration) {
  var userAgentParser = new webfont.UserAgentParser(navigator.userAgent); //.e(navigator.userAgent);
  var userAgent = userAgentParser.parse();
  return new webfont.monotype.FontApi(userAgent,
      new webfont.monotype.DocumentHelper(document), configuration);
});