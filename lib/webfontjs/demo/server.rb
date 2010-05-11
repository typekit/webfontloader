require 'sinatra/base'
require 'open-uri'

module WebFontJS
  module Demo
    class Server < Sinatra::Base

      DemoRoot = File.expand_path(File.join(File.dirname(__FILE__)))
      ProjectRoot = File.expand_path(File.join(File.dirname(__FILE__), "..", "..", ".."))

      GoogleApi = "http://themes.googleusercontent.com/fonts/api"
      GoogleFontApi = "http://themes.googleusercontent.com/fonts/font"

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

      get '/fonts/api' do
        url = "#{GoogleApi}?#{env['QUERY_STRING']}"
        headers 'Content-Type' => 'text/css'
        headers 'Cache-Control' => 'max-age=300'
        response = open(url, 'User-Agent' => env['HTTP_USER_AGENT'])
        source = response.read
        source.gsub!(%r[http://themes.googleusercontent.com/font], '/fonts/font')
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
        <<-JS
          if (window.__typekitScriptModules__) {
            var module = window.__typekitScriptModules__['#{kit_id}'];
            if (module) {
              var ua = module['ua'];
              var init = module['init'];
              if (ua && init) {
                init(true, ['Arial Black']);
              }
            }
          }
        JS
      end

    protected

      def get_js_code
        if settings.compiled_js
          settings.compiled_js
        elsif settings.modules
          settings.modules.all_source_files.map { |file| File.read(File.join(WebFontJS::ProjectRoot, file)) }
        else
          "alert('No JavaScript has been configured in the demo server');"
        end
      end

    end
  end
end