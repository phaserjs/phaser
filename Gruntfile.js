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
            pixiFilename: 'pixi.js',
            p2Filename: 'p2.js',
            creatureFilename: 'creature.js',
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

            'intro':            { 'description': 'Phaser UMD wrapper',                          'optional': true, 'stub': false },
            'phaser':           { 'description': 'Phaser Globals',                              'optional': false, 'stub': false },
            'geom':             { 'description': 'Geometry Classes',                            'optional': false, 'stub': false },
            'core':             { 'description': 'Phaser Core',                                 'optional': false, 'stub': false },
            'input':            { 'description': 'Input Manager + Mouse and Touch Support',     'optional': false, 'stub': false },
            'gamepad':          { 'description': 'Gamepad Input',                               'optional': true, 'stub': false },
            'keyboard':         { 'description': 'Keyboard Input',                              'optional': true, 'stub': false },
            'components':       { 'description': 'Game Object Components',                      'optional': false, 'stub': false },
            'gameobjects':      { 'description': 'Core Game Objects',                           'optional': false, 'stub': false },
            'bitmapdata':       { 'description': 'BitmapData Game Object',                      'optional': true, 'stub': false },
            'graphics':         { 'description': 'Graphics and PIXI Mask Support',              'optional': true, 'stub': false },
            'rendertexture':    { 'description': 'RenderTexture Game Object',                   'optional': true, 'stub': false },
            'text':             { 'description': 'Text Game Object (inc. Web Font Support)',    'optional': true, 'stub': false },
            'bitmaptext':       { 'description': 'BitmapText Game Object',                      'optional': true, 'stub': false },
            'retrofont':        { 'description': 'Retro Fonts Game Object',                     'optional': true, 'stub': false },
            'rope':             { 'description': 'Rope and Strip Game Object',                  'optional': true, 'stub': false },
            'tilesprite':       { 'description': 'Tile Sprite Game Object',                     'optional': true, 'stub': true },
            'system':           { 'description': 'System Classes',                              'optional': false, 'stub': false },
            'math':             { 'description': 'Math, QuadTree and RND',                      'optional': false, 'stub': false },
            'net':              { 'description': 'Network Class',                               'optional': true, 'stub': true },
            'tweens':           { 'description': 'Tween Manager',                               'optional': true, 'stub': true },
            'time':             { 'description': 'Time and Clock Manager',                      'optional': false, 'stub': false },
            'animation':        { 'description': 'Animation and Frame Manager',                 'optional': false, 'stub': false },
            'loader':           { 'description': 'Loader and Cache',                            'optional': false, 'stub': false },
            'sound':            { 'description': 'Sound Support (Web Audio and HTML Audio)',    'optional': true, 'stub': true },
            'scale':            { 'description': 'Scale and Full Screen Manager',               'optional': true, 'stub': true },
            'debug':            { 'description': 'Debug Class',                                 'optional': true, 'stub': true },
            'dom':              { 'description': 'DOM Utilities',                               'optional': true, 'stub': true },
            'utils':            { 'description': 'Core Utilities',                              'optional': false, 'stub': false },
            'create':           { 'description': 'Create Support',                              'optional': true, 'stub': true },
            'flexgrid':         { 'description': 'Flex Grid and Flex Layer',                    'optional': true, 'stub': false },
            'color':            { 'description': 'Color Functions',                             'optional': true, 'stub': true },
            'physics':          { 'description': 'Physics Manager',                             'optional': false, 'stub': false },
            'arcade':           { 'description': 'Arcade Physics',                              'optional': true, 'stub': false },
            'ninja':            { 'description': 'Ninja Physics',                               'optional': true, 'stub': false },
            'p2':               { 'description': 'P2 Physics',                                  'optional': true, 'stub': false },
            'tilemaps':         { 'description': 'Tilemap Support',                             'optional': true, 'stub': false },
            'particles':        { 'description': 'Arcade Physics Particle System',              'optional': true, 'stub': true },
            'creature':         { 'description': 'Creature Animation Tool Support',             'optional': true, 'stub': false },
            'video':            { 'description': 'Video Game Object',                           'optional': true, 'stub': false },
            'outro':            { 'description': 'Phaser UMD closure',                          'optional': true, 'stub': false }

        };

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

            grunt.log.writeln("\nFor example: --exclude p2,tilemaps,retrofont\n");
            grunt.log.writeln("Optional flags:\n");
            grunt.log.writeln("--filename yourfilename (builds to your own custom file name)");
            grunt.log.writeln("--sourcemap true (creates a source map)");
            grunt.log.writeln("--split true (splits Phaser, PIXI, p2 and Creature into separate files)");
            grunt.log.writeln("--uglify true (runs Uglify on the output files)");
            grunt.log.writeln("\nNote that some modules have dependencies on others.\n");

            grunt.fail.fatal("No build options were specified.");
        }
        else
        {
            //  Defaults
            grunt.config.set('sourcemap', false);
            grunt.config.set('filename', 'phaser');
            grunt.config.set('split', false);
            grunt.config.set('target_dir', '<%= release_dir %>');

            var split = false;

            //  Overrides
            if (grunt.option('filename'))
            {
                grunt.config.set('filename', grunt.option('filename'));
            }

            if (grunt.option('sourcemap'))
            {
                grunt.config.set('sourcemap', grunt.option('sourcemap'));
            }

            if (grunt.option('split'))
            {
                grunt.config.set('split', grunt.option('split'));
                split = grunt.option('split');
            }

            grunt.log.writeln("Excluding modules:\n");

            var excludedKeys = [];

            //  Nothing is excluded!
            var excludes = false;

            if (grunt.option('exclude') !== 'null')
            {
                excludes = grunt.option('exclude').split(',');

                //  Check the given modules are all valid
                for (var i = 0; i < excludes.length; i++)
                {
                    var exclude = excludes[i];

                    if (modules[exclude])
                    {
                        grunt.log.writeln("* " + exclude + ' - ' + modules[exclude].description);
                        excludedKeys[exclude] = true;
                    }
                    else
                    {
                        grunt.fail.fatal("Unknown module '" + exclude + "'");
                    }
                }

                //  Handle basic dependencies

                if (excludedKeys['arcade'] && !excludedKeys['particles'])
                {
                    grunt.log.writeln("Warning: Particles rely on Arcade Physics which has been excluded. Removing Particles from build.");
                    excludes.push('particles');
                }

                if (excludedKeys['rendertexture'] && !excludedKeys['retrofont'])
                {
                    grunt.log.writeln("Warning: RetroFonts rely on RenderTextures. Excluding from build.");
                    excludes.push('retrofont');
                }
            }

            /////////////////////////////////////////////////////////////////////////
            //  Ok we know the excludes array is fine, let's get this show started //
            /////////////////////////////////////////////////////////////////////////

            var filelist = [];
            var pixiFilelist = [];

            //  Clean the working folder
            var tasks = [ 'clean:build' ];

            if (split)
            {

                ////////////////////////////////////////
                //  Split build (for Browserify, etc) //
                ////////////////////////////////////////

                grunt.log.writeln("\nSplitting Globals ...\n");

                //  1) Creature

                if (!excludedKeys['creature'])
                {
                    grunt.log.writeln("-> Creature");
                    tasks.push('concat:creatureGlobalSplit');

                    if (grunt.option('uglify'))
                    {
                        tasks.push('uglify:creature');
                    }
                }

                //  2) P2

                if (!excludedKeys['p2'])
                {
                    grunt.log.writeln("-> P2.js");
                    tasks.push('concat:p2GlobalSplit');

                    if (grunt.option('uglify'))
                    {
                        tasks.push('uglify:p2');
                    }
                }

                //  3) PIXI

                grunt.log.writeln("-> PIXI");
                tasks.push('concat:pixiIntro');
                pixiFilelist.push('<%= modules_dir %>/pixi-intro.js');

                //  Optional Rope
                if (!excludedKeys['rope'])
                {
                    grunt.log.writeln("-> PIXI.Rope");
                    tasks.push('concat:pixiRope');
                    pixiFilelist.push('<%= modules_dir %>/pixi-rope.js');
                }

                //  Optional Tilesprite
                if (!excludedKeys['tilesprite'])
                {
                    grunt.log.writeln("-> PIXI.TileSprite");
                    tasks.push('concat:pixiTileSprite');
                    pixiFilelist.push('<%= modules_dir %>/pixi-tilesprite.js');
                }

                //  PIXI Outro
                tasks.push('concat:pixiOutro');
                pixiFilelist.push('<%= modules_dir %>/pixi-outro.js');

                grunt.config.set('pixiFilelist', pixiFilelist);

                tasks.push('concat:pixi');

                if (grunt.option('uglify'))
                {
                    tasks.push('uglify:pixi');
                }
            }
            else
            {
                ///////////////////
                //  Single build //
                ///////////////////

                grunt.log.writeln("\nPackaging Globals ...\n");

                //  Prepare the globals first, the libs that live outside of Phaser

                //  1) Creature

                if (!excludedKeys['creature'])
                {
                    grunt.log.writeln("-> Creature");
                    tasks.push('concat:creatureGlobal');
                    filelist.push('<%= modules_dir %>/creature-global.js');
                }

                //  2) P2

                if (!excludedKeys['p2'])
                {
                    grunt.log.writeln("-> P2.js");
                    tasks.push('concat:p2Global');
                    filelist.push('<%= modules_dir %>/p2-global.js');
                }

                //  3) PIXI

                grunt.log.writeln("-> PIXI");
                tasks.push('concat:pixiIntro');
                filelist.push('<%= modules_dir %>/pixi-intro.js');

                //  Optional Rope
                if (!excludedKeys['rope'])
                {
                    grunt.log.writeln("-> PIXI.Rope");
                    tasks.push('concat:pixiRope');
                    filelist.push('<%= modules_dir %>/pixi-rope.js');
                }

                //  Optional Tilesprite
                if (!excludedKeys['tilesprite'])
                {
                    grunt.log.writeln("-> PIXI.TileSprite");
                    tasks.push('concat:pixiTileSprite');
                    filelist.push('<%= modules_dir %>/pixi-tilesprite.js');
                }

                //  PIXI Outro
                tasks.push('concat:pixiOutro');
                filelist.push('<%= modules_dir %>/pixi-outro.js');
            }

            //  And now for Phaser

            grunt.log.writeln("\nBuilding ...");

            if (excludes !== false)
            {
                for (var key in modules)
                {
                    if (modules[key].stub && excludes.indexOf(key) !== -1)
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

                        //  Special case: If they have Arcade Physics AND Tilemaps we need to include the Tilemap Collision class
                        if (key === 'arcade' && !excludes['tilemaps'])
                        {
                            tasks.push('concat:arcadeTilemaps');
                            filelist.push('<%= modules_dir %>/arcadeTilemaps.js');
                        }
                    }
                }
            }
            else
            {
                //  The full monty ...

                for (var mkey in modules)
                {
                    tasks.push('concat:' + mkey);
                    filelist.push('<%= modules_dir %>/' + mkey + '.js');
                }
            }

            grunt.config.set('filelist', filelist);

            tasks.push('concat:custom');

            if (grunt.option('uglify'))
            {
                tasks.push('uglify:custom');
            }

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

    grunt.registerTask('dist', 'Compile all Phaser versions and copy to the build folder', function() {

        grunt.task.run('clean:release');
        grunt.task.run('full');
        grunt.task.run('arcadephysics');
        grunt.task.run('nophysics');
        grunt.task.run('minimum');

    });

    grunt.registerTask('build', 'Compile all Phaser versions just to the dist folder', function() {

        grunt.option('exclude', 'ninja,creature');
        grunt.option('filename', 'phaser');
        grunt.option('sourcemap', true);
        grunt.option('copy', false);
        grunt.option('uglify', true);

        grunt.task.run('custom');

    });

    grunt.registerTask('full', 'Phaser (excluding Ninja and Creature)', function() {

        grunt.option('exclude', 'ninja,creature');
        grunt.option('filename', 'phaser');
        grunt.option('sourcemap', true);
        grunt.option('copy', true);
        grunt.option('uglify', true);

        grunt.task.run('custom');

    });

    grunt.registerTask('complete', 'Phaser Build with all libs', function() {

        grunt.option('exclude', 'null');
        grunt.option('filename', 'phaser-complete');
        grunt.option('sourcemap', false);
        grunt.option('copy', true);
        grunt.option('copycustom', true);
        grunt.option('uglify', true);

        grunt.task.run('custom');

    });

    grunt.registerTask('split', 'Compile Phaser to dist folder and splits the globals into single files', function() {

        grunt.option('exclude', 'ninja,creature');
        grunt.option('filename', 'phaser');
        grunt.option('sourcemap', true);
        grunt.option('copy', false);
        grunt.option('uglify', true);
        grunt.option('split', true);

        grunt.task.run('custom');

    });

    grunt.registerTask('test', 'Phaser Test Build (all libs)', function() {

        grunt.option('exclude', 'ninja,creature');
        grunt.option('filename', 'phaser-test');
        grunt.option('sourcemap', false);
        grunt.option('copy', false);
        grunt.option('uglify', false);

        grunt.task.run('custom');

    });

    grunt.registerTask('creature', 'Phaser + Creature', function() {

        grunt.option('exclude', 'ninja');
        grunt.option('filename', 'phaser-creature');
        grunt.option('sourcemap', true);
        grunt.option('copy', true);
        grunt.option('copycustom', true);
        grunt.option('uglify', true);

        grunt.task.run('custom');

    });

    grunt.registerTask('arcadephysics', 'Phaser with Arcade Physics, Tilemaps and Particles', function() {

        grunt.option('exclude', 'ninja,p2,creature');
        grunt.option('filename', 'phaser-arcade-physics');
        grunt.option('sourcemap', true);
        grunt.option('copy', false);
        grunt.option('copycustom', true);
        grunt.option('uglify', true);

        grunt.task.run('custom');

    });

    grunt.registerTask('ninjaphysics', 'Phaser with Ninja Physics and Tilemaps', function() {

        grunt.option('exclude', 'p2,particles,creature');
        grunt.option('filename', 'phaser-ninja-physics');
        grunt.option('sourcemap', true);
        grunt.option('copy', false);
        grunt.option('copycustom', true);
        grunt.option('uglify', true);

        grunt.task.run('custom');

    });

    grunt.registerTask('nophysics', 'Phaser without physics, tilemaps or particles', function() {

        grunt.option('exclude', 'arcade,ninja,p2,tilemaps,particles,creature');
        grunt.option('filename', 'phaser-no-physics');
        grunt.option('sourcemap', true);
        grunt.option('copy', false);
        grunt.option('copycustom', true);
        grunt.option('uglify', true);

        grunt.task.run('custom');

    });

    grunt.registerTask('minimum', 'Phaser without any optional modules', function() {

        grunt.option('exclude', 'gamepad,keyboard,bitmapdata,graphics,rendertexture,text,bitmaptext,retrofont,net,tweens,sound,debug,arcade,ninja,p2,tilemaps,particles,creature,video,rope,tilesprite');
        grunt.option('filename', 'phaser-minimum');
        grunt.option('sourcemap', true);
        grunt.option('copy', false);
        grunt.option('copycustom', true);
        grunt.option('uglify', true);

        grunt.task.run('custom');

    });

};
