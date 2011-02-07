# WebFont Loader

WebFont Loader gives you added control when using linked fonts via
`@font-face`. It provides a common interface to loading fonts regardless of
the source, then adds a standard set of events you may use to control the
loading experience.


## Get Started

(These samples use WebFont Loader hosted on [Google's AJAX Libraries][gajax].)

Link to the WebFont Loader library, then tell it which fonts to load. Here we'll
load fonts from [Google's Font API][gfontapi].

    <script src="http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js"></script>
    <script>
      WebFont.load({
        google: {
          families: ['Droid Sans', 'Droid Serif']
        }
      });
    </script>

Alternatively, load fonts from Typekit. Just specify your Kit ID.

    <script src="http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js"></script>
    <script>
      WebFont.load({
        typekit: {
          id: 'xxxxxx'
        }
      });
    </script>

Learn more about the
[modules][mod].


## Do More

WebFont Loader gives you control over how fonts are loaded. If you're
frustrated by the "flash of unstyled text" typically seen in FireFox, try
this.

    <script src="http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js"></script>
    <script>
      WebFont.load({
        google: {
          families: ['Droid Sans']
        }
      });
    </script>
    <style>
      h1 {
        font-family: 'Droid Sans';
        visibility: hidden;
      }
      .wf-active h1 {
        visibility: visible;
      }
    </style>

    <body>
      <h1>This headline will be hidden until Droid Sans is completely loaded.</h1>
    </body>

Learn more about [events][evt].


## A common ground

WebFont Loader aims to provide a common interface for font loading. Today it
works with Google, Typekit, Fonts.com Web fonts and your own CSS. Learn more in
[transitions][trn].


## More to see

A full suite of demo pages is included in this source. Here you can find some
live examples using the JS and CSS events.

To view the demos, just boot up our demo server and start browsing.

    $ rake demo

You may need a few rubygems to run the server. Get them with [Bundler](http://gembundler.com/).

    $ gem install bundler
    $ bundle install

Browse the demos [source code][demos].


## Problems?

Please open [an issue][issues]. Sample pages are greatly appreciated.


## Developing

Is there something else WebFont Loader should do? Did you find a bug and want
to fix it?

### Testing

WebFont Loader has an extensive test suite that runs via
[jsTestDriver][jstestdriver]. Please add tests for any changes.

To run tests, first boot the test server. This open a browser
and start listing for test executions. You can register multiple browsers.

    rake test:boot

Then, run the tests.

    rake test

## Contributing

* Fork webfontloader
* Create a topic branch - `git checkout -b my_branch`
* Push to your branch - `git push origin my_branch`
* Create an [issue][issues] with a link to your branch
* That's it!



## Authors

* Ryan Carver / ryan@typekit.com
* Jeremie Lenfant-engelmann /  jeremiele@google.com


## License

WebFont Loader is released under the [Apache 2.0][lic] license.


[mod]: http://github.com/typekit/webfontloader/blob/master/docs/MODULES.md
[trn]: http://github.com/typekit/webfontloader/blob/master/docs/TRANSITIONS.md
[evt]: http://github.com/typekit/webfontloader/blob/master/docs/EVENTS.md
[lic]: http://github.com/typekit/webfontloader/blob/master/LICENSE
[demos]: http://github.com/typekit/webfontloader/blob/master/lib/webfontloader/demo/public
[gfontapi]: https://code.google.com/apis/webfonts/
[gajax]: http://code.google.com/apis/ajaxlibs/
[jstestdriver]: http://code.google.com/p/js-test-driver/
[issues]: https://github.com/typekit/webfontloader/issues
