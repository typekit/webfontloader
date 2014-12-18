# Contributing

Please open [an issue](https://github.com/typekit/webfontloader/issues) if you find or suspect any problems. Sample pages and test cases are greatly appreciated.

## Development requirements

You'll need a few rubygems to run the tests, demo server, and other rake tasks, which should be installed with [Bundler](http://gembundler.com/).

    $ gem install bundler
    $ bundle install

To run the tests in a headless WebKit you will also need to have [PhantomJS](http://www.phantomjs.org) installed. You can install PhantomJS by downloading a binary or using HomeBrew.

    $ brew install phantomjs

## Building

To build a JS file from source, just run rake:

    $ rake

If you want to build a JS file with only specific modules you can specify them on the command line:

    $ rake compile['custom google typekit']

This will compile a JS file with only the `custom`, `google` and `typekit` modules. The available modules are: `custom`, `google`, `typekit`, `ascender`, `monotype`, `fontdeck`. By default all modules are included.

## Demos

A full suite of demo pages is included in this source. Here you can find some
live examples using the JS and CSS events. Run the demo server with:

    $ rake demo

You can also run the demos with uncompressed, debuggable code to aid in
development. Just start the server in dev mode:

    $ rake demodev

Browse the demos [source code](http://github.com/typekit/webfontloader/blob/master/lib/webfontloader/demo/public).

## Testing

Web Font Loader has an extensive test suite that runs via Jasmine. The test suite
should be passing before submitting a pull request, and new tests should be added for any new functionality.

To run tests, open up `spec/index.html` in a browser and check the results. The
test suite will run automatically. Again, before submitting a pull request
please run the test suite in multiple browsers and list them in the pull request.

To run tests in a headless WebKit using [PhantomJS](http://www.phantomjs.org) run:

    $ rake test
