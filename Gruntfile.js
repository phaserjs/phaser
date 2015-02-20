/// <binding />
module.exports = function (grunt) {

    var loadConfig = require('load-grunt-config');

    loadConfig(grunt, {
        configPath: __dirname + '/tasks/options',
        config: {
            target_dir: 'build',
            release_dir: 'build',
            release_custom_dir: 'build/custom',
            compile_dir: 'dist',
            modules_dir: 'dist/modules',
            docs_dir: 'docs',
            sourcemap: false,
            filename: 'phaser',
            filelist: [],
            banner: require('fs').readFileSync(__dirname + '/tasks/banner.txt', 'utf8')
        }
    });

    grunt.loadTasks('tasks');

    grunt.registerTask('default', ['build']);

    grunt.registerTask('docs', ['clean:docs', 'pixidoc', 'jsdoc:html', 'replace:docs', 'clean:out']);
    grunt.registerTask('tsdocs', ['clean:out', 'pixidoc', 'gitclone:plugins', 'jsdoc:json', 'buildtsdoc:pixi', 'buildtsdoc:phaser', 'replace:phasertsdefheader', 'clean:out']);

    grunt.registerTask('custom', 'Build a custom version of Phaser', function(arg) {

        var modules = {

            'pixi':             { 'description': 'Pixi.js',                                     'optional': true },
            'intro':            { 'description': 'Phaser UMD wrapper',                          'optional': false },
            'phaser':           { 'description': 'Phaser Globals',                              'optional': false },
            'geom':             { 'description': 'Geometry Classes',                            'optional': false },
            'core':             { 'description': 'Phaser Core',                                 'optional': false },
            'input':            { 'description': 'Input Manager + Mouse and Touch Support',     'optional': false },
            'gamepad':          { 'description': 'Gamepad Input',                               'optional': true },
            'keyboard':         { 'description': 'Keyboard Input',                              'optional': true },
            'components':       { 'description': 'Game Object Components',                      'optional': false },
            'gameobjects':      { 'description': 'Core Game Objects',                           'optional': false },
            'bitmapdata':       { 'description': 'BitmapData Game Object',                      'optional': true },
            'graphics':         { 'description': 'Graphics Game Object',                        'optional': true },
            'rendertexture':    { 'description': 'RenderTexture Game Object',                   'optional': true },
            'text':             { 'description': 'Text Game Object (inc. Web Font Support)',    'optional': true },
            'bitmaptext':       { 'description': 'BitmapText Support',                          'optional': true },
            'retrofont':        { 'description': 'Retro Fonts Support',                         'optional': true },
            'system':           { 'description': 'System Classes',                              'optional': false },
            'math':             { 'description': 'Math, QuadTree and RND',                      'optional': false },
            'net':              { 'description': 'Network Class',                               'optional': true },
            'tweens':           { 'description': 'Tween Manager',                               'optional': true },
            'time':             { 'description': 'Time and Clock Manager',                      'optional': false },
            'animation':        { 'description': 'Animation and Frame Manager',                 'optional': false },
            'loader':           { 'description': 'Loader and Cache',                            'optional': false },
            'sound':            { 'description': 'Sound Support (Web Audio and HTML Audio)',    'optional': true },
            'debug':            { 'description': 'Debug Class',                                 'optional': true },
            'utils':            { 'description': 'Core Utilities',                              'optional': false },
            'physics':          { 'description': 'Physics Manager',                             'optional': false },
            'arcade':           { 'description': 'Arcade Physics',                              'optional': true },
            'ninja':            { 'description': 'Ninja Physics',                               'optional': true },
            'p2':               { 'description': 'P2 Physics',                                  'optional': true },
            'tilemaps':         { 'description': 'Tilemap Support',                             'optional': true },
            'particles':        { 'description': 'Arcade Physics Particle System',              'optional': true },
            'outro':            { 'description': 'Phaser UMD closure',                          'optional': false }

        };

        grunt.log.writeln("---------------------");
        grunt.log.writeln("Building Phaser " + grunt.config.get('package.version'));
        grunt.log.writeln("---------------------");

        if (!grunt.option('exclude'))
        {
            grunt.log.writeln("\nUse --exclude to select which modules to exclude:\n");

            for (var key in modules)
            {
                if (modules[key].optional)
                {
                    grunt.log.writeln(key + ' - ' + modules[key].description);
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
                var key = excludes[i];

                if (modules[key])
                {
                    grunt.log.writeln("* " + key + ' - ' + modules[key].description);
                }
                else
                {
                    grunt.fail.fatal("Unknown module '" + key + "'");
                }
            }

            //  Handle basic dependencies

            if (excludes['arcade'] && !excludes['particles'])
            {
                grunt.log.writeln("Warning: Particles rely on Arcade Physics. Excluding from build.");
                excludes.push('particles');
            }

            if (excludes['rendertexture'] && !excludes['retrofont'])
            {
                grunt.log.writeln("Warning: RetroFonts rely on RenderTextures. Excluding from build.");
                excludes.push('retrofont');
            }

            //  Ok we know the excludes array is fine, let's get this show started

            grunt.log.writeln("\nBuilding ...\n");

            var filelist = [];

            //  Clean the working folder
            var tasks = [ 'clean:build' ];

            for (var key in modules)
            {
                //  If it's required or NOT excluded, add it to the tasks list
                if (modules[key].optional === false || excludes.indexOf(key) === -1)
                {
                    tasks.push('concat:' + key);

                    filelist.push('<%= modules_dir %>/' + key + '.js');

                    //  Special case: If they have Arcade Physics AND Tilemaps we need to include the Tilemap Collision class
                    if (key === 'arcade' && !excludes['tilemaps'])
                    {
                        tasks.push('concat:arcadeTilemaps');
                        filelist.push('<%= modules_dir %>/arcadeTilemaps.js');
                    }
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

    grunt.registerTask('dist', 'Build all Phaser versions', function() {

        grunt.task.run('clean:release');
        grunt.task.run('full');
        grunt.task.run('arcadephysics');
        grunt.task.run('nophysics');
        grunt.task.run('minimum');

    });

    grunt.registerTask('full', 'Phaser complete', function() {

        grunt.option('exclude', 'ninja');
        grunt.option('filename', 'phaser');
        grunt.option('sourcemap', true);
        grunt.option('copy', true);

        grunt.task.run('custom');

    });

    grunt.registerTask('arcadephysics', 'Phaser with Arcade Physics, Tilemaps and Particles', function() {

        grunt.option('exclude', 'ninja,p2');
        grunt.option('filename', 'phaser-arcade-physics');
        grunt.option('sourcemap', true);
        grunt.option('copy', false);
        grunt.option('copycustom', true);

        grunt.task.run('custom');

    });

    grunt.registerTask('nophysics', 'Phaser without physics, tilemaps or particles', function() {

        grunt.option('exclude', 'arcade,ninja,p2,tilemaps,particles');
        grunt.option('filename', 'phaser-no-physics');
        grunt.option('sourcemap', true);
        grunt.option('copy', false);
        grunt.option('copycustom', true);

        grunt.task.run('custom');

    });

    grunt.registerTask('minimum', 'Phaser without any optional modules except Pixi', function() {

        grunt.option('exclude', 'gamepad,keyboard,bitmapdata,graphics,rendertexture,text,bitmaptext,retrofont,net,tweens,sound,debug,arcade,ninja,p2,tilemaps,particles');
        grunt.option('filename', 'phaser-minimum');
        grunt.option('sourcemap', true);
        grunt.option('copy', false);
        grunt.option('copycustom', true);

        grunt.task.run('custom');

    });

};
