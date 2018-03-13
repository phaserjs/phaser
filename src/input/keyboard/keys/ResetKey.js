/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 *  Resets a Key object back to its default settings.
 *  Optionally resets the keyCode as well.
 *
 * @function Phaser.Input.Keyboard.Keys.ResetKey
 * @since 3.0.0
 *
 * @param {Phaser.Input.Keyboard.Key} key - [description]
 * @param {boolean} [clearKeyCode=false] - [description]
 *
 * @return {Phaser.Input.Keyboard.Key} [description]
 */
var ResetKey = function (key, clearKeyCode)
{
    if (clearKeyCode === undefined) { clearKeyCode = false; }

    key.preventDefault = false;
    key.enabled = true;
    key.isDown = false;
    key.isUp = true;
    key.altKey = false;
    key.ctrlKey = false;
    key.shiftKey = false;
    key.timeDown = 0;
    key.duration = 0;
    key.timeUp = 0;
    key.repeats = 0;
    key._justDown = false;
    key._justUp = false;

    if (clearKeyCode)
    {
        key.keyCode = 0;
        key.char = '';
    }

    return key;
};

module.exports = ResetKey;
