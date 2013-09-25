var utils = require('./utils');

module.exports = function(grunt) {

  grunt.registerMultiTask('process', function() {
    this.files.forEach(function(f) {
      var src = f.src.filter(function(filepath) {
        return grunt.file.exists(filepath);
      }).map(function(filepath) {
        return grunt.file.read(filepath);
      }).join();

      grunt.file.write(f.dest, utils.process(src, grunt.config('pkg').version));
    });
  });

};
