/// <binding />
module.exports = function (grunt) {

    require('load-grunt-config')(grunt, {
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
