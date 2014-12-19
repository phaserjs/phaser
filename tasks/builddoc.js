/**
* A quick stub-task for running generating the JSDocs.
* This should probably be migrated to use grunt-jsdoc@beta (for jsdoc 3.x) or similar.
*/
'use strict';

module.exports = function (grunt) {

  grunt.registerTask('builddoc', 'Builds the project documentation', function () {

    var done = this.async();

    grunt.util.spawn({
      cmd: 'jsdoc',
      args: ['-c', './tasks/jsdoc-conf.json', './README.md'],
    }, function (error, result, code) {
        if (error) {
            grunt.fail.warn("" + result);
            done(false);
        } else {
            done();
        }
    });

  });

};
