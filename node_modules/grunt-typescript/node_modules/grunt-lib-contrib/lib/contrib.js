/*
 * grunt-lib-contrib
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 Tyler Kellen, contributors
 * Licensed under the MIT license.
 */

exports.init = function(grunt) {
  'use strict';

  var exports = {};

  var path = require('path');

  exports.getNamespaceDeclaration = function(ns) {
    var output = [];
    var curPath = 'this';
    if (ns !== 'this') {
      var nsParts = ns.split('.');
      nsParts.forEach(function(curPart, index) {
        if (curPart !== 'this') {
          curPath += '[' + JSON.stringify(curPart) + ']';
          output.push(curPath + ' = ' + curPath + ' || {};');
        }
      });
    }

    return {
      namespace: curPath,
      declaration: output.join('\n')
    };
  };

  // Convert an object to an array of CLI arguments
  exports.optsToArgs = function(options) {
    var args = [];

    Object.keys(options).forEach(function(flag) {
      var val = options[flag];

      flag = flag.replace(/[A-Z]/g, function(match) {
        return '-' + match.toLowerCase();
      });

      if (val === true) {
        args.push('--' + flag);
      }

      if (grunt.util._.isString(val)) {
        args.push('--' + flag, val);
      }

      if (grunt.util._.isNumber(val)) {
        args.push('--' + flag, '' + val);
      }

      if (grunt.util._.isArray(val)) {
        val.forEach(function(arrVal) {
          args.push('--' + flag, arrVal);
        });
      }
    });

    return args;
  };

  // Strip a path from a path. normalize both paths for best results.
  exports.stripPath = function(pth, strip) {
    if (strip && strip.length >= 1) {
      strip = path.normalize(strip);
      pth = path.normalize(pth);
      pth = grunt.util._(pth).strRight(strip);
      pth = grunt.util._(pth).ltrim(path.sep);
    }

    return pth;
  };

  // Log min and max info
  function minMaxGzip(src) {
    return src ? require('zlib-browserify').gzipSync(src) : '';
  }
  exports.minMaxInfo = function(min, max) {
    var gzipSize = String(minMaxGzip(min).length);
    grunt.log.writeln('Uncompressed size: ' + String(max.length).green + ' bytes.');
    grunt.log.writeln('Compressed size: ' + gzipSize.green + ' bytes gzipped (' + String(min.length).green + ' bytes minified).');
  };

  return exports;
};
