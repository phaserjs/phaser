/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The justUp value allows you to test if this Key has just been released or not.
 *
 * When you check this value it will return `true` if the Key is up, otherwise `false`.
 *
 * You can only call JustUp once per key release. It will only return `true` once, until the Key is pressed down and released again.
 * This allows you to use it in situations where you want to check if this key is up without using an event, such as in a core game loop.
 *
 * @function Phaser.Input.Keyboard.JustUp
 * @since 3.0.0
 *
 * @param {Phaser.Input.Keyboard.Key} key - The Key to check to see if it's just up or not.
 *
 * @return {boolean} `true` if the Key was just released, otherwise `false`.
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
