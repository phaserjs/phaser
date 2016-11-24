/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

var Config = require('./Config');
var DebugHeader = require('./DebugHeader');

var Game = function (config)
{
    this.config = new Config(config);

    DebugHeader(this);
};

module.exports = Game;
