/**
 * @constructor
 */
webfont.UserAgentParser = function(userAgent) {
  this.userAgent_ = userAgent;
};

webfont.UserAgentParser.UNKNOWN = "Unknown";

webfont.UserAgentParser.UNKNOWN_USER_AGENT = new webfont.UserAgent(webfont.UserAgentParser.UNKNOWN,
    webfont.UserAgentParser.UNKNOWN, webfont.UserAgentParser.UNKNOWN, webfont.UserAgentParser.UNKNOWN, false);

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

webfont.UserAgentParser.prototype.getPlatform_ = function() {
  var mobileOs = this.getFirstMatchingGroup_(this.userAgent_,
      /(iPod|iPad|iPhone|Android)/);

  if (mobileOs != "") {
    return mobileOs;
  }
  var os = this.getFirstMatchingGroup_(this.userAgent_,
      /(Linux|Mac_PowerPC|Macintosh|Windows)/);

  if (os != "") {
    if (os == "Mac_PowerPC") {
      os = "Macintosh";
    }
    return os;
  }
  return webfont.UserAgentParser.UNKNOWN;
};

webfont.UserAgentParser.prototype.getPlatformVersion_ = function() {
  var macVersion = this.getFirstMatchingGroup_(this.userAgent_,
      /OS X ([^;]+)/);
  if (macVersion) {
    return macVersion;
  }
  var ppcVersion = this.getFirstMatchingGroup_(this.userAgent_,
      /(Mac_PowerPC)/);
  if (ppcVersion) {
    return ppcVersion;
  }
  var winVersion = this.getFirstMatchingGroup_(this.userAgent_,
      /Windows NT ([^;]+)/);
  if (winVersion) {
    return winVersion;
  }
  var linuxVersion = this.getFirstMatchingGroup_(this.userAgent_,
      /Linux ([i\d]+)/);
  if (linuxVersion) {
    return linuxVersion;
  }
  var iVersion = this.getMatchingGroup_(this.userAgent_,
      /(iPhone )?OS ([\d_]+)/, 2);
  if (iVersion) {
    return iVersion;
  }
  var androidVersion = this.getFirstMatchingGroup_(this.userAgent_,
      /Android ([^;]+)/);
  if (androidVersion) {
    return androidVersion;
  }

  return webfont.UserAgentParser.UNKNOWN;
};

webfont.UserAgentParser.prototype.isIe_ = function() {
  return this.userAgent_.indexOf("MSIE") != -1;
};

webfont.UserAgentParser.prototype.parseIeUserAgentString_ = function() {
  var browser = this.getFirstMatchingGroup_(this.userAgent_, /(MSIE [\d\w\.]+)/);
  var engineName = webfont.UserAgentParser.UNKNOWN;
  var engineVersion = webfont.UserAgentParser.UNKNOWN;

  if (browser != "") {
    var pair = browser.split(' ');
    var name = pair[0];
    var version = pair[1];

    // For IE we give MSIE as the engine name and the version of IE
    // instead of the specific Trident engine name and version
    return new webfont.UserAgent(name, version, name, version,
        this.getPlatform_(), this.getPlatformVersion_(), this.getMajorVersion_(version) >= 6);
  }
  return new webfont.UserAgent("MSIE", webfont.UserAgentParser.UNKNOWN,
      "MSIE", webfont.UserAgentParser.UNKNOWN,
      this.getPlatform_(), this.getPlatformVersion_(), false);
};

webfont.UserAgentParser.prototype.isOpera_ = function() {
  return this.userAgent_.indexOf("Opera") != -1;
};

webfont.UserAgentParser.prototype.parseOperaUserAgentString_ = function() {
  var engineName = webfont.UserAgentParser.UNKNOWN;
  var engineVersion = webfont.UserAgentParser.UNKNOWN;
  var enginePair = this.getFirstMatchingGroup_(this.userAgent_,
      /(Presto\/[\d\w\.]+)/);

  if (enginePair != "") {
    var splittedEnginePair = enginePair.split('/');

    engineName = splittedEnginePair[0];
    engineVersion = splittedEnginePair[1];
  } else {
    if (this.userAgent_.indexOf("Gecko") != -1) {
      engineName = "Gecko";
    }
    var geckoVersion = this.getFirstMatchingGroup_(this.userAgent_, /rv:([^\)]+)/);

    if (geckoVersion != "") {
      engineVersion = geckoVersion;
    }
  }
  if (this.userAgent_.indexOf("Version/") != -1) {
    var version = this.getFirstMatchingGroup_(this.userAgent_, /Version\/([\d\.]+)/);

    if (version != "") {
      return new webfont.UserAgent("Opera", version, engineName, engineVersion,
          this.getPlatform_(), this.getPlatformVersion_(),
          this.getMajorVersion_(version) >= 10);
    }
  }
  var version = this.getFirstMatchingGroup_(this.userAgent_, /Opera[\/ ]([\d\.]+)/);

  if (version != "") {
    return new webfont.UserAgent("Opera", version, engineName, engineVersion,
        this.getPlatform_(), this.getPlatformVersion_(), 
        this.getMajorVersion_(version) >= 10);
  }
  return new webfont.UserAgent("Opera", webfont.UserAgentParser.UNKNOWN,
      engineName, engineVersion, 
      this.getPlatform_(), this.getPlatformVersion_(), false);
};

