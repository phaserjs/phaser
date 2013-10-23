var umdBefore = [
  '!function(root, factory) {',
  '  if (typeof define === "function" && define.amd) {',
  '    define(factory);',
  '  } else if (typeof exports === "object") {',
  '      module.exports = factory();',
  '  } else {',
  '    root.Phaser = factory();',
  '  }',
  '}(this, function() {'
].join('\n');

var umdAfter = [
  '  return Phaser;',
  '});'
].join('\n');

module.exports = function(grunt) {
  grunt.registerMultiTask('umd', 'Create an UMD wrapper.', function() {
    this.files.forEach(function(f) {
      var src = umdBefore + '\n' + f.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        return grunt.file.read(filepath);
      }).join('\n') + umdAfter;

      grunt.file.write(f.dest, src);
    });
  });
};
