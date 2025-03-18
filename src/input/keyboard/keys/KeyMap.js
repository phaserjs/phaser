/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var KeyCodes = require('./KeyCodes');

var KeyMap = {};

for (var key in KeyCodes)
{
    KeyMap[KeyCodes[key]] = key;
}

module.exports = KeyMap;
