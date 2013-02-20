var webpage = require('webpage'),
    system = require('system');

if (system.args.length !== 1) {
  var page = webpage.create();

  page.onConsoleMessage = function (msg) {
    console.log(msg);
    if (/^SUCCESS|FAILURE/.test(msg)) {
      if (/^SUCCESS/.test(msg)) {
        phantom.exit(0);
      } else {
        phantom.exit(1);
      }
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
