/**
* Compiles a custom build of Phaser from a desired set of modules.
*/

'use strict';


//  The available Phaser modules.
var modules = require('./manifests');

//  The Phaser module names.
var moduleNames = Object.keys(modules);

//  Take the names of the modules with dependencies.
var modulesWithDependencies = moduleNames
    .filter(function (name) {
        return modules[name].dependencies;
    });


module.exports = function (grunt) {

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

    function explainUnmetDependencies (missingExcludes) {
        missingExcludes.forEach(function (name) {
            var dependencies = modules[name].dependencies;
            grunt.log.writeln('Warning: ' + dependencies.reason);
        });

        return missingExcludes;
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

            var invalidExcludes = excludes.filter(function (exclude) {
                return moduleNames.indexOf(exclude) < 0;
            });

            //  Check the given modules are all valid
            if (invalidExcludes.length > 0)
            {
                grunt.log.writeln('Warning: The following module name(s) are invalid:');

                invalidExcludes.forEach(function (name) {
                    grunt.log.writeln('* ' + name);
                })

                grunt.fail.fatal('Aborting due to invalid parameter input.');
            }

            excludes.forEach(function (exclude) {
                grunt.log.writeln("* " + exclude + ' - ' + modules[exclude].description);
            });

            //  Handle dependencies
            grunt.log.writeln("\nChecking for unmet dependencies ...");

            var missingExcludes = filterUnmetDependencies(excludes);
            explainUnmetDependencies(missingExcludes);

            excludes = excludes.concat(missingExcludes);
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
