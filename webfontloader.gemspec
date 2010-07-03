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
  s.version           = '1.0.4'
  s.date              = '2010-06-14'

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
  s.extra_rdoc_files = %w[README.md]

  ## List your runtime dependencies here. Runtime dependencies are those
  ## that are needed for an end user to actually USE your code.
  # s.add_dependency('DEPNAME', [">= 1.1.0", "< 2.0.0"])

  ## List your development dependencies here. Development dependencies are
  ## those that are only needed during development
  # s.add_development_dependency('thin', ["~>1.2.7"])

  ## Leave this section as-is. It will be automatically generated from the
  ## contents of your Git repository via the gemspec task. DO NOT REMOVE
  ## THE MANIFEST COMMENTS, they are used as delimiters by the task.
  # = MANIFEST =
  s.files = %w[
    Gemfile
    LICENSE
    README.md
    Rakefile
    bin/webfontloader-demos
    docs/EVENTS.md
    docs/MODULES.md
    docs/TRANSITIONS.md
    lib/webfontloader.rb
    lib/webfontloader/demo/public/ascender.html
    lib/webfontloader/demo/public/basic.css
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
    lib/webfontloader/demo/public/google-css.html
    lib/webfontloader/demo/public/google.html
    lib/webfontloader/demo/public/ie-fast-js.html
    lib/webfontloader/demo/public/ie-slow-js.html
    lib/webfontloader/demo/public/ie-slow-link.html
    lib/webfontloader/demo/public/index.html
    lib/webfontloader/demo/public/typekit-variations.html
    lib/webfontloader/demo/public/typekit.html
    lib/webfontloader/demo/server.rb
    lib/webfontloader/modules.rb
    src-test/ascender/ascender_script_test.js
    src-test/core/cssclassnametest.js
    src-test/core/cssfontfamilynametest.js
    src-test/core/domhelpertest.js
    src-test/core/eventdispatchertest.js
    src-test/core/fontmoduleloadertest.js
    src-test/core/fonttest.js
    src-test/core/fontvariationdescriptiontest.js
    src-test/core/fontwatchertest.js
    src-test/core/useragenttest.js
    src-test/custom/customcsstest.js
    src-test/google/fontapiparsertest.js
    src-test/google/fontapiurlbuildertest.js
    src-test/google/googlefontapitest.js
    src-test/typekit/typekit_script_test.js
    src/ascender/ascender_script.js
    src/async_load.js
    src/closure.js
    src/core/cssclassname.js
    src/core/cssfontfamilyname.js
    src/core/domhelper.js
    src/core/eventdispatcher.js
    src/core/font.js
    src/core/fontmoduleloader.js
    src/core/fontvariationdescription.js
    src/core/fontwatcher.js
    src/core/initialize.js
    src/core/namespace.js
    src/core/useragent.js
    src/core/useragentparser.js
    src/custom/customcss.js
    src/google/fontapiparser.js
    src/google/fontapiurlbuilder.js
    src/google/googlefontapi.js
    src/modules.yml
    src/typekit/typekit_script.js
    tools/compiler/compiler.jar
    tools/jstestdriver/JsTestDriver-1.2.1.jar
  ]
  # = MANIFEST =

  ## Test files will be grabbed from the file list. Make sure the path glob
  ## matches what you actually use.
  s.test_files = s.files.select { |path| path =~ /^spec\/.*_spec\.rb/ }
end
