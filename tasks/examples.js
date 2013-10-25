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
      if (grunt.option('verbose')) {
        if (grunt.file.exists(f.dest)) {
          grunt.verbose.writeln();
          grunt.verbose.warn('Destination file "%s" will be overridden.', f.dest);
        }
        grunt.verbose.writeln();
      }

      var results = {};
      var files = f.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return options.excludes.every(function(dir) {
            var keep = filepath.indexOf(options.base + '/' + dir + '/') < 0;
            if (!keep) {
              grunt.verbose.writeln('Skipping %s/%s/%s...', options.base, dir.inverse.red, filepath.substr(options.base.length + dir.length + 2));
            }
            return keep;
          });
        }
      });

      if (grunt.option('verbose')) {
        grunt.verbose.writeln();
        grunt.verbose.writeln('Found ' + files.length.toString().cyan + ' examples:');
        files.forEach(function(file) {
          grunt.verbose.writeln(' * '.cyan + file);
        });
      }

      files.map(function(filepath) {
        return pathToArray(filepath.substr(options.base.length + 1).split('/'));
      }).forEach(function(parts) {
        _.merge(results, parts, function(a, b) {
          var example = {
            file: encodeURIComponent(b).replace(/%20/g, '+'),
            title: b.substr(0, b.length - 3)
          };
          return _.isArray(a) ? a.concat(example) : [example];
        });
      });

      if (grunt.option('verbose')) {
        var categories = Object.keys(results);
        grunt.verbose.writeln();
        grunt.verbose.writeln('Extracted ' + categories.length.toString().cyan + ' categories:');
        categories.forEach(function(cat) {
          grunt.verbose.writeln(' * '.cyan + cat);
        });
      }

      grunt.verbose.writeln();
      grunt.verbose.or.write('Writing ' + f.dest + '...');
      grunt.file.write(f.dest, JSON.stringify(results, null, '  '));
      grunt.verbose.or.ok();
    });
  });
};
