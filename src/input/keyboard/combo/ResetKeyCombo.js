/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Used internally by the KeyCombo class.
 *
 * @function Phaser.Input.Keyboard.KeyCombo.ResetKeyCombo
 * @private
 * @since 3.0.0
 *
 * @param {Phaser.Input.Keyboard.KeyCombo} combo - The KeyCombo to reset.
 *
 * @return {Phaser.Input.Keyboard.KeyCombo} The KeyCombo.
 */
var ResetKeyCombo = function (combo)
{
    combo.current = combo.keyCodes[0];
    combo.index = 0;
    combo.timeLastMatched = 0;
    combo.matched = false;
    combo.timeMatched = 0;

    return combo;
};

module.exports = ResetKeyCombo;
