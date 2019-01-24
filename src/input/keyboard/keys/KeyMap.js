/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var KeyCodes = require('./KeyCodes');

var KeyMap = {};

for (var key in KeyCodes)
{
    KeyMap[KeyCodes[key]] = key;
}

module.exports = KeyMap;
