/*
 * gaze
 * https://github.com/shama/gaze
 *
 * Copyright (c) 2012 Kyle Robinson Young
 * Licensed under the MIT license.
 */

'use strict';

// libs
var events = require('events');
var fs = require('fs');
var path = require('path');
var fileset = require('fileset');
var minimatch = require('minimatch');
var Gaze;

// globals
var delay = 10;

// Main entry point. Start watching and call done when setup
module.exports = function gaze(files, opts, done) {
  return new Gaze(files, opts, done);
};

// Node v0.6 compat
fs.existsSync = fs.existsSync || path.existsSync;
path.sep = path.sep || path.normalize('/');

// CoffeeScript's __extends utility
var __extends = function(child, parent) {
  for (var key in parent) {
    if ({}.hasOwnProperty.call(parent, key)) {
      child[key] = parent[key];
    }
  }
  function Ctor() {
    this.constructor = child;
  }
  Ctor.prototype = parent.prototype;
  child.prototype = new Ctor();
  child.__super__ = parent.prototype;
  return child;
};

// lodash helpers

var ArrayPrototype = Array.prototype;
var toString = Object.prototype.toString;
var has = Object.prototype.hasOwnProperty;

function defaults(obj, source) {
  for (var prop in source) {
    if (obj[prop] == null) {
      obj[prop] = source[prop];
    }
  }

  return obj;
}

function unique() {
  var array = ArrayPrototype.concat.apply(ArrayPrototype, arguments);
  var result = [];

  for (var i = 0; i < array.length; i++) {
    if (result.indexOf(array[i]) === -1) {
      result.push(array[i]);
    }
  }

  return result;
}

function union() {
  return unique.apply(null, arguments);
}

function isString(obj) {
  return toString.call(obj) === '[object String]';
}

function isEmpty(obj) {
  if (obj == null) { return true; }

  if (Array.isArray(obj) || isString(obj)) { return obj.length === 0; }

  for (var key in obj) {
    if (has.call(obj, key)) { return false; }
  }

  return true;
}

// async helper

function forEachSeries(arr, iterator, callback) {
  if (!arr.length) { return callback(); }

  var completed = 0;

  var iterate = function() {
    iterator(arr[completed], function (err) {
      if (err) {
        callback(err);
        callback = function() {};
      } else {
        completed += 1;

        if (completed === arr.length) {
          callback(null);
        } else {
          iterate();
        }
      }
    });
  };

  iterate();
}

// other helpers

// Returns boolean whether filepath is dir terminated
function _isDir(dir) {
  if (typeof dir !== 'string') { return false; }
  return (dir.slice(-(path.sep.length)) === path.sep);
}

// Create a `key:[]` if doesnt exist on `obj` then push or concat the `val`
function _objectPush(obj, key, val) {
  if (obj[key] == null) { obj[key] = []; }
  if (Array.isArray(val)) { obj[key] = obj[key].concat(val); }
  else if (val) { obj[key].push(val); }
  return obj[key] = unique(obj[key]);
}

// Ensures the dir is marked with path.sep
function _markDir(dir) {
  if (typeof dir === 'string' &&
    dir.slice(-(path.sep.length)) !== path.sep &&
    dir !== '.') {
    dir += path.sep;
  }
  return dir;
}

// Changes path.sep to unix ones for testing
function _unixifyPathSep(filepath) {
  return (process.platform === 'win32') ? String(filepath).replace(/\\/g, '/') : filepath;
}

// `Gaze` EventEmitter object to return in the callback
Gaze = module.exports.Gaze = __extends(function(files, opts, done) {
  var _this = this;

  // If second arg is the callback
  if (typeof opts === 'function') {
    done = opts;
    opts = {};
  }

  // Default options
  this.options = defaults(opts || {}, {
    // Tell glob to mark directories
    mark: true,
    // Interval to pass to fs.watchFile
    interval: 100,
    // Delay for events called in succession for the same file/event
    debounceDelay: 500
  });

  // Default done callback
  done = done || function() {};

  // Remember our watched dir:files
  this._watched = Object.create(null);

  // Store watchers
  this._watchers = Object.create(null);

  // Store patterns
  this._patterns = [];

  // Cached events for debouncing
  this._cached = Object.create(null);

  // Set maxListeners
  if (this.options.maxListeners) {
    this.setMaxListeners(this.options.maxListeners);
    Gaze.__super__.setMaxListeners(this.options.maxListeners);
    delete this.options.maxListeners;
  }

  // Initialize the watch on files
  this.add(files, done);

  return this;
}, events.EventEmitter);

