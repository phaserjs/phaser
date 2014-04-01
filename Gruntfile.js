module.exports = function (grunt) {
    var loadConfig = require('load-grunt-config');

    loadConfig(grunt, {
        configPath: __dirname + '/tasks/options',
        config: {
            release_dir: 'build',
            compile_dir: 'dist'
        }
    });

    grunt.loadTasks('tasks');

    grunt.registerTask('default', ['build']);

    grunt.registerTask('build', ['clean', 'jshint', 'concat', 'uglify']);
    grunt.registerTask('dist', ['build', 'copy']);

};
