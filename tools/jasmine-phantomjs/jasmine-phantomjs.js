var webpage = require('webpage'),
    system = require('system');

if (system.args.length !== 1) {
  var page = webpage.create();

  page.onConsoleMessage = function (msg) {
    if (msg === 'ConsoleReporter finished') {
      var status = page.evaluate(function () {
        return JASMINE_STATUS;
      });

      if (status === 'success') {
        phantom.exit(0);
      } else {
        phantom.exit(1);
      }
    } else {
      console.log(msg);
    }
  };

  page.open(system.args[1], function (status) {
    if (status !== 'success') {
      phantom.exit(1);
    }
  });
} else {
  console.log('Usage: jasmine-phantomjs [FILE]');
  phantom.exit(1);
}
