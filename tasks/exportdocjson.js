/**
* A quick stub-task for export the jsdoc in a JSON file
* This should probably be migrated to use grunt-jsdoc@beta (for jsdoc 3.x) or similar.
*/
'use strict';

module.exports = function (grunt) {

    grunt.registerTask('exportdocjson', 'Export the project documentation in json format', function () {

    var done = this.async();

    grunt.util.spawn({
      cmd: 'jsdoc',
      args: ['-c', './tasks/jsdocexportjson-conf.json'],
    }, function (error, result, code) {
        if (error) {
            //grunt.fail.warn("" + result);
            done();
        } else {
            done();
        }
    });
    
  });
};
