## This is the rakegem gemspec template. Make sure you read and understand
## all of the comments. Some sections require modification, and others can
## be deleted if you don't need them. Once you understand the contents of
## this file, feel free to delete any comments that begin with two hash marks.
## You can find comprehensive Gem::Specification documentation, at
## http://docs.rubygems.org/read/chapter/20
Gem::Specification.new do |s|
  s.specification_version = 2 if s.respond_to? :specification_version=
  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.rubygems_version = '1.3.5'

  ## Leave these as is they will be modified for you by the rake gemspec task.
  ## If your rubyforge_project name is different, then edit it and comment out
  ## the sub! line in the Rakefile
  s.name              = 'webfontloader'
  s.version           = '1.6.24'
  s.date              = '2016-03-20'

  ## Make sure your summary is short. The description may be as long
  ## as you like.
  s.summary     = "WebFont Loader gives you added control when using linked fonts via @font-face."
  s.description = <<-DESC
WebFont Loader gives you added control when using linked fonts via
`@font-face`. It provides a common interface to loading fonts regardless of
the source, then adds a standard set of events you may use to control the
loading experience.
DESC

  ## List the primary authors. If there are a bunch of authors, it's probably
  ## better to set the email to an email list or something. If you don't have
  ## a custom homepage, consider using your GitHub URL or the like.
  s.authors  = ["Ryan Carver", "Jeremie Lenfant-engelmann"]
  s.email    = 'ryan@typekit.com'
  s.homepage = 'http://github.com/typekit/webfontloader'

  ## License
  s.license = "Apache-2.0"

  ## This gets added to the $LOAD_PATH so that 'lib/NAME.rb' can be required as
  ## require 'NAME.rb' or'/lib/NAME/file.rb' can be as require 'NAME/file.rb'
  s.require_paths = %w[lib]

  ## This sections is only necessary if you have C extensions.
  # s.require_paths << 'ext'
  # s.extensions = %w[ext/extconf.rb]

  ## If your gem includes any executables, list them here.
  # s.executables = []
  # s.default_executable = 'name'

  ## Specify any RDoc options here. You'll want to add your README and
  ## LICENSE files to the extra_rdoc_files list.
  s.rdoc_options = ["--charset=UTF-8"]
  s.extra_rdoc_files = %w[README.md] + Dir["docs/*.md"]

  ## List your runtime dependencies here. Runtime dependencies are those
  ## that are needed for an end user to actually USE your code.
  # s.add_dependency('DEPNAME', [">= 1.1.0", "< 2.0.0"])

  ## List your development dependencies here. Development dependencies are
  ## those that are only needed during development
  s.add_development_dependency('rake', '~>0')
  s.add_development_dependency('rack', '~>1.5', '>=1.5.1')
  s.add_development_dependency('sinatra', '~>1.3', '>=1.3.4')
  s.add_development_dependency('vegas', '~>0.1.11')

  ## Leave this section as-is. It will be automatically generated from the
  ## contents of your Git repository via the gemspec task. DO NOT REMOVE
  ## THE MANIFEST COMMENTS, they are used as delimiters by the task.
  # = MANIFEST =
  s.files = %w[
    CHANGELOG
    CONTRIBUTING.md
    Gemfile
    LICENSE
    README.md
    Rakefile
    bin/webfontloader-demos
    bower.json
    browsers.json
    externs.js
    lib/webfontloader.rb
    lib/webfontloader/demo/public/basic.css
    lib/webfontloader/demo/public/blank.html
    lib/webfontloader/demo/public/custom-iframe.html
    lib/webfontloader/demo/public/custom.html
    lib/webfontloader/demo/public/event-css-active-multiple.html
    lib/webfontloader/demo/public/event-css-active.html
    lib/webfontloader/demo/public/event-css-inactive.html
    lib/webfontloader/demo/public/event-css-loading.html
    lib/webfontloader/demo/public/event-js-active.html
    lib/webfontloader/demo/public/event-js-font-active.html
    lib/webfontloader/demo/public/event-js-loading.html
    lib/webfontloader/demo/public/events-variations.html
    lib/webfontloader/demo/public/events.html
    lib/webfontloader/demo/public/fontdeck.html
    lib/webfontloader/demo/public/fontwatchrunner-default-fonts.html
    lib/webfontloader/demo/public/google-css.html
    lib/webfontloader/demo/public/google-iframe.html
    lib/webfontloader/demo/public/google.html
    lib/webfontloader/demo/public/ie-fast-js.html
    lib/webfontloader/demo/public/ie-slow-js.html
    lib/webfontloader/demo/public/ie-slow-link.html
    lib/webfontloader/demo/public/index.html
    lib/webfontloader/demo/public/jquery.min.js
    lib/webfontloader/demo/public/monotype-iframe.html
    lib/webfontloader/demo/public/monotype.html
    lib/webfontloader/demo/public/typekit-iframe.html
    lib/webfontloader/demo/public/typekit-variations.html
    lib/webfontloader/demo/public/typekit.html
    lib/webfontloader/demo/server.rb
    lib/webfontloader/modules.rb
    package.json
    spec/core/cssclassname_spec.js
    spec/core/domhelper_spec.js
    spec/core/eventdispatcher_spec.js
    spec/core/font_spec.js
    spec/core/fontmoduleloader_spec.js
    spec/core/fontruler_spec.js
    spec/core/fontwatcher_spec.js
    spec/core/fontwatchrunner_spec.js
    spec/core/nativefontwatchrunner_spec.js
    spec/core/size_spec.js
    spec/core/webfont_spec.js
    spec/deps.js
    spec/fixtures/external_script.js
    spec/fixtures/external_stylesheet.css
    spec/fixtures/fonts/LICENSE.txt
    spec/fixtures/fonts/nullfont.css
    spec/fixtures/fonts/nullfont1.css
    spec/fixtures/fonts/nullfont2.css
    spec/fixtures/fonts/nullfont3.css
    spec/fixtures/fonts/sourcesans.eot
    spec/fixtures/fonts/sourcesans.otf
    spec/fixtures/fonts/sourcesans.svg
    spec/fixtures/fonts/sourcesans.ttf
    spec/fixtures/fonts/sourcesans.woff
    spec/fixtures/fonts/sourcesansa.css
    spec/fixtures/fonts/sourcesansb.css
    spec/fixtures/fonts/sourcesansc.css
    spec/fixtures/fonts/sourcesansd.css
    spec/fixtures/fonts/sourcesansdup1.css
    spec/fixtures/fonts/sourcesansdup2.css
    spec/index.html
    spec/modules/custom_spec.js
    spec/modules/fontdeck_spec.js
    spec/modules/google/fontapiparser_spec.js
    spec/modules/google/fontapiurlbuilder_spec.js
    spec/modules/google/googlefontapi_spec.js
    spec/modules/monotype_spec.js
    spec/modules/typekit_spec.js
    src/closure.js
    src/core/cssclassname.js
    src/core/domhelper.js
    src/core/eventdispatcher.js
    src/core/font.js
    src/core/fontmodule.js
    src/core/fontmoduleloader.js
    src/core/fontruler.js
    src/core/fontwatcher.js
    src/core/fontwatchrunner.js
    src/core/initialize.js
    src/core/nativefontwatchrunner.js
    src/core/stylesheetwaiter.js
    src/core/webfont.js
    src/modules.yml
    src/modules/custom.js
    src/modules/fontdeck.js
    src/modules/google/fontapiparser.js
    src/modules/google/fontapiurlbuilder.js
    src/modules/google/googlefontapi.js
    src/modules/monotype.js
    src/modules/typekit.js
    tools/compiler/base.js
    tools/compiler/compiler.jar
    tools/jasmine-browserstack/jasmine-browserstack.js
    tools/jasmine-phantomjs/jasmine-phantomjs.js
    tools/jasmine-phantomjs/terminal-reporter.js
    tools/jasmine/MIT.LICENSE
    tools/jasmine/jasmine-html.js
    tools/jasmine/jasmine.css
    tools/jasmine/jasmine.js
    webfontloader.gemspec
    webfontloader.js
  ]
  # = MANIFEST =

  ## Test files will be grabbed from the file list. Make sure the path glob
  ## matches what you actually use.
  s.test_files = s.files.select { |path| path =~ /^spec\/.*_spec\.rb/ }
end
