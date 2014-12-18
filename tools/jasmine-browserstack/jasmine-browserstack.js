(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jasmine'], factory);
  } else {
    factory(jasmine);
  }
}(this, function (jasmine) {
  function stack(err) {
    var str = err.stack || err.toString();

    if (!~str.indexOf(err.message)) {
      str = err.message + '\n' + str;
    }

    if ('[object Error]' == str) {
      str = err.message;
    }

    if (!err.stack && err.sourceURL && err.line !== undefined) {
      str += '\n(' + err.sourceURL + ':' + err.line + ')';
    }
    return str.replace(/^/gm, '  ');
  }

  function BrowserStackReporter() {
    this.stats = {
      suites: 0,
      tests: 0,
      passes: 0,
      pending: 0,
      failures: 0
    };
    this.tests = [];
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

    var result = spec.results();

    var test = {
      status: null,
      title: spec.getFullName().replace(/#/g, ''),
      duration: currentTime - spec.startedAt
    };

    if (result.skipped) {
      this.stats.pending += 1;
      test.status = 'skipped';
    } else if (result.failedCount === 0) {
      this.stats.passes += 1;
      test.status = 'passed';
    } else {
      var items = result.getItems(),
          message = [];

      for (var i = 0; i < items.length; i += 1) {
        message.push(stack(items[i].trace));
      }

      test.err = message;
      test.status = 'failed';
      this.stats.failures += 1;
    }

    this.stats.tests += 1;
    this.tests.push(test);
  };

  BrowserStackReporter.prototype.reportSuiteResults = function (suite) {
  };

  BrowserStackReporter.prototype.reportRunnerResults = function (runner) {
    var suites = runner.suites();

    this.stats.end = new Date();
    this.stats.duration = this.stats.end - this.stats.end;

    this.stats.suites = suites.length;

    var result = '1..' + this.stats.tests + '\n';

    for (var i = 0; i < this.tests.length; i += 1) {
      var count = i + 1;

      if (this.tests[i].status === 'pending') {
        result += 'ok ' + count + ' ' + this.tests[i].title + ' # SKIP -\n';
      } else if (this.tests[i].status === 'failed') {
        result += 'not ok ' + count + ' ' + this.tests[i].title + '\n';
        for (var j = 0; j < this.tests[i].err.length; j += 1) {
          result += this.tests[i].err[j] + '\n';
        }
      } else {
        result += 'ok ' + count + ' ' + this.tests[i].title + '\n';
      }
    }

    result += '# tests ' + this.stats.tests + '\n';
    result += '# pass ' + this.stats.passes + '\n';
    result += '# fail ' + this.stats.failures + '\n';

    if (/browser=/i.test(window.location.search)) {
      var xhr = null;

      if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
      } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
      }

      xhr.open('POST', window.location.href);
      xhr.setRequestHeader('Content-Type', 'text/plain');
      xhr.send(result);
    }
  };

  // Attach to the jasmine object like many other reporters do
  jasmine.BrowserStackReporter = BrowserStackReporter;
}));
