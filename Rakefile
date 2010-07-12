require 'rubygems'
require 'rake'
require 'date'

#############################################################################
#
# Helper functions
#
#############################################################################

def name
  @name ||= Dir['*.gemspec'].first.split('.').first
end

def version
  line = File.read("lib/#{name}.rb")[/^\s*VERSION\s*=\s*.*/]
  line.match(/.*VERSION\s*=\s*['"](.*)['"]/)[1]
end

def date
  Date.today.to_s
end

def gemspec_file
  "#{name}.gemspec"
end

def gem_file
  "#{name}-#{version}.gem"
end

def replace_header(head, header_name)
  head.sub!(/(\.#{header_name}\s*= ').*'/) { "#{$1}#{send(header_name)}'"}
end

#############################################################################
#
# Standard tasks
#
#############################################################################

desc "Open an irb session preloaded with this library"
task :console do
  sh "irb -rubygems -r ./lib/#{name}.rb"
end

#############################################################################
#
# Custom tasks (add your own tasks here)
#
#############################################################################

require 'rake/clean'

$LOAD_PATH.unshift File.dirname(__FILE__) + "/lib"
require 'webfontloader'

#
# Setup
#

# Build targets (remove with `rake clean`)
CLEAN.include("target")
CLEAN.include("tmp")

# JsTestDriver
JsTestPort = "9876"
JsTestServer = "http://localhost:#{JsTestPort}"
JsTestJar = "tools/jstestdriver/JsTestDriver-1.2.1.jar"

# JsCompiler
JsCompilerJar = "tools/compiler/compiler.jar"

# JS Source dependencies
AllJs = FileList["{src,src-test}/**/*"]
SourceJs  = FileList["src/**/*"]

# JS Source loader
@modules = WebFontLoader::Modules.new

#
# Build
#

directory "target"
directory "tmp"

file "tmp/jsTestDriver.conf" => AllJs + ["tmp"] do |t|
  require 'yaml'
  config = {
    "server" => JsTestServer,
    "load" => (@modules.all_source_files + @modules.all_test_globs).map { |f| "../#{f}" }
  }
  File.open(t.name, "w") { |f| YAML.dump(config, f) }
end

desc "Compile the JavaScript into target/webfont.js"
task :compile => "target/webfont.js"

file "target/webfont.js" => SourceJs + ["target"] do |t|

  output_marker = "%output%"
  output_wrapper = @modules.js_output_wrapper(output_marker)

  args = [
    ["-jar", JsCompilerJar],
    ["--compilation_level", "ADVANCED_OPTIMIZATIONS"],
    ["--js_output_file", t.name],
    ["--output_wrapper_marker", %("#{output_marker}")],
    ["--output_wrapper", %("#{output_wrapper}")]
  ]

  source = @modules.all_source_files
  args.concat source.map { |f| ["--js", f] }

  system "java #{args.flatten.join(' ')}"
end

desc "Creates debug version into target/webfont.js"
task :debug => "target/webfont_debug.js"

file "target/webfont_debug.js" => SourceJs + ["target"] do |t|
  File.open(t.name, "w") { |f|
    @modules.all_source_files.each { |src|
      f.puts File.read(src)
      f.puts ""
    }
  }
end

#
# Run
#

namespace :test do
  task :server do
    system "java -jar #{JsTestJar} --port #{JsTestPort}"
  end
  task :capture do
    system "open #{JsTestServer}/capture?strict"
  end
  desc "Execute tests against a running server"
  task :run => ["tmp/jsTestDriver.conf"] do |t|
    config = t.prerequisites.first
    system "java -jar #{JsTestJar} --config #{config} --server #{JsTestServer} --tests all --captureConsole --verbose"
  end
  desc "Boot the test server and capture a browser"
  multitask :boot => ['test:server', 'test:capture']
end

desc "Run all tests"
task :test => ["tmp/jsTestDriver.conf"] do |t|
  config = t.prerequisites.first
  system "java -jar #{JsTestJar} --port #{JsTestPort} --config #{config} --server #{JsTestServer} --browser open --tests all --captureConsole --verbose"
end

desc "Start the demo server"
task :demo => "target/webfont.js" do |t|
  js = t.prerequisites.first
  exec "bin/webfontloader-demos -F --compiled_js #{js}"
end

desc "Start the demo server for development"
task :demodev do
  exec "bin/webfontloader-demos -F -L --modules"
end

desc "Find out how many bytes the source is"
task :bytes => "target/webfont.js" do |t|
  js = t.prerequisites.first
  bytes = File.read(js).size
  puts "#{bytes} bytes uncompressed"
end

desc "Find out how many bytes the source is when gzipped"
task :gzipbytes => "target/webfont.js" do |t|
  require 'zlib'
  js = t.prerequisites.first
  bytes = Zlib::Deflate.deflate(File.read(js)).size
  puts "#{bytes} bytes gzipped"
end


#############################################################################
#
# Packaging tasks
#
#############################################################################

task :release => :build do
  unless `git branch` =~ /^\* master$/
    puts "You must be on the master branch to release!"
    exit!
  end
  sh "git commit --allow-empty -a -m 'Release #{version}'"
  sh "git tag v#{version}"
  sh "git push --tags origin master"
  # sh "gem push pkg/#{name}-#{version}.gem"
end

task :build => :gemspec do
  sh "mkdir -p pkg"
  sh "gem build #{gemspec_file}"
  sh "mv #{gem_file} pkg"
end

task :gemspec => :validate do
  # read spec file and split out manifest section
  spec = File.read(gemspec_file)
  head, manifest, tail = spec.split("  # = MANIFEST =\n")

  # replace name version and date
  replace_header(head, :name)
  replace_header(head, :version)
  replace_header(head, :date)

  # determine file list from git ls-files
  files = `git ls-files`.
    split("\n").
    sort.
    reject { |file| file =~ /^\./ }.
    reject { |file| file =~ /^(rdoc|pkg)/ }.
    map { |file| "    #{file.gsub(/\s/, '\ ')}" }.
    join("\n")

  # piece file back together and write
  manifest = "  s.files = %w[\n#{files}\n  ]\n"
  spec = [head, manifest, tail].join("  # = MANIFEST =\n")
  File.open(gemspec_file, 'w') { |io| io.write(spec) }
  puts "Updated #{gemspec_file}"
end

task :validate do
  libfiles = Dir['lib/*'] - ["lib/#{name}.rb", "lib/#{name}"]
  unless libfiles.empty?
    puts "Directory `lib` should only contain a `#{name}.rb` file and `#{name}` dir."
    exit!
  end
  unless Dir['VERSION*'].empty?
    puts "A `VERSION` file at root level violates Gem best practices."
    exit!
  end
end
