/**
 * @param {string} userAgent The browser userAgent string to parse.
 * @constructor
 */
webfont.UserAgentParser = function(userAgent, doc) {
  this.userAgent_ = userAgent;
  this.doc_ = doc;
};

/**
 * @const
 * @type {string}
 */
webfont.UserAgentParser.UNKNOWN = "Unknown";

/**
 * @const
 * @type {webfont.UserAgent}
 */
webfont.UserAgentParser.UNKNOWN_USER_AGENT = new webfont.UserAgent(
    webfont.UserAgentParser.UNKNOWN,
    webfont.UserAgentParser.UNKNOWN,
    webfont.UserAgentParser.UNKNOWN,
    webfont.UserAgentParser.UNKNOWN,
    webfont.UserAgentParser.UNKNOWN,
    webfont.UserAgentParser.UNKNOWN,
    undefined,
    false);

/**
 * Parses the user agent string and returns an object.
 * @return {webfont.UserAgent}
 */
webfont.UserAgentParser.prototype.parse = function() {
  if (this.isIe_()) {
    return this.parseIeUserAgentString_();
  } else if (this.isOpera_()) {
    return this.parseOperaUserAgentString_();
  } else if (this.isWebKit_()) {
    return this.parseWebKitUserAgentString_();
  } else if (this.isGecko_()) {
    return this.parseGeckoUserAgentString_();
  } else {
    return webfont.UserAgentParser.UNKNOWN_USER_AGENT;
  }
};

/**
 * @private
 */
webfont.UserAgentParser.prototype.getPlatform_ = function() {
  var mobileOs = this.getMatchingGroup_(this.userAgent_,
      /(iPod|iPad|iPhone|Android|Windows Phone)/, 1);

  if (mobileOs != "") {
    return mobileOs;
  }
  var os = this.getMatchingGroup_(this.userAgent_,
      /(Linux|Mac_PowerPC|Macintosh|Windows|CrOS)/, 1);

  if (os != "") {
    if (os == "Mac_PowerPC") {
      os = "Macintosh";
    }
    return os;
  }
  return webfont.UserAgentParser.UNKNOWN;
};

/**
 * @private
 */
webfont.UserAgentParser.prototype.getPlatformVersion_ = function() {
  var genericVersion = this.getMatchingGroup_(this.userAgent_,
      /(OS X|Windows NT|Android|CrOS) ([^;)]+)/, 2);
  if (genericVersion) {
    return genericVersion;
  }
  var winPhoneVersion = this.getMatchingGroup_(this.userAgent_,
      /Windows Phone( OS)? ([^;)]+)/, 2);
  if (winPhoneVersion) {
    return winPhoneVersion;
  }
  var iVersion = this.getMatchingGroup_(this.userAgent_,
      /(iPhone )?OS ([\d_]+)/, 2);
  if (iVersion) {
    return iVersion;
  }
  var linuxVersion = this.getMatchingGroup_(this.userAgent_,
      /Linux ([i\d]+)/, 1);
  if (linuxVersion) {
    return linuxVersion;
  }

  return webfont.UserAgentParser.UNKNOWN;
};

/**
 * @private
 */
webfont.UserAgentParser.prototype.isIe_ = function() {
  return this.userAgent_.indexOf("MSIE") != -1;
};

/**
 * @private
 */
webfont.UserAgentParser.prototype.parseIeUserAgentString_ = function() {
  // For IE we give MSIE as the engine name and the version of IE
  // instead of the specific Trident engine name and version

  var platform = this.getPlatform_();
  var platformVersion = this.getPlatformVersion_();

  var browser = this.getMatchingGroup_(this.userAgent_, /(MSIE [\d\w\.]+)/, 1);

  if (browser != "") {
    var pair = browser.split(' ');
    var name = pair[0];
    var version = pair[1];
    var majorVersion = this.getMajorVersion_(version);
    var majorPlatformVersion = this.getMajorVersion_(platformVersion);

    var supportWebFont = (platform == "Windows" && majorVersion >= 6) ||
        (platform == "Windows Phone" && majorPlatformVersion >= 8);

    return new webfont.UserAgent(name, version, name, version,
        platform, platformVersion, this.getDocumentMode_(this.doc_),
        supportWebFont);
  }

  return new webfont.UserAgent("MSIE", webfont.UserAgentParser.UNKNOWN,
      "MSIE", webfont.UserAgentParser.UNKNOWN,
      platform, platformVersion, this.getDocumentMode_(this.doc_), false);
};

