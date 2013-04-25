'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      options : {
        jshintrc : '.jshintrc'
      },
      all: ['Gruntfile.js', 'tasks/**/*.js', 'test/**/*.js']
    },
    open : {
      dev : {
        path : 'http://127.0.0.1/~jsoverson/'
      },
      google : {
        url : 'http://google.com/'
      },
      file : {
        file : '/etc/hosts'
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Load local tasks.
  grunt.loadTasks('tasks');

  // Default task.
  grunt.registerTask('default', ['jshint','open']);

};
