/**
* Compiles a custom build of Phaser from a desired set of modules.
*/

'use strict';


//  The available Phaser modules.
var modules = require('./manifests');

//  The Phaser module names.
var moduleNames = Object.keys(modules);

// Optional Phaser modules.
var optionalModules = moduleNames
    .filter(function (name) {
        return modules[name].optional;
    });

//  Take the names of the modules with dependencies.
var modulesWithDependencies = moduleNames
    .filter(function (name) {
        return modules[name].dependencies;
    });


module.exports = function (grunt) {

    //  Validate module exclusions.
    function validateExcludes (excludes) {
        return {
            fail: function (filter, reporter) {
                var result = filter(excludes);

                if (result.length > 0)
                {
                    reporter(result);

                    grunt.fail.fatal('Aborting due to invalid parameter input.');
                }

                return this;
            },

            push: function (filter, reporter) {
                var result = filter(excludes);

                reporter(result);
                excludes = excludes.concat(result);

                return this;
            },

            result (reporter) {
                reporter(excludes);

                return excludes;
            }
        };
    };

    // Filter required module names given by the user.
    function filterNotOptionalModules (excludes) {
        return excludes.filter(function (name) {
            return optionalModules.indexOf(name) < 0;
        });
    }

    // Report required module names.
    function reportNotOptionalModules (excludes) {
        grunt.log.writeln('Error: Some modules are required and can not be ommited.');

        excludes.forEach(function (name) {
            grunt.log.writeln('* ' + name + ' - ' + modules[name].description);
        });
    }

    //  Filter invalid module names given by the user.
    function filterUnknownModules (excludes) {
        return excludes.filter(function (name) {
            return moduleNames.indexOf(name) < 0;
        });
    }

    //  Display invalid module names.
    function reportUnknownModules (excludes) {
        excludes.forEach(function (name) {
            grunt.log.error('Error: Unknown module "' + name + '".');
        });
    }

    //  Filter modules whose dependencies were excluded by the user.
    function filterUnmetDependencies (excludes) {
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

    function reportUnmetDependencies (excludes) {
        grunt.log.writeln('Warning: Some modules cannot be included in this build due to dependency tracking:');

        excludes.forEach(function (name) {
            var dependencies = modules[name].dependencies;
            grunt.log.writeln('\nModule "' + name+ '"');
            grunt.log.writeln('    Reason: ' + dependencies.reason);
            grunt.log.writeln('    Depends on: ' + dependencies.modules.join(', '));
        });
    }

    function reportExcludedModules (excludes) {
        grunt.log.writeln('\nExcluding the following modules from this build:');

        excludes.forEach(function (exclude) {
            grunt.log.writeln("* " + exclude + ' - ' + modules[exclude].description);
        });
    }

    grunt.registerMultiTask('build-phaser', 'Compiles a custom build of Phaser from a desired set of modules.', function () {

        // Initialize options, with default values.
        var options = this.options({
            filename: 'phaser',
            sourcemap: true,
            excludes: [ 'ninja', 'creature' ],
            copy: true,
            copyCustom: false
        });

        // Extract options as local variables.
        var filename   = options.filename;
        var sourcemap  = options.sourcemap;
        var excludes   = options.excludes;
        var copy       = options.copy;
        var copyCustom = options.copyCustom;

        grunt.log.writeln("---------------------");
        grunt.log.writeln("Building Phaser " + grunt.config.get('package.version'));
        grunt.log.writeln("---------------------");

        //  Handle user choices.
        if (excludes.length > 0)
        {
            grunt.log.writeln("Excluding modules:\n");

            excludes = validateExcludes(excludes)
                .fail(filterNotOptionalModules, reportNotOptionalModules)
                .fail(filterUnknownModules, reportUnknownModules)
                .push(filterUnmetDependencies, reportUnmetDependencies)
                .result(reportExcludedModules);
        }

        //  The excludes were filtered and validated, now proceeding with the
        //  building.
        grunt.log.writeln("\nBuilding ...");

        //  Clean the working folder
        var tasks = [ 'clean:build' ];

        // Process which modules will be compiled.
        var filelist = [];

        for (var key in modules)
        {
            if (modules[key].stubs && excludes.indexOf(key) !== -1)
            {
                //  If the module IS excluded and has a stub, we need that
                tasks.push('concat:' + key + 'Stub');

                filelist.push('<%= modules_dir %>/' + key + '.js');
            }
            else if (modules[key].optional === false || excludes.indexOf(key) === -1)
            {
                //  If it's required or NOT excluded, add it to the tasks list
                tasks.push('concat:' + key);

                filelist.push('<%= modules_dir %>/' + key + '.js');
            }
        }

        // Set the source files to be compiled.
        grunt.config.set('filelist', filelist);

        // Call these tasks to compile the modules.
        tasks.push('concat:custom');
        tasks.push('uglify:custom');

        // Set the output filename.
        grunt.config.set('filename', filename);

        // Generate sourcemaps for minified scripts?
        grunt.config.set('sourcemap', sourcemap);

        // Copy to 'build' directory?
        if (copy)
        {
            tasks.push('copy:custom');
        }

        // Copy into 'build/custom'?
        if (copyCustom)
        {
            grunt.config.set('target_dir', '<%= release_custom_dir %>');
        }

        // Run all tasks.
        grunt.task.run(tasks);

    });

};
