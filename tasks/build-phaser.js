/**
* Compiles a custom build of Phaser from a desired set of modules.
*/

'use strict';


//  The available Phaser modules.
var modules = require('./manifests');

//  The Phaser module names.
var moduleNames = Object.keys(modules);

//  Take the names of the modules which have dependencies.
var modulesWithDependencies = moduleNames
    .reduce(function (memo, name) {
        if (modules[name].dependencies)
        {
            memo[name] = modules[name].dependencies;
        }

        return memo;
    }, {});


module.exports = function (grunt) {

    //  Filter modules whose dependencies were excluded.
    function filterUnmetDependencies (excludes) {
        return Object.keys(modulesWithDependencies)
            .reduce(function (memo, name) {
                var dependencies = modulesWithDependencies[name].modules;
                var reason = modulesWithDependencies[name].reason;

                //  Look for missing dependencies.
                var mismatch =
                    excludes.indexOf(name) < 0 &&
                    excludes.some(function (exclude) {
                        return dependencies.indexOf(exclude) >= 0;
                    });

                //  A required module is missing for this dependency:
                //  Warn the user and select it for removal.
                if (mismatch)
                {
                    grunt.log.writeln('Warning: ' + reason);
                    memo.push(name);
                }

                return memo;
            }, []);
    }

    grunt.registerMultiTask('build-phaser', 'Build a custom version of Phaser', function () {

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

            excludes = excludes.concat(filterUnmetDependencies(excludes));
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