// Override the emit function to emit `all` events
// and debounce on duplicate events per file
Gaze.prototype.emit = function() {
  var _this = this;
  var args = arguments;

  var e = args[0];
  var filepath = args[1];
  var timeoutId;

  // If not added/deleted/changed/renamed then just emit the event
  if (e.slice(-2) !== 'ed') {
    Gaze.__super__.emit.apply(_this, args);
    return this;
  }

  // Detect rename event, if added and previous deleted is in the cache
  if (e === 'added') {
    Object.keys(this._cached).forEach(function(oldFile) {
      if (_this._cached[oldFile].indexOf('deleted') !== -1) {
        args[0] = e = 'renamed';
        [].push.call(args, oldFile);
        delete _this._cached[oldFile];
        return false;
      }
    });
  }

  // If cached doesnt exist, create a delay before running the next
  // then emit the event
  var cache = this._cached[filepath] || [];
  if (cache.indexOf(e) === -1) {
    _objectPush(_this._cached, filepath, e);
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function() {
      delete _this._cached[filepath];
    }, this.options.debounceDelay);
    // Emit the event and `all` event
    Gaze.__super__.emit.apply(_this, args);
    Gaze.__super__.emit.apply(_this, ['all', e].concat([].slice.call(args, 1)));
  }

  return this;
};

// Close watchers
Gaze.prototype.close = function(_reset) {
  var _this = this;
  _reset = _reset === false ? false : true;
  Object.keys(_this._watchers).forEach(function(file) {
    _this._watchers[file].close();
  });
  _this._watchers = Object.create(null);
  Object.keys(this._watched).forEach(function(dir) {
    fs.unwatchFile(dir);
    _this._watched[dir].forEach(function(uFile) {
      fs.unwatchFile(uFile);
    });
  });
  if (_reset) {
    _this._watched = Object.create(null);
    setTimeout(function() {
      _this.emit('end');
     _this.removeAllListeners();
   }, delay + 100);
  }
  return _this;
};

// Add file patterns to be watched
Gaze.prototype.add = function(files, done) {
  var _this = this;
  if (typeof files === 'string') {
    files = [files];
  }
  this._patterns = union(this._patterns, files);

  var include = [], exclude = [];
  this._patterns.forEach(function(p) {
    if (p.slice(0, 1) === '!') {
      exclude.push(p.slice(1));
    } else {
      include.push(p);
    }
  });

  fileset(include, exclude, _this.options, function(err, files) {
    if (err) {
      _this.emit('error', err);
      return done(err);
    }
    _this._addToWatched(files);
    _this.close(false);
    _this._initWatched(done);
  });
};

// Remove file/dir from `watched`
Gaze.prototype.remove = function(file) {
  var _this = this;
  if (this._watched[file]) {
    // is dir, remove all files
    fs.unwatchFile(file);
    this._watched[file].forEach(fs.unwatchFile);
    delete this._watched[file];
  } else {
    // is a file, find and remove
    Object.keys(this._watched).forEach(function(dir) {
      var index = _this._watched[dir].indexOf(file);
      if (index) {
        fs.unwatchFile(file);
        delete _this._watched[dir][index];
        return false;
      }
    });
  }
  if (this._watchers[file]) {
    this._watchers[file].close();
  }
  return this;
};

// Return watched files
Gaze.prototype.watched = function() {
  return this._watched;
};

// Returns `watched` files with relative paths to process.cwd()
Gaze.prototype.relative = function(dir, unixify) {
  var _this = this;
  var relative = Object.create(null);
  var relDir, relFile, unixRelDir;
  var cwd = this.options.cwd || process.cwd();
  if (dir === '') { dir = '.'; }
  dir = _markDir(dir);
  unixify = unixify || false;
  Object.keys(this._watched).forEach(function(dir) {
    relDir = path.relative(cwd, dir) + path.sep;
    if (relDir === path.sep) { relDir = '.'; }
    unixRelDir = unixify ? _unixifyPathSep(relDir) : relDir;
    relative[unixRelDir] = _this._watched[dir].map(function(file) {
      relFile = path.relative(path.join(cwd, relDir), file);
      if (_isDir(file)) {
        relFile = _markDir(relFile);
      }
      if (unixify) {
        relFile = _unixifyPathSep(relFile);
      }
      return relFile;
    });
  });
  if (dir && unixify) {
    dir = _unixifyPathSep(dir);
  }
  return dir ? relative[dir] || [] : relative;
};

