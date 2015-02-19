/// <binding />
module.exports = function (grunt) {

    var loadConfig = require('load-grunt-config');

    loadConfig(grunt, {
        configPath: __dirname + '/tasks/options',
        config: {
            release_dir: 'build',
            compile_dir: 'dist',
            modules_dir: 'dist/modules',
            docs_dir: 'docs',
            banner: require('fs').readFileSync(__dirname + '/tasks/banner.txt', 'utf8')
        }
    });

    grunt.loadTasks('tasks');

    grunt.registerTask('default', ['build']);

    grunt.registerTask('custom', 'Build a custom version of Phaser', function(arg) {

        var modules = {

            'keyboard': 'Keyboard Input',
            'gamepad': 'Gamepad Input',
            'bitmapdata': 'BitmapData',
            'graphics': 'Graphics',
            'rendertexture': 'RenderTextures',
            'text': 'Text Game Object',
            'tweens': 'Tween Manager',
            'sound': 'Sound Manager',
            'particles': 'Particle System',
            'debug': 'Debug System',
            'tilemap': 'Tilemaps',
            'arcade': 'Arcade Physics',
            'p2': 'P2 Physics',
            'nophysics': 'Exclude all physics systems, tilemaps and particles'

        };

        var autoExclude = {

            'retrofont': 'RetroFont Game Object',
            'ninja': 'Ninja Physics'

        }

        grunt.log.writeln("----------------------------");
        grunt.log.writeln("Building Phaser " + grunt.config.get('package.version') + '-custom');
        grunt.log.writeln("----------------------------");

        if (!grunt.option('exclude'))
        {
            grunt.log.errorlns("No custom build options were specified.");

            grunt.log.writeln("\nUse --exclude to select which of the following modules to exclude:\n");

            for (var key in modules)
            {
                grunt.log.writeln(key + ' - ' + modules[key]);
            }

            grunt.log.writeln("\nThe following are excluded automatically. Use --include to include them:\n");

            for (var key in autoExclude)
            {
                grunt.log.writeln(key + ' - ' + autoExclude[key]);
            }

            grunt.log.writeln("\nFor example: --exclude p2,tilemap --include retrofont\n");

            grunt.log.writeln("Note that some modules have dependencies on others.");
        }
        else
        {
            grunt.log.writeln("Excluding modules:\n");

            var excludes = grunt.option('exclude').split(',');

            for (var i = 0; i < excludes.length; i++)
            {
                if (modules[excludes[i]])
                {
                    grunt.log.writeln("* " + excludes[i] + ' - ' + modules[excludes[i]]);
                }
                else
                {
                    grunt.fail.fatal("Unknown module '" + excludes[i] + "'");
                }
            }

            grunt.log.writeln("Building blah blah:\n");

        }




    });

    grunt.registerTask('test', ['clean:dist', 'concat', 'uglify']);

    grunt.registerTask('build', ['clean:dist', 'jshint', 'concat', 'uglify']);

    grunt.registerTask('dist', ['replace:pixi', 'replace:p2', 'build', 'copy']);

    grunt.registerTask('docs', ['clean:docs', 'pixidoc', 'jsdoc:html', 'replace:docs', 'clean:out']);

    grunt.registerTask('tsdocs', ['clean:out', 'pixidoc', 'gitclone:plugins', 'jsdoc:json', 'buildtsdoc:pixi', 'buildtsdoc:phaser', 'replace:phasertsdefheader', 'clean:out']);
};
