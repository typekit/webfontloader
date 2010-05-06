var FontModuleLoaderTest = TestCase('FontModuleLoaderTest');

FontModuleLoaderTest.prototype.testGetProperModuleList = function() {
  var fontModuleLoader = new webfont.FontModuleLoader();

  fontModuleLoader.addModuleFactory('booh', function() { return { scary: true }; });
  fontModuleLoader.addModuleFactory('haha', function() { return { funny: true }; });
  fontModuleLoader.addModuleFactory('moo', function() { return { cowy: true }; });
  var modules = fontModuleLoader.getModules({ booh: {}, moo: {}, nothing: {} });

  assertNotNull(modules);
  assertEquals(2, modules.length);
  var module1 = modules[0];

  assertNotNull(module1);
  assertTrue(module1.scary || module1.cowy);
  var module2 = modules[1];

  assertNotNull(module2);
  assertTrue(module2.scary || module2.cowy);
};

FontModuleLoaderTest.prototype.testNotModuleShouldHaveEmptyModuleList =
    function() {
  var fontModuleLoader = new webfont.FontModuleLoader();
  var modules = fontModuleLoader.getModules();

  assertNotNull(modules);
  assertEquals(0, modules.length);
};
