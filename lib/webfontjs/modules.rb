module WebFontJS
  class Modules

    def initialize(*modules)
      @project_root = WebFontJS::ProjectRoot
      @js_src = "src"
      @js_test = "src-test"
      @modules = modules.empty? ? config.keys : modules
      # Make sure 'core' is first.
      @modules.unshift "core"
      @modules.uniq!
    end

    attr_reader :modules
    attr_accessor :project_root, :js_src, :js_test

    def all_source_files
      @all_source_files ||= begin
        modules.map { |mod| config[mod] }.compact.flatten.map { |f| File.join(js_src, f) }
      end
    end

    def all_test_globs
      @all_test_globs ||= begin
        js_test_dirs = Dir[File.join(project_root, js_test, "*")].map { |d| File.basename(d) }
        js_test_dirs.map { |dir| File.join(js_test, dir, "*.js") if modules.include?(dir) }.compact
      end
    end

  protected

    def config
      @config ||= begin
        path = File.join(project_root, js_src)
        YAML.load_file(File.join(path, "modules.yml"))
      end
    end

  end
end