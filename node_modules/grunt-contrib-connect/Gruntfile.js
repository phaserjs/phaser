/*
 * grunt-contrib-connect
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    nodeunit: {
      tests: ['test/*_test.js']
    },

    connect: {
      custom_base: {
        options: {
          base: 'test',
        },
      },
      custom_port: {
        options: {
          port: 9000,
        },
      },
      custom_middleware: {
        options: {
          port: 9001,
          middleware: function(connect, options) {
            // Return array of whatever middlewares you want
            return [
              function(req, res, next) {
                res.end('Hello from port ' + options.port);
              }
            ];
          },
        },
      },
    }
  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-internal');

  grunt.registerTask('test', ['connect', 'nodeunit']);
  grunt.registerTask('default', ['jshint', 'test', 'build-contrib']);
};
