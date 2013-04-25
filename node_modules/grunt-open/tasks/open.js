/*
 * grunt-open
 * https://github.com/joverson/grunt-open
 *
 * Copyright (c) 2012 Jarrod Overson
 * Licensed under the MIT license.
 */

'use strict';

var open = require('open');

module.exports = function(grunt) {
  grunt.registerMultiTask('open', 'Open urls and files from a grunt task', function() {
    var dest = this.data.url || this.data.file || this.data.path;

    open(dest);
  });
};
