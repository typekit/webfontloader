# WebFont Loader

WebFont Loader gives you added control when using linked fonts via
`@font-face`. It provides a common interface to loading fonts regardless of
the source, then adds a standard set of events you may use to control the
loading experience.

## Get Started

Link to the WebFont Loader library, then tell it which fonts to load. Here we'll
load fonts from Google.

    <script src="http://ajax.googleapis.com/ajax/libs/webfont/1.0.0/webfont.js"></script>
    <script>
      WebFont.load({
        google: {
          family: ['Droid Sans', 'Droid Serif']
        }
      });
    </script>

Alternatively, load fonts from Typekit. Just specify your Kit ID.

    <script src="http://ajax.googleapis.com/ajax/libs/webfont/1.0.0/webfont.js"></script>
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

    <script>
      WebFont.load({
        google: {
          family: ['Droid Sans']
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
works with Google, Typekit, and your own CSS. Learn more in
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


## Authors

* Ryan Carver / ryan@typekit.com
* Jeremie Lenfant-engelmann /  jeremiele@google.com

## License

WebFont Loader is released under the [Apache 2.0][lic] license.


[mod]: http://github.com/typekit/webfontjs/blob/master/docs/MODULES.md
[trn]: http://github.com/typekit/webfontjs/blob/master/docs/TRANSITIONS.md
[evt]: http://github.com/typekit/webfontjs/blob/master/docs/EVENTS.md
[lic]: http://github.com/typekit/webfontjs/blob/master/LICENSE
[demos]: http://github.com/typekit/webfontjs/blob/master/lib/webfontjs/demo/public