/**
 * @private
 */
webfont.UserAgentParser.prototype.isOpera_ = function() {
  return this.userAgent_.indexOf("Opera") != -1;
};

/**
 * @private
 */
webfont.UserAgentParser.prototype.parseOperaUserAgentString_ = function() {
  var engineName = webfont.UserAgentParser.UNKNOWN;
  var engineVersion = webfont.UserAgentParser.UNKNOWN;
  var enginePair = this.getMatchingGroup_(this.userAgent_,
      /(Presto\/[\d\w\.]+)/, 1);

  if (enginePair != "") {
    var splittedEnginePair = enginePair.split('/');

    engineName = splittedEnginePair[0];
    engineVersion = splittedEnginePair[1];
  } else {
    if (this.userAgent_.indexOf("Gecko") != -1) {
      engineName = "Gecko";
    }
    var geckoVersion = this.getMatchingGroup_(this.userAgent_, /rv:([^\)]+)/, 1);

    if (geckoVersion != "") {
      engineVersion = geckoVersion;
    }
  }

  // Check for Opera Mini first, since it looks like normal Opera
  if (this.userAgent_.indexOf("Opera Mini/") != -1) {
    var version = this.getMatchingGroup_(this.userAgent_, /Opera Mini\/([\d\.]+)/, 1);

    if (version == "") {
      version = webfont.UserAgentParser.UNKNOWN;
    }

    return new webfont.UserAgent("OperaMini", version, engineName,
        engineVersion, this.getPlatform_(), this.getPlatformVersion_(),
        this.getDocumentMode_(this.doc_), false);
  }

  // Otherwise, find version information for normal Opera or Opera Mobile
  if (this.userAgent_.indexOf("Version/") != -1) {
    var version = this.getMatchingGroup_(this.userAgent_, /Version\/([\d\.]+)/, 1);

    if (version != "") {
      return new webfont.UserAgent("Opera", version, engineName, engineVersion,
          this.getPlatform_(), this.getPlatformVersion_(),
          this.getDocumentMode_(this.doc_), this.getMajorVersion_(version) >= 10);
    }
  }
  var version = this.getMatchingGroup_(this.userAgent_, /Opera[\/ ]([\d\.]+)/, 1);

  if (version != "") {
    return new webfont.UserAgent("Opera", version, engineName, engineVersion,
        this.getPlatform_(), this.getPlatformVersion_(),
        this.getDocumentMode_(this.doc_), this.getMajorVersion_(version) >= 10);
  }
  return new webfont.UserAgent("Opera", webfont.UserAgentParser.UNKNOWN,
      engineName, engineVersion, this.getPlatform_(),
      this.getPlatformVersion_(), this.getDocumentMode_(this.doc_), false);
};

/**
 * @private
 */
webfont.UserAgentParser.prototype.isWebKit_ = function() {
  return this.userAgent_.indexOf("AppleWebKit") != -1;
};

/**
 * @private
 */
