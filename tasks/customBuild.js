/**
* Compiles a custom build of Phaser from a desired set of modules.
*/

'use strict';


module.exports = function (grunt) {

    grunt.registerTask('custom', 'Build a custom version of Phaser', function () {

        //  Defaults
        var filename   = 'phaser-custom';
        var sourcemap  = grunt.option('sourcemap');
        var excludes   = [];

        // Show task options.
        if (grunt.option('usage'))
        {
            var modules = require('./manifests');

            grunt.log.writeln('\nUse --exclude to select which modules to exclude:\n');

            // List optional modules.
            Object.keys(modules)
                .filter(function (name) { return modules[name].optional })
                .forEach(function (name) {
                    grunt.log.writeln('* ' + name + ' - ' + modules[name].description);
                });

            grunt.log
                .writeln('\nFor example: --exclude p2,tilemap,retrofont')
                .writeln('Note that some modules have dependencies on others.')
                .writeln('\nOptional flags:')
                .writeln('    --filename <yourfilename> - use a custom file name. (default: ' + filename + ')')
                .writeln('    --sourcemap - generate sourcemaps for minified scripts.');

            // Do nothing.
            return;
        }

        //  Overrides
        if (typeof grunt.option('filename') === 'string')
        {
            filename = grunt.option('filename');
        }

        if (typeof grunt.option('exclude') === 'string')
        {
            excludes = grunt.option('exclude').split(',');
        }

        grunt.config.merge({
            'build-phaser': {
                'custom': {
                    'options': {
                        filename  : filename,
                        sourcemap : !!sourcemap,
                        excludes  : excludes,
                        copy      : false,
                        copyCustom: false
                    }
                }
            }
        });

        grunt.task.run('build-phaser:custom');

    });

};
