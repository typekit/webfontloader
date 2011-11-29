/**
 * @constructor
 */
webfont.CheckStrategyFactory = function(ctor) {
  this.ctor_ = ctor || webfont.DefaultCheckStrategy;
};

webfont.CheckStrategyFactory.prototype.get = function(sizingElementCreator,
      activeCallback, inactiveCallback, fontSizer, fontFamily, fontDescription,
      fontTestString) {
  return new this.ctor_(sizingElementCreator, activeCallback,
      inactiveCallback, fontSizer, fontFamily, fontDescription,
      fontTestString);
};
