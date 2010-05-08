webfont.EventDispatcher = function(domHelper, htmlElement, callbacks,
    opt_namespace) {
  this.domHelper_ = domHelper;
  this.htmlElement_ = htmlElement;
  this.callbacks_ = callbacks;
  this.namespace_ = opt_namespace || webfont.EventDispatcher.DEFAULT_NAMESPACE;
  this.cssClassName_ = new webfont.CssClassName('-');
};

webfont.EventDispatcher.DEFAULT_NAMESPACE = 'wf';
webfont.EventDispatcher.LOADING = 'loading';
webfont.EventDispatcher.ACTIVE = 'active';
webfont.EventDispatcher.INACTIVE = 'inactive';
webfont.EventDispatcher.FAILED = 'failed';
webfont.EventDispatcher.FAMILY_LOADING = 'familyloading';
webfont.EventDispatcher.FAMILY_ACTIVE = 'familyactive';
webfont.EventDispatcher.FAMILY_FAILED = 'familyfailed';

webfont.EventDispatcher.prototype.dispatchLoading = function() {
  this.domHelper_.appendClassName(this.htmlElement_,
      this.cssClassName_.build(
          this.namespace_, webfont.EventDispatcher.LOADING));
  this.dispatch_(webfont.EventDispatcher.LOADING);
};

webfont.EventDispatcher.prototype.dispatchFamilyLoading = function(fontFamily) {
  this.domHelper_.appendClassName(this.htmlElement_,
      this.cssClassName_.build(
          this.namespace_, fontFamily, webfont.EventDispatcher.LOADING));
  this.dispatch_(webfont.EventDispatcher.FAMILY_LOADING, fontFamily);
};

webfont.EventDispatcher.prototype.dispatchFamilyActive = function(fontFamily) {
  this.domHelper_.removeClassName(this.htmlElement_,
      this.cssClassName_.build(
          this.namespace_, fontFamily, webfont.EventDispatcher.LOADING));
  this.domHelper_.appendClassName(this.htmlElement_,
      this.cssClassName_.build(
          this.namespace_, fontFamily, webfont.EventDispatcher.ACTIVE));
  this.dispatch_(webfont.EventDispatcher.FAMILY_ACTIVE, fontFamily);
};

webfont.EventDispatcher.prototype.dispatchFamilyFailed = function(fontFamily) {
  this.domHelper_.removeClassName(this.htmlElement_,
      this.cssClassName_.build(
          this.namespace_, fontFamily, webfont.EventDispatcher.LOADING));
  this.domHelper_.appendClassName(this.htmlElement_,
      this.cssClassName_.build(
          this.namespace_, fontFamily, webfont.EventDispatcher.FAILED));
  this.dispatch_(webfont.EventDispatcher.FAMILY_FAILED, fontFamily);
};

webfont.EventDispatcher.prototype.dispatchInactive = function() {
  this.domHelper_.appendClassName(this.htmlElement_,
      this.cssClassName_.build(
        this.namespace_, webfont.EventDispatcher.INACTIVE));
  this.dispatch_(webfont.EventDispatcher.INACTIVE);
};

webfont.EventDispatcher.prototype.dispatchActive = function() {
  // what about inactive? maybe if all fonts failed to load?
  this.domHelper_.removeClassName(this.htmlElement_,
      this.cssClassName_.build(
          this.namespace_, webfont.EventDispatcher.LOADING));
  this.domHelper_.appendClassName(this.htmlElement_,
      this.cssClassName_.build(
          this.namespace_, webfont.EventDispatcher.ACTIVE));
  this.dispatch_(webfont.EventDispatcher.ACTIVE);
};

webfont.EventDispatcher.prototype.dispatch_ = function(event, opt_arg) {
  if (this.callbacks_[event]) {
    this.callbacks_[event](opt_arg);
  }
};
