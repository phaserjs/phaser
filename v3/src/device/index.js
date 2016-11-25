var OS = require('./OS');
var Browser = require('./Browser');
var Features = require('./Features');
var Input = require('./Input');

var os = OS();
var browser = Browser(os);

module.exports = {

    //  Doing this makes it available under Device.OS
    OS: os,
    Browser: browser,
    Features: Features(os, browser),
    Input: Input(os, browser)

};
