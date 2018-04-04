/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The justUp value allows you to test if this Key has just been released or not.
 * When you check this value it will return `true` if the Key is up, otherwise `false`.
 * You can only call justUp once per key release. It will only return `true` once, until the Key is pressed down and released again.
 * This allows you to use it in situations where you want to check if this key is up without using a Signal, such as in a core game loop.
 *
 * @function Phaser.Input.Keyboard.JustUp
 * @since 3.0.0
 *
 * @param {Phaser.Input.Keyboard.Key} key - [description]
 *
 * @return {boolean} [description]
 */
var JustUp = function (key)
{
    if (key._justUp)
    {
        key._justUp = false;

        return true;
    }
    else
    {
        return false;
    }
};

module.exports = JustUp;
