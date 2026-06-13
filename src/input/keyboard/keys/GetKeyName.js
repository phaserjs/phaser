/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var KeyCodeNameMap = require('./KeyCodeNameMap');
var KeyNames = require('./KeyNames');

/**
 * Converts a keycode or key name to a human-readable Key Name
 *
 * @function Phaser.Input.Keyboard.GetKeyName
 * @since 4.1.0
 *
 * @param {(string|number)} key - The keycode or string to lookup.
 * @return {string} The human-readable key name.
 */
var GetKeyName = function (key)
{
    if (typeof key === 'string') {
        return KeyNames[key]
    }
    return KeyCodeNameMap[key]
};

module.exports = JustUp;
