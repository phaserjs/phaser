/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

var CONST = require('../const');
var NOOP = require('../utils/NOOP');
var GetObjectValue = require('../utils/GetObjectValue');

var defaultBannerColor = [
    '#ff0000',
    '#ffff00',
    '#00ff00',
    '#00ffff',
    '#000000'
];

var defaultBannerTextColor = '#ffffff';

var Config = function (config)
{
    if (config === undefined) { config = {}; }

    this.width = GetObjectValue(config, 'width', 1024);
    this.height = GetObjectValue(config, 'height', 768);

    this.resolution = GetObjectValue(config, 'resolution', 1);

    this.renderType = GetObjectValue(config, 'type', CONST.AUTO);

    this.parent = GetObjectValue(config, 'parent', null);
    this.canvas = GetObjectValue(config, 'canvas', null);
    this.canvasStyle = GetObjectValue(config, 'canvasStyle', null);

    this.stateConfig = GetObjectValue(config, 'state', null);

    this.seed = GetObjectValue(config, 'seed', [ (Date.now() * Math.random()).toString() ]);

    this.gameTitle = GetObjectValue(config, 'title', '');
    this.gameURL = GetObjectValue(config, 'url', 'http://phaser.io');
    this.gameVersion = GetObjectValue(config, 'version', '');

    //  If you do: { banner: false } it won't display any banner at all
    this.hideBanner = (GetObjectValue(config, 'banner', null) === false);

    this.hidePhaser = GetObjectValue(config, 'banner.hidePhaser', false);
    this.bannerTextColor = GetObjectValue(config, 'banner.text', defaultBannerTextColor);
    this.bannerBackgroundColor = GetObjectValue(config, 'banner.background', defaultBannerColor);
   
    this.forceSetTimeOut = GetObjectValue(config, 'forceSetTimeOut', false);
    this.transparent = GetObjectValue(config, 'transparent', false);
    this.pixelArt = GetObjectValue(config, 'pixelArt', false);

    //  Callbacks
    this.preBoot = GetObjectValue(config, 'callbacks.preBoot', NOOP);
    this.postBoot = GetObjectValue(config, 'callbacks.postBoot', NOOP);
};

Config.prototype.constructor = Config;

module.exports = Config;
