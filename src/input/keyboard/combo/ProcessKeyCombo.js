/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var AdvanceKeyCombo = require('./AdvanceKeyCombo');

/**
 * Used internally by the KeyCombo class.
 *
 * @function Phaser.Input.Keyboard.KeyCombo.ProcessKeyCombo
 * @since 3.0.0
 *
 * @param {KeyboardEvent} event - [description]
 * @param {Phaser.Input.Keyboard.KeyCombo} combo - [description]
 *
 * @return {boolean} [description]
 */
var ProcessKeyCombo = function (event, combo)
{
    if (combo.matched)
    {
        return true;
    }

    var comboMatched = false;
    var keyMatched = false;

    if (event.keyCode === combo.current)
    {
        //  Key was correct

        if (combo.index > 0 && combo.maxKeyDelay > 0)
        {
            //  We have to check to see if the delay between
            //  the new key and the old one was too long (if enabled)

            var timeLimit = combo.timeLastMatched + combo.maxKeyDelay;

            //  Check if they pressed it in time or not
            if (event.timeStamp <= timeLimit)
            {
                keyMatched = true;
                comboMatched = AdvanceKeyCombo(event, combo);
            }
        }
        else
        {
            keyMatched = true;

            //  We don't check the time for the first key pressed, so just advance it
            comboMatched = AdvanceKeyCombo(event, combo);
        }
    }

    if (!keyMatched && combo.resetOnWrongKey)
    {
        //  Wrong key was pressed
        combo.index = 0;
        combo.current = combo.keyCodes[0];
    }

    if (comboMatched)
    {
        combo.timeLastMatched = event.timeStamp;
        combo.matched = true;
        combo.timeMatched = event.timeStamp;
    }

    return comboMatched;
};

module.exports = ProcessKeyCombo;