webfont.UserAgentParser.prototype.isWebKit_ = function() {
  return this.userAgent_.indexOf("AppleWebKit") != -1;
};

webfont.UserAgentParser.prototype.parseWebKitUserAgentString_ = function() {
  var platform = this.getPlatform_();
  var platformVersion = this.getPlatformVersion_();
  var webKitVersion = this.getFirstMatchingGroup_(this.userAgent_,
      /AppleWebKit\/([\d\.\+]+)/);

  if (webKitVersion == "") {
    webKitVersion = webfont.UserAgentParser.UNKNOWN;
  }
  var name = webfont.UserAgentParser.UNKNOWN;

  if (this.userAgent_.indexOf("Chrome") != -1) {
    name = "Chrome";
  } else if (this.userAgent_.indexOf("Safari") != -1) {
    name = "Safari";
  }
  var version = webfont.UserAgentParser.UNKNOWN;

  if (this.userAgent_.indexOf("Version/") != -1) {
    version = this.getFirstMatchingGroup_(this.userAgent_,
        /Version\/([\d\.\w]+)/);
  } else if (name == "Chrome") {
    version = this.getFirstMatchingGroup_(this.userAgent_,
        /Chrome\/([\d\.]+)/);
  }
  var minor = this.getFirstMatchingGroup_(webKitVersion, /\d+\.(\d+)/);

  return new webfont.UserAgent(name, version, "AppleWebKit", webKitVersion,
      platform, platformVersion, this.getMajorVersion_(webKitVersion) >= 526 ||
      this.getMajorVersion_(webKitVersion) >= 525 && parseInt(minor) >= 13);
};

webfont.UserAgentParser.prototype.isGecko_ = function() {
  return this.userAgent_.indexOf("Gecko") != -1;
};

webfont.UserAgentParser.prototype.parseGeckoUserAgentString_ = function() {
  var name = webfont.UserAgentParser.UNKNOWN;
  var version = webfont.UserAgentParser.UNKNOWN;
  var supportWebFont = false;

  if (this.userAgent_.indexOf("Firefox") != -1) {
    name = "Firefox";
    var versionNum = this.getFirstMatchingGroup_(this.userAgent_,
        /Firefox\/([\d\w\.]+)/);

    if (versionNum != "") {
      var minor = this.getFirstMatchingGroup_(versionNum, /\d+\.(\d+)/);

      version = versionNum;
      supportWebFont = versionNum != "" && this.getMajorVersion_(versionNum) >= 3 &&
          parseInt(minor) >= 5;
    }
  } else if (this.userAgent_.indexOf("Mozilla") != -1) {
    name = "Mozilla";
  }
  var geckoVersion = this.getFirstMatchingGroup_(this.userAgent_, /rv:([^\)]+)/);

  if (geckoVersion == "") {
    geckoVersion = webfont.UserAgentParser.UNKNOWN;
  } else {
    if (!supportWebFont) {
      var majorVersion = this.getMajorVersion_(geckoVersion);
      var intMinorVersion = parseInt(this.getFirstMatchingGroup_(geckoVersion, /\d+\.(\d+)/));
      var subVersion = parseInt(this.getFirstMatchingGroup_(geckoVersion, /\d+\.\d+\.(\d+)/));

      supportWebFont = majorVersion > 1 ||
          majorVersion == 1 && intMinorVersion > 9 ||
          majorVersion == 1 && intMinorVersion == 9 && subVersion >= 2 ||
          geckoVersion.match(/1\.9\.1b[123]/) != null ||
          geckoVersion.match(/1\.9\.1\.[\d\.]+/) != null;
    }
  }
  return new webfont.UserAgent(name, version, "Gecko", geckoVersion,
      this.getPlatform_(), this.getPlatformVersion_(), supportWebFont);
};

webfont.UserAgentParser.prototype.getMajorVersion_ = function(version) {
  var majorVersion = this.getFirstMatchingGroup_(version, /(\d+)/);

  if (majorVersion != "") {
    return parseInt(majorVersion);
  }
  return -1;
};

webfont.UserAgentParser.prototype.getFirstMatchingGroup_ = function(str,
    regexp) {
  return this.getMatchingGroup_(str, regexp, 1);
};

webfont.UserAgentParser.prototype.getMatchingGroup_ = function(str,
    regexp, index) {
  var groups = str.match(regexp);

  if (groups && groups[index]) {
    return groups[index];
  }
  return "";
};
