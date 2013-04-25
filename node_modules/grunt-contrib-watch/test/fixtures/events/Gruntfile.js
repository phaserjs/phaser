module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    watch: {
      files: ['lib/*.js']
    }
  });

  // Load this watch task
  grunt.loadTasks('../../../tasks');

  // trigger on watch events
  grunt.event.on('watch', function(action, filepath) {
    grunt.log.writeln(filepath + ' was indeed ' + action);
    if (action === 'deleted') { grunt.util.exit(0); }
  });
};
