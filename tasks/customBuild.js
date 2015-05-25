/**
* Compiles a custom build of Phaser from a desired set of modules.
*/

'use strict';


// The available Phaser modules.
var modules = require('./manifests');

// Take the names of the modules which have dependencies.
var modulesWithDependencies = Object.keys(modules)
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


    grunt.registerTask('custom', 'Build a custom version of Phaser', function(arg) {

        grunt.log.writeln("---------------------");
        grunt.log.writeln("Building Phaser " + grunt.config.get('package.version'));
        grunt.log.writeln("---------------------");

        if (!grunt.option('exclude'))
        {
            grunt.log.writeln("\nUse --exclude to select which modules to exclude:\n");

            for (var module in modules)
            {
                if (modules[module].optional)
                {
                    grunt.log.writeln(module + ' - ' + modules[module].description);
                }
            }

            grunt.log.writeln("\nFor example: --exclude p2,tilemap,retrofont");
            grunt.log.writeln("Optional flags: --filename yourfilename and --sourcemap true");
            grunt.log.writeln("Note that some modules have dependencies on others.\n");

            grunt.fail.fatal("No build options were specified.");
        }
        else
        {
            //  Defaults
            grunt.config.set('sourcemap', false);
            grunt.config.set('filename', 'phaser');
            grunt.config.set('target_dir', '<%= release_dir %>');

            //  Overrides
            if (grunt.option('filename'))
            {
                grunt.config.set('filename', grunt.option('filename'));
            }

            if (grunt.option('sourcemap'))
            {
                grunt.config.set('sourcemap', grunt.option('sourcemap'));
            }

            grunt.log.writeln("Excluding modules:\n");

            var excludes = grunt.option('exclude').split(',');

            //  Check the given modules are all valid
            for (var i = 0; i < excludes.length; i++)
            {
                var exclude = excludes[i];

                if (modules[exclude])
                {
                    grunt.log.writeln("* " + exclude + ' - ' + modules[exclude].description);
                }
                else
                {
                    grunt.fail.fatal("Unknown module '" + exclude + "'");
                }
            }

            //  Handle dependencies
            grunt.log.writeln("\nChecking for unmet dependencies:\n");

            excludes = excludes.concat(filterUnmetDependencies(excludes));

            //  Ok we know the excludes array is fine, let's get this show started

            grunt.log.writeln("\nBuilding ...\n");

            var filelist = [];

            //  Clean the working folder
            var tasks = [ 'clean:build' ];

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

            grunt.config.set('filelist', filelist);

            tasks.push('concat:custom');

            tasks.push('uglify:custom');

            if (grunt.option('copy'))
            {
                tasks.push('copy:custom');
            }
            else if (grunt.option('copycustom'))
            {
                grunt.config.set('target_dir', '<%= release_custom_dir %>');
                tasks.push('copy:custom');
            }

            grunt.task.run(tasks);

        }

    });

};
