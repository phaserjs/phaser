/**
 * Used internally by the KeyCombo class.
 * Return `true` if it reached the end of the combo, `false` if not.
 *
 * @function Phaser.Input.Keyboard.KeyCombo.AdvanceKeyCombo
 * @since 3.0.0
 *
 * @param {[type]} event - [description]
 * @param {[type]} combo - [description]
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
