/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var KeyCodes = require('./KeyCodes');

var KeyMap = {};

for (var key in KeyCodes)
{
    KeyMap[KeyCodes[key]] = key;
}

module.exports = KeyMap;
