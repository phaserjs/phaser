/*
 * grunt-contrib-connect
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  var path = require('path');
  var connect = require('connect');

  grunt.registerMultiTask('connect', 'Start a connect web server.', function() {
    // Merge task-specific options with these defaults.
    var options = this.options({
      port: 8000,
      hostname: 'localhost',
      base: '.',
      keepalive: false,
      middleware: function(connect, options) {
        return [
          // Serve static files.
          connect.static(options.base),
          // Make empty directories browsable.
          connect.directory(options.base),
        ];
      }
    });

    // Connect requires the base path to be absolute.
    options.base = path.resolve(options.base);

    // Connect will listen to all interfaces if hostname is null.
    if (options.hostname === '*') {
      options.hostname = null;
    }

    // Connect will listen to ephemeral port if asked
    if (options.port === '?') {
      options.port = 0;
    }

    var middleware = options.middleware ? options.middleware.call(this, connect, options) : [];

    // If --debug was specified, enable logging.
    if (grunt.option('debug')) {
      connect.logger.format('grunt', ('[D] server :method :url :status ' +
        ':res[content-length] - :response-time ms').magenta);
      middleware.unshift(connect.logger('grunt'));
    }

    // Start server.
    var done = this.async();
    var taskTarget = this.target;
    var keepAlive = this.flags.keepalive || options.keepalive;

    var server = connect
      .apply(null, middleware)
      .listen(options.port, options.hostname)
      .on('listening', function() {
        var address = server.address();
        grunt.log.writeln('Started connect web server on ' + (address.host || 'localhost') + ':' + address.port + '.');
        grunt.config.set('connect.' + taskTarget + '.options.host', address.host || 'localhost');
        grunt.config.set('connect.' + taskTarget + '.options.port', address.port);

        if (!keepAlive) {
          done();
        }
      })
      .on('error', function(err) {
        if (err.code === 'EADDRINUSE') {
          grunt.fatal('Port ' + options.port + ' is already in use by another process.');
        } else {
          grunt.fatal(err);
        }
      });

    // So many people expect this task to keep alive that I'm adding an option
    // for it. Running the task explicitly as grunt:keepalive will override any
    // value stored in the config. Have fun, people.
    if (keepAlive) {
      // This is now an async task. Since we don't call the "done"
      // function, this task will never, ever, ever terminate. Have fun!
      grunt.log.write('Waiting forever...\n');
    }
  });
};
