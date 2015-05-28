/**
* Compiles a custom build of Phaser from a desired set of modules.
*/

'use strict';


//  The available Phaser modules.
var modules = require('./manifests');


module.exports = function (grunt) {

    var validateExcludes = require('./helpers/validateExcludes')(grunt, modules);

    var notOptionalModules = validateExcludes.notOptionalModules;
    var unknownModules     = validateExcludes.unknownModules;
    var unmetDependencies  = validateExcludes.unmetDependencies;

    var reportNotOptionalModules = validateExcludes.reportNotOptionalModules;
    var reportUnknownModules     = validateExcludes.reportUnknownModules;
    var reportUnmetDependencies  = validateExcludes.reportUnmetDependencies;
    var reportExcludedModules    = validateExcludes.reportExcludedModules;


    var selectBuildFiles = require('./helpers/selectBuildFiles')(modules);


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
            .fail(notOptionalModules, reportNotOptionalModules)
            .fail(unknownModules, reportUnknownModules)
            .push(unmetDependencies, reportUnmetDependencies)
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
