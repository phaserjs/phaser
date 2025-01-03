/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Used internally by the KeyCombo class.
 * Return `true` if it reached the end of the combo, `false` if not.
 *
 * @function Phaser.Input.Keyboard.AdvanceKeyCombo
 * @private
 * @since 3.0.0
 *
 * @param {KeyboardEvent} event - The native Keyboard Event.
 * @param {Phaser.Input.Keyboard.KeyCombo} combo - The KeyCombo object to advance.
 *
 * @return {boolean} `true` if it reached the end of the combo, `false` if not.
 */
var AdvanceKeyCombo = function (event, combo)
{
    combo.timeLastMatched = event.timeStamp;
    combo.index++;

    if (combo.index === combo.size)
    {
        return true;
    }
    else
    {
        combo.current = combo.keyCodes[combo.index];
        return false;
    }
};

module.exports = AdvanceKeyCombo;
