(function (root, factory) {
  if (typeof exports === 'object') {
    module.exports = factory(require('jasmine'));
  } else if (typeof define === 'function' && define.amd) {
    define(['jasmine'], factory);
  } else {
    factory(jasmine);
  }
}(this, function (jasmine) {
  function BrowserStackReporter() {
    this.stats = {
      suites: 0,
      tests: 0,
      passes: 0,
      pending: 0,
      failures: 0
    };
    this.tests = [];
    this.failures = [];
    this.passes = [];
  }

  BrowserStackReporter.prototype.reportRunnerStarting = function (runner) {
    this.stats.start = new Date();
  };

  BrowserStackReporter.prototype.reportSpecStarting = function (spec) {
    spec.startedAt = new Date().getTime();
  };

  BrowserStackReporter.prototype.reportSpecResults = function (spec) {
    var currentTime = new Date().getTime();
    spec.duration = currentTime - spec.startedAt;

    var test = {
      title: spec.description,
      fullTitle: spec.getFullName(),
      duration: currentTime - spec.startedAt
    };

    this.tests.push(test);

    var result = spec.results();

    if (result.skipped) {
      this.stats.pending += 1;
    } else if (result.failedCount === 0) {
      this.passes.push(test);
    } else {
      var items = result.getItems(),
          message = '';

      for (var i = 0; i < items.length; i += 1) {
        var str = items[i].trace.stack || items[i].trace.toString();

        if (!~str.indexOf(items[i].trace.message)) {
          str = items[i].trace.message + '\n' + str;
        }

        if ('[object Error]' == str) {
          str = items[i].trace.message;
        }

        if (!items[i].trace.stack && items[i].trace.sourceURL && items[i].trace.line !== undefined) {
          str += '\n(' + items[i].trace.sourceURL + ':' + items[i].trace.line + ')';
        }

        message += str;
      }

      test.err = {
        message: message
      };

      this.failures.push(test);
    }
  };

  BrowserStackReporter.prototype.reportSuiteResults = function (suite) {
  };

  BrowserStackReporter.prototype.reportRunnerResults = function (runner) {
    var suites = runner.suites();

    this.stats.end = new Date();
    this.stats.duration = this.stats.end - this.stats.end;

    this.stats.suites = suites.length;

    for (var i = 0; i < suites.length; i += 1) {
      if (suites[i].parentSuite === null) {
        this.stats.tests += suites[i].specs().length;
      }
    }

    this.stats.failures = this.failures.length;
    this.stats.passes = this.passes.length;

    if (/browserstack=true/i.test(window.location.search)) {
      var xhr = new XMLHttpRequest();

      xhr.open('POST', window.location.href);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({
        stats: this.stats,
        tests: this.tests,
        failures: this.failures,
        passes: this.passes
      }, null, 2));
    }
  };

  // Attach to the jasmine object like many other reporters do
  jasmine.BrowserStackReporter = BrowserStackReporter;
}));
