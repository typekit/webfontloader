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
  s.version           = '1.4.0'
  s.date              = '2013-03-28'

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
  s.add_development_dependency('rake')
  s.add_development_dependency('rack', ["~>1.5.1"])
  s.add_development_dependency('sinatra', ["~>1.3.4"])
  s.add_development_dependency('vegas', ["~>0.1.11"])

  ## Leave this section as-is. It will be automatically generated from the
  ## contents of your Git repository via the gemspec task. DO NOT REMOVE
  ## THE MANIFEST COMMENTS, they are used as delimiters by the task.
  # = MANIFEST =
  s.files = %w[
    CHANGELOG
    Gemfile
    LICENSE
    README.md
    Rakefile
    bin/webfontloader-demos
    docs/EVENTS.md
    docs/MODULES.md
    docs/TRANSITIONS.md
    lib/webfontloader.rb
    lib/webfontloader/demo/public/ascender-iframe.html
    lib/webfontloader/demo/public/ascender.html
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
    spec/ascender/ascenderscript_spec.js
    spec/core/cssclassname_spec.js
    spec/core/cssfontfamilyname_spec.js
    spec/core/domhelper_spec.js
    spec/core/eventdispatcher_spec.js
    spec/core/font_spec.js
    spec/core/fontmoduleloader_spec.js
    spec/core/fontruler_spec.js
    spec/core/fontvariationdescription_spec.js
    spec/core/fontwatcher_spec.js
    spec/core/fontwatchrunner_spec.js
    spec/core/size_spec.js
    spec/core/useragentparser_spec.js
    spec/custom/customcss_spec.js
    spec/deps.js
    spec/fontdeck/fontdeckscript_spec.js
    spec/fonts/LICENSE.txt
    spec/fonts/nullfont.css
    spec/fonts/nullfont1.css
    spec/fonts/nullfont2.css
    spec/fonts/nullfont3.css
    spec/fonts/sourcesans.eot
    spec/fonts/sourcesans.otf
    spec/fonts/sourcesans.svg
    spec/fonts/sourcesans.ttf
    spec/fonts/sourcesans.woff
    spec/fonts/sourcesansa.css
    spec/fonts/sourcesansb.css
    spec/google/fontapiparser_spec.js
    spec/google/fontapiurlbuilder_spec.js
    spec/google/googlefontapi_spec.js
    spec/google/lastresortwebkitfontwatchrunner_spec.js
    spec/index.html
    spec/monotype/monotypescript_spec.js
    spec/typekit/typekitscript_spec.js
    src/ascender/ascender_script.js
    src/async_load.js
    src/closure.js
    src/core/browserinfo.js
    src/core/cssclassname.js
    src/core/cssfontfamilyname.js
    src/core/domhelper.js
    src/core/eventdispatcher.js
    src/core/font.js
    src/core/fontmoduleloader.js
    src/core/fontruler.js
    src/core/fontvariationdescription.js
    src/core/fontwatcher.js
    src/core/fontwatchrunner.js
    src/core/initialize.js
    src/core/namespace.js
    src/core/useragent.js
    src/core/useragentparser.js
    src/custom/customcss.js
    src/fontdeck/fontdeck_script.js
    src/google/fontapiparser.js
    src/google/fontapiurlbuilder.js
    src/google/googlefontapi.js
    src/google/lastresortwebkitfontwatchrunner.js
    src/modules.yml
    src/monotype/monotype_script.js
    src/typekit/typekit_script.js
    tools/compiler/base.js
    tools/compiler/compiler.jar
    tools/jasmine-phantomjs/jasmine-phantomjs.js
    tools/jasmine-phantomjs/terminal-reporter.js
    tools/jasmine/MIT.LICENSE
    tools/jasmine/jasmine-html.js
    tools/jasmine/jasmine.css
    tools/jasmine/jasmine.js
    webfontloader.gemspec
  ]
  # = MANIFEST =

  ## Test files will be grabbed from the file list. Make sure the path glob
  ## matches what you actually use.
  s.test_files = s.files.select { |path| path =~ /^spec\/.*_spec\.rb/ }
end
