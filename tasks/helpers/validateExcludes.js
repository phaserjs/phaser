/*
*   Validate module exclusions.
*/

'use strict';


module.exports = function (grunt, modules) {

    //  The Phaser module names.
    var moduleNames = Object.keys(modules);

    //  Take the names of the modules with dependencies.
    var modulesWithDependencies = moduleNames
        .filter(function (name) {
            return modules[name].dependencies;
        });


    function validateExcludes (excludes) {
        return {
            //  Fail a validation if conditions are not met.
            fail: function (filter, reporter) {
                var result = filter(excludes);

                if (result.length > 0)
                {
                    reporter(result);

                    grunt.fail.fatal('Aborting due to invalid parameter input.');
                }

                return this;
            },

            //  If a module's dependencies are missing, select that to be
            //  removed from the build.
            push: function (filter, reporter) {
                var result = filter(excludes);

                if (result.length > 0)
                {
                    reporter(result);
                }

                excludes = excludes.concat(result);

                return this;
            },

            //  Report the excluded modules.
            result: function (reporter) {
                if (excludes.length > 0)
                {
                    reporter(excludes);
                }

                return excludes;
            }
        };
    }


    //  Filter required module names given by the user.
    function notOptionalModules (excludes) {
        return excludes.filter(function (name) {
            return modules[name] && !modules[name].optional;
        });
    }
    validateExcludes.notOptionalModules = notOptionalModules;

    //  Filter invalid module names given by the user.
    function unknownModules (excludes) {
        return excludes.filter(function (name) {
            return !modules[name];
        });
    }
    validateExcludes.unknownModules = unknownModules;

    //  Filter modules whose dependencies were excluded by the user.
    function unmetDependencies (excludes) {
        return modulesWithDependencies
            .filter(function (name) {
                var dependencies = modules[name].dependencies;

                //  Look for missing dependencies.
                return excludes.indexOf(name) < 0 &&
                    excludes.some(function (exclude) {
                        return dependencies.modules.indexOf(exclude) >= 0;
                    });
            });
    }
    validateExcludes.unmetDependencies = unmetDependencies;


    //  Report required module names.
    function reportNotOptionalModules (excludes) {
        grunt.log.writeln('\nError: Some modules are required and can not be ommited.');

        excludes.forEach(function (name) {
            grunt.log.writeln('* ' + name + ' - ' + modules[name].description);
        });
    }
    validateExcludes.reportNotOptionalModules = reportNotOptionalModules;

    //  Display invalid module names.
    function reportUnknownModules (excludes) {
        grunt.log.writeln('\nError: The following module names are misspelled or doesn\'t exist.');

        excludes.forEach(function (name) {
            grunt.log.writeln('* ' + name);
        });
    }
    validateExcludes.reportUnknownModules = reportUnknownModules;

    //  List the modules whose dependencies have been excluded.
    function reportUnmetDependencies (excludes) {
        grunt.log.writeln('\nWarning: Some modules with unmet dependencies will automatically be excluded from the build:');

        excludes.forEach(function (name) {
            var dependencies = modules[name].dependencies;
            grunt.log.writeln('\nModule "' + name+ '"');
            grunt.log.writeln('    Reason: ' + dependencies.reason);
            grunt.log.writeln('    Depends on: ' + dependencies.modules.join(', '));
        });
    }
    validateExcludes.reportUnmetDependencies = reportUnmetDependencies;

    //  List the actually excluded module names and their descriptions.
    function reportExcludedModules (excludes) {
        grunt.log.writeln('\nExcluding the following modules from this build:');

        excludes.forEach(function (exclude) {
            grunt.log.writeln("* " + exclude + ' - ' + modules[exclude].description);
        });
    }
    validateExcludes.reportExcludedModules = reportExcludedModules;


    return validateExcludes;

};
