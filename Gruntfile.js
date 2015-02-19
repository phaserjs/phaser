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
            'graphics': 'Graphics Game Object',
            'text': 'Text and BitmapText Game Objects',
            'retrofont': 'RetroFont Game Object',
            'bitmapdata': 'BitmapData',
            'rendertexture': 'RenderTextures',
            'tweens': 'Tween System',
            'sound': 'Sound System',
            'particles': 'Particle System',
            'debug': 'Debug System',
            'tilemap': 'Tilemap Support',
            'arcade': 'Arcade Physics',
            'ninja': 'Ninja Physics',
            'p2': 'P2 Physics'

        };

        grunt.log.writeln("----------------------------");
        grunt.log.writeln("Building Phaser " + grunt.config.get('package.version') + '-custom');
        grunt.log.writeln("----------------------------");

        if (!grunt.option('exclude'))
        {
            grunt.log.writeln("\nUse --exclude to select which of the following modules to exclude:\n");

            for (var key in modules)
            {
                grunt.log.writeln(key + ' - ' + modules[key]);
            }

            grunt.log.writeln("\nFor example: --exclude p2,tilemap,retrofont\n");

            grunt.log.writeln("Note that some modules have dependencies on others.\n");

            grunt.fail.fatal("No build options were specified.");
        }
        else
        {
            grunt.log.writeln("Excluding modules:\n");

            var excludes = grunt.option('exclude').split(',');

            for (var key in modules)
            {
                grunt.config.set(['custom', key], true);
            }

            for (var i = 0; i < excludes.length; i++)
            {
                if (modules[excludes[i]])
                {
                    //  It's a valid module
                    grunt.log.writeln("* " + excludes[i] + ' - ' + modules[excludes[i]]);
                    grunt.config.set(['custom', excludes[i]], false);
                }
                else
                {
                    grunt.fail.fatal("Unknown module '" + excludes[i] + "'");
                }
            }

            grunt.log.writeln("\nBuilding ...:\n");

            //  Clean the dist folder
            var tasks = [ 'clean:dist' ];

            //  Concat the module files
            for (var key in modules)
            {
                if (grunt.config.get(['custom', key]))
                {
                    tasks.push('concat:' + key);
                }
            }

            //  Concat all the modules together into a single custom build

            var filelist = [];

            filelist.push('<%= concat.intro.dest %>');
            filelist.push('<%= concat.geom.dest %>');
            filelist.push('<%= concat.core.dest %>');
            filelist.push('<%= concat.input.dest %>');

            if (grunt.config.get('custom.keyboard'))
            {
                filelist.push('<%= concat.keyboard.dest %>');
            }

            if (grunt.config.get('custom.gamepad'))
            {
                filelist.push('<%= concat.gamepad.dest %>');
            }

            filelist.push('<%= concat.components.dest %>');
            filelist.push('<%= concat.gameobjects.dest %>');

            if (grunt.config.get('custom.bitmapdata'))
            {
                filelist.push('<%= concat.bitmapdata.dest %>');
            }

            if (grunt.config.get('custom.graphics'))
            {
                filelist.push('<%= concat.graphics.dest %>');
            }

            if (grunt.config.get('custom.rendertexture'))
            {
                filelist.push('<%= concat.rendertexture.dest %>');
            }

            if (grunt.config.get('custom.text'))
            {
                filelist.push('<%= concat.text.dest %>');
            }

            if (grunt.config.get('custom.bitmaptext'))
            {
                filelist.push('<%= concat.bitmaptext.dest %>');
            }

            if (grunt.config.get('custom.retrofont'))
            {
                filelist.push('<%= concat.retrofont.dest %>');
            }

            filelist.push('<%= concat.system.dest %>');
            filelist.push('<%= concat.math.dest %>');
            filelist.push('<%= concat.net.dest %>');

            if (grunt.config.get('custom.tweens'))
            {
                filelist.push('<%= concat.tweens.dest %>');
            }
            else
            {
                //  TweenManager stub
            }

            filelist.push('<%= concat.time.dest %>');
            filelist.push('<%= concat.animation.dest %>');
            filelist.push('<%= concat.loader.dest %>');

            if (grunt.config.get('custom.sound'))
            {
                filelist.push('<%= concat.sound.dest %>');
            }
            else
            {
                //  SoundManager stub
            }

            if (grunt.config.get('custom.debug'))
            {
                filelist.push('<%= concat.debug.dest %>');
            }

            filelist.push('<%= concat.utils.dest %>');
            filelist.push('<%= concat.physics.dest %>');

            if (grunt.config.get('custom.particles'))
            {
                filelist.push('<%= concat.particles.dest %>');
            }

            if (grunt.config.get('custom.tilemap'))
            {
                filelist.push('<%= concat.tilemap.dest %>');
            }

            if (grunt.config.get('custom.arcade'))
            {
                filelist.push('<%= concat.arcade.dest %>');
            }

            //  + arcade tmap col

            if (grunt.config.get('custom.p2'))
            {
                filelist.push('<%= concat.p2.dest %>');
            }

            if (grunt.config.get('custom.ninja'))
            {
                filelist.push('<%= concat.ninja.dest %>');
            }

            tasks.push('concat:custom');
            tasks.push('uglify:custom');

            grunt.task.run(tasks);
        }

    });

    grunt.registerTask('test', ['clean:dist', 'concat', 'uglify']);

    grunt.registerTask('build', ['clean:dist', 'jshint', 'concat', 'uglify']);

    grunt.registerTask('dist', ['replace:pixi', 'replace:p2', 'build', 'copy']);

    grunt.registerTask('docs', ['clean:docs', 'pixidoc', 'jsdoc:html', 'replace:docs', 'clean:out']);

    grunt.registerTask('tsdocs', ['clean:out', 'pixidoc', 'gitclone:plugins', 'jsdoc:json', 'buildtsdoc:pixi', 'buildtsdoc:phaser', 'replace:phasertsdefheader', 'clean:out']);
};
