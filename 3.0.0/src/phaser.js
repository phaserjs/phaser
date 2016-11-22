require('./polyfills');

var boot = require('./boot');

module.exports = boot;

global.Phaser = boot;
