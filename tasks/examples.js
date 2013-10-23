var path = require('path');
var _ = require('lodash');

function pathToArray(parts) {
  var part = parts.shift();
  if (parts.length > 0) {
    var obj = {};
    obj[part] = pathToArray(parts);
    return obj;
  } else {
    return part;
  }
}

module.exports = function(grunt) {
  grunt.registerMultiTask('examples', 'Build examples site.', function() {
    var options = this.options({
      base: '',
      excludes: []
    });

    this.files.forEach(function(f) {
      var results = {};
      f.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          filepath = path.relative(options.base, filepath);
          return options.excludes.every(function(dir) {
            return filepath.indexOf(dir + '/') < 0;
          });
        }
      }).map(function(filepath) {
        return pathToArray(path.relative(options.base, filepath).split('/'));
      }).forEach(function(parts) {
        _.merge(results, parts, function(a, b) {
          var example = {
            file: encodeURIComponent(b).replace(/%20/g, '+'),
            title: b.substr(0, b.length - 3)
          };
          return _.isArray(a) ? a.concat(example) : [example];
        });
      });

      grunt.file.write(f.dest, JSON.stringify(results, null, '  '));
    });
  });
};
