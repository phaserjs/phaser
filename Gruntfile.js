module.exports = function (grunt) {

    var loadConfig = require('load-grunt-config');

    loadConfig(grunt, {
        configPath: __dirname + '/tasks/options',
        config: {
            release_dir: 'build',
            compile_dir: 'dist',
            docs_dir: 'docs',
            banner: require('fs').readFileSync(__dirname + '/tasks/banner.txt', 'utf8')
        }
    });

    grunt.loadTasks('tasks');

    grunt.registerTask('default', ['build']);

    grunt.registerTask('build', ['clean:dist', 'jshint', 'concat', 'uglify']);

    grunt.registerTask('dist', ['replace:pixi', 'replace:p2', 'build', 'copy']);

    grunt.registerTask('docs', [ 'clean:docs', 'pixidoc', 'builddoc', 'replace:docs', 'clean:out']);

};