webfont.UserAgentParser.prototype.parseWebKitUserAgentString_ = function() {
  var platform = this.getPlatform_();
  var platformVersion = this.getPlatformVersion_();
  var webKitVersion = this.getMatchingGroup_(this.userAgent_,
      /AppleWebKit\/([\d\.\+]+)/, 1);

  if (webKitVersion == "") {
    webKitVersion = webfont.UserAgentParser.UNKNOWN;
  }
  var name = webfont.UserAgentParser.UNKNOWN;

  if (this.userAgent_.indexOf("Chrome") != -1 || this.userAgent_.indexOf("CrMo") != -1 || this.userAgent_.indexOf("CriOS") != -1) {
    name = "Chrome";
  } else if (this.userAgent_.indexOf("Safari") != -1) {
    name = "Safari";
  } else if (this.userAgent_.indexOf("AdobeAIR") != -1) {
    name = "AdobeAIR";
  }
  var version = webfont.UserAgentParser.UNKNOWN;

  if (this.userAgent_.indexOf("Version/") != -1) {
    version = this.getMatchingGroup_(this.userAgent_,
        /Version\/([\d\.\w]+)/, 1);
  } else if (name == "Chrome") {
    version = this.getMatchingGroup_(this.userAgent_,
        /(Chrome|CrMo|CriOS)\/([\d\.]+)/, 2);
  } else if (name == "AdobeAIR") {
    version = this.getMatchingGroup_(this.userAgent_,
        /AdobeAIR\/([\d\.]+)/, 1);
  }
  var supportWebFont = false;
  if (name == "AdobeAIR") {
    var minor = this.getMatchingGroup_(version, /\d+\.(\d+)/, 1);
    supportWebFont = this.getMajorVersion_(version) > 2 ||
      this.getMajorVersion_(version) == 2 && parseInt(minor, 10) >= 5;
  } else {
    var minor = this.getMatchingGroup_(webKitVersion, /\d+\.(\d+)/, 1);
    supportWebFont = this.getMajorVersion_(webKitVersion) >= 526 ||
      this.getMajorVersion_(webKitVersion) >= 525 && parseInt(minor, 10) >= 13;
  }

  return new webfont.UserAgent(name, version, "AppleWebKit", webKitVersion,
      platform, platformVersion, this.getDocumentMode_(this.doc_), supportWebFont);
};

/**
 * @private
 */
webfont.UserAgentParser.prototype.isGecko_ = function() {
  return this.userAgent_.indexOf("Gecko") != -1;
};

/**
 * @private
 */
webfont.UserAgentParser.prototype.parseGeckoUserAgentString_ = function() {
  var name = webfont.UserAgentParser.UNKNOWN;
  var version = webfont.UserAgentParser.UNKNOWN;
  var supportWebFont = false;

  if (this.userAgent_.indexOf("Firefox") != -1) {
    name = "Firefox";
    var versionNum = this.getMatchingGroup_(this.userAgent_,
        /Firefox\/([\d\w\.]+)/, 1);

    if (versionNum != "") {
      var minor = this.getMatchingGroup_(versionNum, /\d+\.(\d+)/, 1);

      version = versionNum;
      supportWebFont = versionNum != "" && this.getMajorVersion_(versionNum) >= 3 &&
          parseInt(minor, 10) >= 5;
    }
  } else if (this.userAgent_.indexOf("Mozilla") != -1) {
    name = "Mozilla";
  }
  var geckoVersion = this.getMatchingGroup_(this.userAgent_, /rv:([^\)]+)/, 1);

  if (geckoVersion == "") {
    geckoVersion = webfont.UserAgentParser.UNKNOWN;
  } else {
    if (!supportWebFont) {
      var majorVersion = this.getMajorVersion_(geckoVersion);
      var intMinorVersion = parseInt(this.getMatchingGroup_(geckoVersion, /\d+\.(\d+)/, 1), 10);
      var subVersion = parseInt(this.getMatchingGroup_(geckoVersion, /\d+\.\d+\.(\d+)/, 1), 10);

      supportWebFont = majorVersion > 1 ||
          majorVersion == 1 && intMinorVersion > 9 ||
          majorVersion == 1 && intMinorVersion == 9 && subVersion >= 2 ||
          geckoVersion.match(/1\.9\.1b[123]/) != null ||
          geckoVersion.match(/1\.9\.1\.[\d\.]+/) != null;
    }
  }
  return new webfont.UserAgent(name, version, "Gecko", geckoVersion,
      this.getPlatform_(), this.getPlatformVersion_(), this.getDocumentMode_(this.doc_),
      supportWebFont);
};

/**
 * @private
 */
webfont.UserAgentParser.prototype.getMajorVersion_ = function(version) {
  var majorVersion = this.getMatchingGroup_(version, /(\d+)/, 1);

  if (majorVersion != "") {
    return parseInt(majorVersion, 10);
  }
  return -1;
};

/**
 * @private
 */
webfont.UserAgentParser.prototype.getMatchingGroup_ = function(str,
    regexp, index) {
  var groups = str.match(regexp);

  if (groups && groups[index]) {
    return groups[index];
  }
  return "";
};

/**
 * @private
 */
webfont.UserAgentParser.prototype.getDocumentMode_ = function(doc) {
  if (doc.documentMode) return doc.documentMode;
  return undefined;
};
