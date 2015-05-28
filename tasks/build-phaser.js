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

    var validateExcludes = require('./helpers/validateExcludes')(grunt);

    var selectBuildFiles = require('./helpers/selectBuildFiles')(modules);

    //  Filter required module names given by the user.
    function filterNotOptionalModules (excludes) {
        return excludes.filter(function (name) {
            return modules[name] && !modules[name].optional;
        });
    }

    //  Report required module names.
    function reportNotOptionalModules (excludes) {
        grunt.log.writeln('\nError: Some modules are required and can not be ommited.');

        excludes.forEach(function (name) {
            grunt.log.writeln('* ' + name + ' - ' + modules[name].description);
        });
    }

    //  Filter invalid module names given by the user.
    function filterUnknownModules (excludes) {
        return excludes.filter(function (name) {
            return !modules[name];
        });
    }

    //  Display invalid module names.
    function reportUnknownModules (excludes) {
        grunt.log.writeln('\nError: The following module names are misspelled or doesn\'t exist.');

        excludes.forEach(function (name) {
            grunt.log.writeln('* ' + name);
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

    //  List the actually excluded module names and their descriptions.
    function reportExcludedModules (excludes) {
        grunt.log.writeln('\nExcluding the following modules from this build:');

        excludes.forEach(function (exclude) {
            grunt.log.writeln("* " + exclude + ' - ' + modules[exclude].description);
        });
    }


    grunt.registerMultiTask('build-phaser', 'Compiles a custom build of Phaser from a desired set of modules.', function () {

        //  Initialize options, with default values.
        var options = this.options({
            filename: 'phaser',
            sourcemap: true,
            excludes: [ 'ninja', 'creature' ],
            copy: true,
            copyCustom: false
        });

        //  Extract options as local variables.
        var filename   = options.filename;
        var sourcemap  = options.sourcemap;
        var excludes   = options.excludes;
        var copy       = options.copy;
        var copyCustom = options.copyCustom;

        grunt.log.writeln("---------------------");
        grunt.log.writeln("Building Phaser " + grunt.config.get('package.version'));
        grunt.log.writeln("---------------------");

        //  Handle user choices.
        excludes = validateExcludes(excludes)
            .fail(filterNotOptionalModules, reportNotOptionalModules)
            .fail(filterUnknownModules, reportUnknownModules)
            .push(filterUnmetDependencies, reportUnmetDependencies)
            .result(reportExcludedModules);

        //  The excludes were filtered and validated, now proceeding with the
        //  building.
        grunt.log.writeln("\nBuilding ...");

        //  Select the module files to be compiled.
        grunt.config.set('filelist', selectBuildFiles(excludes));

        //  Set the output filename.
        grunt.config.set('filename', filename);

        //  Generate sourcemaps for minified scripts?
        grunt.config.set('sourcemap', sourcemap);

        //  Call the following tasks to build Phaser:
        //  -   Clean the working folder;
        //  -   Compile the library by concatenating the selected modules;
        //  -   Minify the compiled library script with optional source map
        //      output.
        var tasks = [ 'clean:build', 'concat:custom', 'uglify:custom' ];

        //  Copy to 'build' directory?
        if (copy)
        {
            tasks.push('copy:custom');

            //  Copy into 'build/custom'?
            if (copyCustom)
            {
                grunt.config.set('target_dir', '<%= release_custom_dir %>');
            }
        }

        //  Run all tasks.
        grunt.task.run(tasks);

    });

};
