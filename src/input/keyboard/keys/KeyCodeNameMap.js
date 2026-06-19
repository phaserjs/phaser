/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var KeyCodes = require('./KeyCodes');
var KeyNames = require('./KeyNames');

var KeyCodeNameMap = {};

for (var key in KeyCodes)
{
    KeyCodeNameMap[KeyCodes[key]] = KeyNames[key];
}

module.exports = KeyCodeNameMap;