// Adds files and dirs to watched
Gaze.prototype._addToWatched = function(files) {
  var _this = this;
  var dir, parent;
  var cwd = _this.options.cwd || process.cwd();
  files.forEach(function(file) {
    var filepath = path.resolve(cwd, file);

    // if mark false, use stat to figure the isDir
    // the '/' mark comes from node-glob but we convert it to path.sep
    if (_this.options.mark === false) {
      if (fs.statSync(filepath).isDirectory()) {
        file += '/';
      }
    }

    if (file.slice(-1) === '/') {
      // is dir, init key and sub folder
      filepath = _markDir(filepath);
      _objectPush(_this._watched, filepath);
      parent = path.dirname(filepath) + path.sep;
      _objectPush(_this._watched, parent, filepath);
    } else {
      // is file, add to dir
      dir = path.dirname(filepath) + path.sep;
      _objectPush(_this._watched, dir, filepath);
    }
  });
  return this;
};

// Returns true if the file matches this._patterns
Gaze.prototype._isMatch = function(file) {
  var include = [], exclude = [];
  this._patterns.forEach(function(p) {
    if (p.slice(0, 1) === '!') {
      exclude.push(p.slice(1));
    } else {
      include.push(p);
    }
  });
  var matched = false, i = 0;
  for (i = 0; i < include.length; i++) {
    if (minimatch(file, include[i])) {
      matched = true;
      break;
    }
  }
  for (i = 0; i < exclude.length; i++) {
    if (minimatch(file, exclude[i])) {
      matched = false;
      break;
    }
  }
  return matched;
};

Gaze.prototype._watchDir = function(dir, done) {
  var _this = this;
  try {
    _this._watchers[dir] = fs.watch(dir, function(event) {
      // race condition. Let's give the fs a little time to settle down. so we
      // don't fire events on non existent files.
      setTimeout(function() {
        if (fs.existsSync(dir)) {
          done(null, dir);
        }
      }, delay + 100);
    });
  } catch (err) {
    return this._handleError(err);
  }
  return this;
};

Gaze.prototype._pollFile = function(file, done) {
    var _this = this;
    var opts = { persistent: true, interval: _this.options.interval };
    try {
      fs.watchFile(file, opts, function(curr, prev) {
        done(null, file);
      });
    } catch (err) {
      return this._handleError(err);
    }
  return this;
};

// Initialize the actual watch on `watched` files
Gaze.prototype._initWatched = function(done) {
  var _this = this;
  var cwd = this.options.cwd || process.cwd();
  var curWatched = Object.keys(_this._watched);
  forEachSeries(curWatched, function(dir, next) {
    var files = _this._watched[dir];
    // Triggered when a watched dir has an event
    _this._watchDir(dir, function(event, dirpath) {
      var relDir = cwd === dir ? '.' : path.relative(cwd, dir);

      fs.readdir(dirpath, function(err, current) {
        if (err) { return _this.emit('error', err); }
        if (!current) { return; }

        try {
          // append path.sep to directories so they match previous.
          current = current.map(function(curPath) {
            if (fs.existsSync(curPath) && fs.statSync(path.join(dir, curPath)).isDirectory()) {
              return curPath + path.sep;
            } else {
              return curPath;
            }
          });
        } catch (err) {
          // race condition-- sometimes the file no longer exists
        }

        // Get watched files for this dir
        var previous = _this.relative(relDir);

        // If file was deleted
        previous.filter(function(file) {
          return current.indexOf(file) < 0;
        }).forEach(function(file) {
          if (!_isDir(file)) {
            var filepath = path.join(dir, file);
            _this.remove(filepath);
            _this.emit('deleted', filepath);
          }
        });

        // If file was added
        current.filter(function(file) {
          return previous.indexOf(file) < 0;
        }).forEach(function(file) {
          // Is it a matching pattern?
          var relFile = path.join(relDir, file);
          // TODO: this can be optimized more
          // we shouldnt need isMatch() and could just use add()
          if (_this._isMatch(relFile)) {
            // Add to watch then emit event
            _this.add(relFile, function() {
              _this.emit('added', path.join(dir, file));
            });
          }
        });

      });
    });

    // Watch for change/rename events on files
    files.forEach(function(file) {
      if (_isDir(file)) { return; }
      _this._pollFile(file, function(err, filepath) {
        // Only emit changed if the file still exists
        // Prevents changed/deleted duplicate events
        // TODO: This ignores changed events on folders, maybe support this?
        //       When a file is added, a folder changed event emits first
        if (fs.existsSync(filepath)) {
          _this.emit('changed', filepath);
        }
      });
    });

    next();
  }, function() {

    // Return this instance of Gaze
    // delay before ready solves a lot of issues
    setTimeout(function() {
      _this.emit('ready', _this);
      done.call(_this, null, _this);
    }, delay + 100);

  });
};

// If an error, handle it here
Gaze.prototype._handleError = function(err) {
  if (err.code === 'EMFILE') {
    return this.emit('error', new Error('EMFILE: Too many opened files.'));
  }
  return this.emit('error', err);
};
