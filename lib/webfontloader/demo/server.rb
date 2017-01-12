require 'sinatra/base'
require 'open-uri'

module WebFontLoader
  module Demo
    class Server < Sinatra::Base

      DemoRoot = File.expand_path(File.join(File.dirname(__FILE__)))
      ProjectRoot = File.expand_path(File.join(File.dirname(__FILE__), "..", "..", ".."))

      GoogleApi = "https://fonts.googleapis.com/css"
      GoogleFontApi = "https://themes.googleusercontent.com/font"

      set :app_file, __FILE__
      set :sessions, false
      set :static, true

      set :modules, nil
      set :compiled_js, nil

      get '/' do
        File.read(File.join(DemoRoot, "public", "index.html"))
      end

      get '/webfont.js' do
        headers 'Content-Type' => "application/javascript"
        headers 'Cache-Control' => 'max-age=300'
        get_js_code
      end

      get '/webfont-fontwatchrunner.js' do
        headers 'Content-Type' => 'application/javascript'
        headers 'Cache-Control' => 'max-age=300'
        [
          'var webfont = {};',
          File.read(File.join(WebFontLoader::ProjectRoot, 'src/core/fontwatchrunner.js'))
        ]
      end

      get '/fonts/api' do
        url = "#{GoogleApi}?#{env['QUERY_STRING']}"
        headers 'Content-Type' => 'text/css'
        headers 'Cache-Control' => 'max-age=300'
        response = open(url, 'User-Agent' => env['HTTP_USER_AGENT'])
        source = response.read
        source.gsub!(%r[https://themes.googleusercontent.com/font], '/fonts/font')
        source
      end

      get '/fonts/font' do
        sleep 1
        url = "#{GoogleFontApi}?#{env['QUERY_STRING']}"
        headers 'Cache-Control' => 'max-age=300'
        headers 'Content-Encoding' => 'gzip'
        response = open(url, 'User-Agent' => env['HTTP_USER_AGENT'])
        response.read
      end

      get %r[/typekit/(\w+)\.js] do |kit_id|
        headers 'Content-Type' => 'application/javascript'
        headers 'Cache-Control' => 'max-age=300'
        case kit_id
        when "kitwitharialblack"
          families = "['Arial Black']"
          variations = "{}"
        when "kitwithgeorgia"
          families = "['Georgia']"
          variations = "{ 'Georgia': ['i4', 'i7' ]}"
        else
          families = "[]"
          variations = "{}"
        end
        <<-JS
          if (window.__webfonttypekitmodule__) {
            var module = window.__webfonttypekitmodule__['#{kit_id}'];
            if (module) {
              module(function(userAgent, configuration, init) {
                // Here you may use the userAgent object to determine
                // browser support.
                init(true, #{families}, #{variations});
              });
            }
          }
        JS
      end

    protected

      def get_js_code
        if settings.compiled_js
          settings.compiled_js
        elsif settings.modules
          settings.modules.all_source_files.map { |file| File.read(File.join(WebFontLoader::ProjectRoot, file)) }
        else
          "alert('No JavaScript has been configured in the demo server');"
        end
      end

    end
  end
end