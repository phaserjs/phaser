/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The justDown value allows you to test if this Key has just been pressed down or not.
 *
 * When you check this value it will return `true` if the Key is down, otherwise `false`.
 *
 * You can only call justDown once per key press. It will only return `true` once, until the Key is released and pressed down again.
 * This allows you to use it in situations where you want to check if this key is down without using an event, such as in a core game loop.
 *
 * @function Phaser.Input.Keyboard.JustDown
 * @since 3.0.0
 *
 * @param {Phaser.Input.Keyboard.Key} key - The Key to check to see if it's just down or not.
 *
 * @return {boolean} `true` if the Key was just pressed, otherwise `false`.
 */
var JustDown = function (key)
{
    if (key._justDown)
    {
        key._justDown = false;

        return true;
    }
    else
    {
        return false;
    }
};

module.exports = JustDown;
