/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

// var CONST = require('../const');

function Config (config)
{
    if (config === undefined) { config = {}; }

    this.renderType = config.renderType || 0;
    this.gameTitle = config.game || 'bomberman';
}

Config.prototype.constructor = Config;

module.exports = Config;
