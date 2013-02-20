/**
 * Taken from https://github.com/larrymyers/jasmine-reporters
 * Licensed under the MIT license.
 */
(function() {
    if (! jasmine) {
        throw new Exception("jasmine library does not exist in global namespace!");
    }

    /**
     * Basic reporter that outputs spec results to the terminal.
     * Use this reporter in your build pipeline.
     *
     * Usage:
     *
     * jasmine.getEnv().addReporter(new jasmine.TerminalReporter({
           verbosity: 2,
           color: true
       }));
     * jasmine.getEnv().execute();
     */
    var DEFAULT_VERBOSITY = 2,
        ATTRIBUTES_TO_ANSI = {
            "off": 0,
            "bold": 1,
            "red": 31,
            "green": 32
        };

    var TerminalReporter = function(params) {
        var parameters = params || {};

        if (parameters.verbosity === 0) {
            this.verbosity = 0;
        } else {
            this.verbosity = parameters.verbosity || DEFAULT_VERBOSITY;
        }
        this.color = parameters.color;

        this.started = false;
        this.finished = false;
        this.current_suite_hierarchy = [];
        this.indent_string = '  ';
    };

    TerminalReporter.prototype = {
        reportRunnerResults: function(runner) {
            var dur = (new Date()).getTime() - this.start_time,
                failed = this.executed_specs - this.passed_specs,
                spec_str = this.executed_specs + (this.executed_specs === 1 ? " spec, " : " specs, "),
                fail_str = failed + (failed === 1 ? " failure in " : " failures in "),
                summary_str = spec_str + fail_str + (dur/1000) + "s.",
                result_str = (failed && "FAILURE: " || "SUCCESS: ") + summary_str,
                result_color = failed && "red+bold" || "green+bold";

            if (this.verbosity === 2) {
                this.log("");
            }

            if (this.verbosity > 0) {
                this.log(this.inColor(result_str, result_color));
            }

            this.finished = true;
        },

        reportRunnerStarting: function(runner) {
            this.started = true;
            this.start_time = (new Date()).getTime();
            this.executed_specs = 0;
            this.passed_specs = 0;
        },

        reportSpecResults: function(spec) {
            var color = "red";

            if (spec.results().passed()) {
                this.passed_specs++;
                color = "green";
            }

            if (this.verbosity === 2) {
                var resultText = 'F';

                if (spec.results().passed()) {
                    resultText = '.';
                }
                this.log(this.inColor(resultText, color));
            } else if (this.verbosity > 2) {
                resultText = "Failed";

                if (spec.results().passed()) {
                    resultText = 'Passed';
                }
                this.log(' ' + this.inColor(resultText, color));
            }
        },

        reportSpecStarting: function(spec) {
            this.executed_specs++;
            if (this.verbosity > 2) {
                this.logCurrentSuite(spec.suite);

                this.log(this.indentWithCurrentLevel(this.indent_string + spec.description + ' ...'));
            }
        },

        reportSuiteResults: function(suite) {
            var results = suite.results(),
                failed = results.totalCount - results.passedCount,
                color = failed ? "red+bold" : "green+bold";

            if (this.verbosity > 2) {
                this.logCurrentSuite(suite);
                this.log(this.indentWithCurrentLevel(this.inColor(results.passedCount + " of "
                    + results.totalCount + " passed.", color)));
            }
        },

        indentWithCurrentLevel: function(string) {
            return new Array(this.current_suite_hierarchy.length).join(this.indent_string) + string;
        },

        recursivelyUpdateHierarchyUpToRootAndLogNewBranches: function(suite) {
            var suite_path = [],
                current_level;

            if (suite.parentSuite != null) {
                suite_path = this.recursivelyUpdateHierarchyUpToRootAndLogNewBranches(suite.parentSuite);
            }

            suite_path.push(suite);
            current_level = suite_path.length - 1;

            if (this.current_suite_hierarchy.length <= current_level
                || this.current_suite_hierarchy[current_level] !== suite) {

                this.current_suite_hierarchy = suite_path.slice(0);
                this.log(this.indentWithCurrentLevel(this.inColor(suite.description, "bold")));
            }
            return suite_path;
        },

        logCurrentSuite: function(suite) {
            var suite_path = this.recursivelyUpdateHierarchyUpToRootAndLogNewBranches(suite);
            // If we just popped down from a higher path, we need to update here
            this.current_suite_hierarchy = suite_path;
        },

        inColor: function (string, color) {
            var color_attributes = color && color.split("+"),
                ansi_string = "",
                i, attr;

            if (! this.color || ! color_attributes) {
                return string;
            }

            for(i = 0; i < color_attributes.length; i++) {
                ansi_string += "\033[" + ATTRIBUTES_TO_ANSI[color_attributes[i]] + "m";
            }
            ansi_string += string + "\033[" + ATTRIBUTES_TO_ANSI["off"] + "m";

            return ansi_string;
        },

        log: function(str) {
            var console = jasmine.getGlobal().console;
            if (console && console.log) {
                console.log(str);
            }
        }
    };

    // export public
    jasmine.TerminalReporter = TerminalReporter;
})();
