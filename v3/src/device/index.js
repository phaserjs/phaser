var OS = require('./OS');
var Browser = require('./Browser');
var Features = require('./Features');
var Input = require('./Input');
var Audio = require('./Audio');
var Video = require('./Video');
var Fullscreen = require('./Fullscreen');

var os = OS();
var browser = Browser(os);

module.exports = {

    //  Doing this makes it available under Device.OS
    OS: os,
    Browser: browser,
    Features: Features(os, browser),
    Input: Input(os, browser),
    Audio: Audio(os, browser),
    Video: Video(os, browser),
    Fullscreen: Fullscreen()

};
