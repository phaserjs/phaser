/// <binding />
module.exports = function (grunt) {

    require('load-grunt-config')(grunt, {
        configPath: __dirname + '/tasks/options',
        config: {
            jitGrunt: true,
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

    grunt.registerTask('default', ['build-phaser:standard']);

    grunt.registerTask('docs', ['clean:docs', 'pixidoc', 'jsdoc:html', 'replace:docs', 'clean:out']);
    grunt.registerTask('tsdocs', ['clean:out', 'pixidoc', 'gitclone:plugins', 'jsdoc:json', 'buildtsdoc:pixi', 'buildtsdoc:phaser', 'replace:phasertsdefheader', 'clean:out']);

    grunt.registerTask(
        'dist',
        'Compile all Phaser versions and copy to the build folder',
        [
            'clean:release',
            'build-phaser:standard',
            'build-phaser:arcadephysics',
            'build-phaser:nophysics',
            'build-phaser:minimum'
        ]
    );

    // Alias the common Phaser building tasks.
    grunt.registerTask('standard', 'Builds the standard Phaser library', ['build-phaser:standard']);
    grunt.registerTask('arcadephysics', 'Phaser with Arcade Physics, Tilemaps and Particles', ['build-phaser:arcadephysics']);
    grunt.registerTask('nophysics', 'Phaser without physics, tilemaps or particles', ['build-phaser:nophysics']);
    grunt.registerTask('minimum', 'Phaser without any optional modules except Pixi', ['build-phaser:minimum']);

};
