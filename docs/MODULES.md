# Modules

WebFont Loader provides a generic module system so that any web font provider
may be used. The specifics of each provider are documented here.

## Google

Using Google's Font API, name the font families you'd like to load.

    WebFont.load({
      google: {
        family: ['Droid Sans', 'Droid Serif']
      }
    });


## Typekit

When using Typekit, specify the Kit to retrieve by its ID. You can find this
ID within Typekit's Kit Editor interface.

    WebFont.load({
      typekit: {
        id: 'xxxxxx'
      }
    });

  
## Custom

To load fonts from any external stylesheet, use the `custom` module. Here you'll
need to specify both the url of the stylesheet as well as the font families it 
provides.

    WebFont.load({
      custom: {
        families: ['My Font', 'My Other Font'],
        urls: ['/fonts.css']
      }
    });
  
