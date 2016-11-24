/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

var CONST = require('../const');

var defaultBannerColor = [
    '#ff0000',
    '#ffff00',
    '#00ff00',
    '#00ffff',
    '#000000'
];

var defaultBannerTextColor = '#ffffff';

function getValue (obj, key, def)
{
    if (obj.hasOwnProperty(key))
    {
        return obj[key];
    }
    else
    {
        return def;
    }
}

function Config (config)
{
    if (config === undefined) { config = {}; }

    this.width = getValue(config, 'width', 1024);
    this.height = getValue(config, 'height', 768);

    this.resolution = getValue(config, 'resolution', 1);

    this.renderType = getValue(config, 'type', CONST.AUTO);

    this.parent = getValue(config, 'parent', null);

    this.stateConfig = getValue(config, 'state', null);

    this.rngSeed = getValue(config, 'seed', (Date.now() * Math.random()).toString());

    this.gameTitle = getValue(config, 'title', '');
    this.gameURL = getValue(config, 'url', 'http://phaser.io');
    this.gameVersion = getValue(config, 'version', '');

    //  If you do: { banner: false } it won't display any banner at all
    var banner = getValue(config, 'banner', null);

    this.hideBanner = (banner === false);

    if (!banner)
    {
        //  Use the default banner set-up
        banner = {};
    }

    this.hidePhaser = getValue(banner, 'hidePhaser', false);
    this.bannerTextColor = getValue(banner, 'text', defaultBannerTextColor);
    this.bannerBackgroundColor = getValue(banner, 'background', defaultBannerColor);
}

Config.prototype.constructor = Config;

module.exports = Config;
