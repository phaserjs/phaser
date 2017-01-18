//  This singleton is instantiated as soon as Phaser loads,
//  before a Phaser.Game instance has even been created.
//  Which means all instances of Phaser Games can share it,
//  without having to re-poll the device all over again

var OS = require('./OS');
var Browser = require('./Browser');
var Features = require('./Features');
var Input = require('./Input');
var Audio = require('./Audio');
var Video = require('./Video');
var Fullscreen = require('./Fullscreen');
var CanvasFeatures = require('./CanvasFeatures');

module.exports = {

    OS: OS,
    Browser: Browser,
    Features: Features,
    Input: Input,
    Audio: Audio,
    Video: Video,
    Fullscreen: Fullscreen,
    CanvasFeatures: CanvasFeatures

};
