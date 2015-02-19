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
            filelist: [],
            banner: require('fs').readFileSync(__dirname + '/tasks/banner.txt', 'utf8')
        }
    });

    grunt.loadTasks('tasks');

    grunt.registerTask('default', ['build']);

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

        var defaults = {

            'all': [ 'ninja' ],
            'minimal': [ 'keyboard', 'gamepad', 'graphics', 'text', 'retrofont', 'bitmapdata', 'rendertexture', 'tweens', 'sound', 'particles', 'debug', 'tilemaps', 'arcade', 'p2', 'ninja' ],
            'nophysics': [ 'ninja', 'p2', 'arcade', 'tilemaps', 'particles' ],
            'arcade': [ 'ninja', 'p2' ],
            'p2': [ 'ninja', 'arcade', 'particles' ],
            'arcadeMobile': [ 'ninja', 'p2', 'keyboard', 'gamepad' ],

        };

        grunt.log.writeln("----------------------------");
        grunt.log.writeln("Building Phaser " + grunt.config.get('package.version') + '-custom');
        grunt.log.writeln("----------------------------");

        if (!grunt.option('exclude'))
        {
            grunt.log.writeln("\nUse --exclude to select which of the following modules to exclude:\n");

            for (var key in modules)
            {
                if (modules[key].optional)
                {
                    grunt.log.writeln(key + ' - ' + modules[key].description);
                }
            }

            grunt.log.writeln("\nFor example: --exclude p2,tilemap,retrofont\n");

            grunt.log.writeln("Note that some modules have dependencies on others.\n");

            grunt.fail.fatal("No build options were specified.");
        }
        else
        {
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

            //  Clean the dist folder
            var tasks = [ 'clean:dist' ];

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

            grunt.task.run(tasks);

            // grunt.log.writeln("\nCustom build of Phaser available in dist/phaser-custom.js\n");

        }

    });

    grunt.registerTask('test', ['clean:dist', 'concat', 'uglify']);

    grunt.registerTask('build', ['clean:dist', 'jshint', 'concat', 'uglify']);

    grunt.registerTask('dist', ['replace:pixi', 'replace:p2', 'build', 'copy']);

    grunt.registerTask('docs', ['clean:docs', 'pixidoc', 'jsdoc:html', 'replace:docs', 'clean:out']);

    grunt.registerTask('tsdocs', ['clean:out', 'pixidoc', 'gitclone:plugins', 'jsdoc:json', 'buildtsdoc:pixi', 'buildtsdoc:phaser', 'replace:phasertsdefheader', 'clean:out']);
};
